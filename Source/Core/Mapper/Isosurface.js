// Isosurface
KVS.Isosurface = function()
{
    this.isovalue = 0;
};

KVS.Isosurface.prototype =
{
    constructor: KVS.Isosurface,

    setIsovalue: function( value )
    {
        this.isovalue = value;
    },

    exec: function( object )
    {
        if ( object instanceof KVS.StructuredVolumeObject )
        {
            return marching_cubes( object, this.isovalue );
        }
        else if ( object instanceof KVS.UnstructuredVolumeObject )
        {
            return marching_tetrahedra( object, this.isovalue );
        }
        else
        {
            return new KVS.PolygonObject();
        }

        function marching_cubes( object, isovalue )
        {
            var polygon = new KVS.PolygonObject();
            var lut = new KVS.MarchingCubesTable();

            var smin = object.min_value;
            var smax = object.max_value;
            isovalue = KVS.Clamp( isovalue, smin, smax );

            var cell_index = 0;
            for ( var z = 0; z < object.resolution.z - 1; z++ )
            {
                for ( var y = 0; y < object.resolution.y - 1; y++ )
                {
                    for ( var x = 0; x < object.resolution.x - 1; x++ )
                    {
                        var indices = cell_node_indices( cell_index++ );
                        var index = table_index( indices );
                        if ( index == 0 ) { continue; }
                        if ( index == 255 ) { continue; }

                        for ( var j = 0; lut.edgeID[index][j] != -1; j += 3 )
                        {
                            var eid0 = lut.edgeID[index][j];
                            var eid1 = lut.edgeID[index][j+2];
                            var eid2 = lut.edgeID[index][j+1];

                            var vid0 = lut.vertexID[eid0][0];
                            var vid1 = lut.vertexID[eid0][1];
                            var vid2 = lut.vertexID[eid1][0];
                            var vid3 = lut.vertexID[eid1][1];
                            var vid4 = lut.vertexID[eid2][0];
                            var vid5 = lut.vertexID[eid2][1];

                            var v0 = new KVS.Vec3( x + vid0[0], y + vid0[1], z + vid0[2] );
                            var v1 = new KVS.Vec3( x + vid1[0], y + vid1[1], z + vid1[2] );
                            var v2 = new KVS.Vec3( x + vid2[0], y + vid2[1], z + vid2[2] );
                            var v3 = new KVS.Vec3( x + vid3[0], y + vid3[1], z + vid3[2] );
                            var v4 = new KVS.Vec3( x + vid4[0], y + vid4[1], z + vid4[2] );
                            var v5 = new KVS.Vec3( x + vid5[0], y + vid5[1], z + vid5[2] );

                            var v01 = interpolated_vertex( v0, v1, isovalue );
                            var v23 = interpolated_vertex( v2, v3, isovalue );
                            var v45 = interpolated_vertex( v4, v5, isovalue );

                            polygon.coords.push( v01 );
                            polygon.coords.push( v23 );
                            polygon.coords.push( v45 );
                        }
                    }
                    cell_index++;
                }
                cell_index += object.numberOfNodesPerLine();
            }

            var color = KVS.RainbowColorMap( smin, smax, isovalue );
            polygon.colors.push( color.toArray() );

            var nfaces = polygon.coords.length / 3;
            for ( var i = 0; i < nfaces; i++ )
            {
                var indices = [ 3 * i, 3 * i + 1, 3 * i + 2 ];
                polygon.connections.push( indices );
            }

            return polygon;

            function cell_node_indices( cell_index )
            {
                var lines = object.numberOfNodesPerLine();
                var slices = object.numberOfNodesPerSlice();

                var id0 = cell_index;
                var id1 = id0 + 1;
                var id2 = id1 + lines;
                var id3 = id0 + lines;
                var id4 = id0 + slices;
                var id5 = id1 + slices;
                var id6 = id2 + slices;
                var id7 = id3 + slices;

                return [ id0, id1, id2, id3, id4, id5, id6, id7 ];
            }

            function table_index( indices )
            {
                var s0 = object.values[ indices[0] ][0];
                var s1 = object.values[ indices[1] ][0];
                var s2 = object.values[ indices[2] ][0];
                var s3 = object.values[ indices[3] ][0];
                var s4 = object.values[ indices[4] ][0];
                var s5 = object.values[ indices[5] ][0];
                var s6 = object.values[ indices[6] ][0];
                var s7 = object.values[ indices[7] ][0];

                var index = 0;
                if ( s0 > isovalue ) { index |=   1; }
                if ( s1 > isovalue ) { index |=   2; }
                if ( s2 > isovalue ) { index |=   4; }
                if ( s3 > isovalue ) { index |=   8; }
                if ( s4 > isovalue ) { index |=  16; }
                if ( s5 > isovalue ) { index |=  32; }
                if ( s6 > isovalue ) { index |=  64; }
                if ( s7 > isovalue ) { index |= 128; }

                return index;
            }

            function interpolated_vertex( v0, v1, s )
            {
                var id0 = index_of( v0.x, v0.y, v0.z );
                var id1 = index_of( v1.x, v1.y, v1.z );

                var s0 = object.values[id0];
                var s1 = object.values[id1];

                var a = ( s - s0 ) / ( s1 - s0 );
                var x = KVS.Mix( v0.x, v1.x, a );
                var y = KVS.Mix( v0.y, v1.y, a );
                var z = KVS.Mix( v0.z, v1.z, a );

                return [ x, y, z ];

                function index_of( x, y, z )
                {
                    var nlines = object.numberOfNodesPerLine();
                    var nslices = object.numberOfNodesPerSlice();
                    return x + y * nlines + z * nslices;
                }
            }
        }

        function marching_tetrahedra( object, isovalue )
        {
            var polygon = new KVS.PolygonObject();
            var lut = new KVS.MarchingTetrahedraTable();

            var smin = object.min_value;
            var smax = object.max_value;
            isovalue = KVS.Clamp( isovalue, smin, smax );

            var ncells = object.connections.length;
            for ( var cell_index = 0; cell_index < ncells; cell_index++ )
            {
                var indices = cell_node_indices( cell_index );
                var index = table_index( indices );
                if ( index == 0 ) { continue; }
                if ( index == 15 ) { continue; }

                for ( var j = 0; lut.edgeID[index][j] != -1; j += 3 )
                {
                    var eid0 = lut.edgeID[index][j];
                    var eid1 = lut.edgeID[index][j+1];
                    var eid2 = lut.edgeID[index][j+2];

                    var vid0 = indices[ lut.vertexID[eid0][0] ];
                    var vid1 = indices[ lut.vertexID[eid0][1] ];
                    var vid2 = indices[ lut.vertexID[eid1][0] ];
                    var vid3 = indices[ lut.vertexID[eid1][1] ];
                    var vid4 = indices[ lut.vertexID[eid2][0] ];
                    var vid5 = indices[ lut.vertexID[eid2][1] ];

                    var v0 = interpolated_vertex( vid0, vid1, isovalue );
                    var v1 = interpolated_vertex( vid2, vid3, isovalue );
                    var v2 = interpolated_vertex( vid4, vid5, isovalue );

                    polygon.coords.push( v0 );
                    polygon.coords.push( v1 );
                    polygon.coords.push( v2 );
                }
            }

            var color = KVS.RainbowColorMap( smin, smax, isovalue );
            polygon.colors.push( color.toArray() );

            var nfaces = polygon.coords.length / 3;
            for ( var i = 0; i < nfaces; i++ )
            {
                var indices = [ 3 * i, 3 * i + 1, 3 * i + 2 ];
                polygon.connections.push( indices );
            }

            return polygon;

            function cell_node_indices( cell_index )
            {
                return object.connections[ cell_index ];
            }

            function table_index( indices )
            {
                var s0 = object.values[ indices[0] ][0];
                var s1 = object.values[ indices[1] ][0];
                var s2 = object.values[ indices[2] ][0];
                var s3 = object.values[ indices[3] ][0];

                var index = 0;
                if ( s0 > isovalue ) { index |= 1; }
                if ( s1 > isovalue ) { index |= 2; }
                if ( s2 > isovalue ) { index |= 4; }
                if ( s3 > isovalue ) { index |= 8; }

                return index;
            }

            function interpolated_vertex( vid0, vid1, s )
            {
                var v0 = object.coords[vid0];
                var v1 = object.coords[vid1];

                var s0 = object.values[vid0][0];
                var s1 = object.values[vid1][0];

                var a = ( s - s0 ) / ( s1 - s0 );
                var x = KVS.Mix( v0[0], v1[0], a );
                var y = KVS.Mix( v0[1], v1[1], a );
                var z = KVS.Mix( v0[2], v1[2], a );

                return [ x, y, z ];
            }
        }
    }
};
