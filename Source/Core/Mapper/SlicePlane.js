// SlicePlane
KVS.SlicePlane = function()
{
    this.coef = new KVS.Vec4();
};

KVS.SlicePlane.prototype =
{
    constructor: KVS.SlicePlane,

    setPlane: function()
    {
        if ( arguments.length == 4 )
        {
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            this.setPlaneWithCoefficients( a, b, c, d );
        }
        else if ( arguments.length == 2 )
        {
            var point = arguments[0];
            var normal = arguments[1];
            this.setPlaneWithPointAndNormal( point, normal );
        }
    },

    setPlaneWithCoefficients: function( a, b, c, d )
    {
        this.coef = new KVS.Vec4( a, b, c, d );
    },

    setPlaneWithPointAndNormal: function( point, normal )
    {
        var w = point.clone().mulScalar( -1 ).dot( normal );
        this.coef = new KVS.Vec4( normal.x, normal.y, normal.z, w );
    },

    exec: function( object )
    {
        if ( object instanceof KVS.StructuredVolumeObject )
        {
            return marching_cubes( object, this.coef );
        }
        else
        {
            return new KVS.PolygonObject();
        }

        function marching_cubes( object, coef )
        {
            var polygon = new KVS.PolygonObject();
            var lut = new KVS.MarchingCubesTable();

            var smin = object.min_value;
            var smax = object.max_value;

            for ( var z = 0; z < object.resolution.z - 1; z++ )
            {
                for ( var y = 0; y < object.resolution.y - 1; y++ )
                {
                    for ( var x = 0; x < object.resolution.x - 1; x++ )
                    {
                        var index = table_index( x, y, z );
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

                            var v01 = interpolated_vertex( v0, v1 );
                            var v23 = interpolated_vertex( v2, v3 );
                            var v45 = interpolated_vertex( v4, v5 );

                            polygon.coords.push( v01 );
                            polygon.coords.push( v23 );
                            polygon.coords.push( v45 );

                            var s0 = interpolated_value( v0, v1 );
                            var s1 = interpolated_value( v2, v3 );
                            var s2 = interpolated_value( v4, v5 );
                            var c0 = KVS.RainbowColorMap( smin, smax, s0 );
                            var c1 = KVS.RainbowColorMap( smin, smax, s1 );
                            var c2 = KVS.RainbowColorMap( smin, smax, s2 );

                            polygon.colors.push( c0.toArray() );
                            polygon.colors.push( c1.toArray() );
                            polygon.colors.push( c2.toArray() );
                        }
                    }
                }
            }

            var nfaces = polygon.coords.length / 3;
            for ( var i = 0; i < nfaces; i++ )
            {
                var indices = [ 3 * i, 3 * i + 1, 3 * i + 2 ];
                polygon.connections.push( indices );
            }

            return polygon;

            function table_index( x, y, z )
            {
                var s0 = plane_function( x,     y,     z     );
                var s1 = plane_function( x + 1, y,     z     );
                var s2 = plane_function( x + 1, y + 1, z     );
                var s3 = plane_function( x,     y + 1, z     );
                var s4 = plane_function( x,     y,     z + 1 );
                var s5 = plane_function( x + 1, y,     z + 1 );
                var s6 = plane_function( x + 1, y + 1, z + 1 );
                var s7 = plane_function( x,     y + 1, z + 1 );

                var index = 0;
                if ( s0 > 0 ) { index |=   1; }
                if ( s1 > 0 ) { index |=   2; }
                if ( s2 > 0 ) { index |=   4; }
                if ( s3 > 0 ) { index |=   8; }
                if ( s4 > 0 ) { index |=  16; }
                if ( s5 > 0 ) { index |=  32; }
                if ( s6 > 0 ) { index |=  64; }
                if ( s7 > 0 ) { index |= 128; }

                return index;
            }

            function interpolated_vertex( v0, v1 )
            {
                var s0 = plane_function( v0.x, v0.y, v0.z );
                var s1 = plane_function( v1.x, v1.y, v1.z );
                var a = Math.abs( s0 / ( s1 - s0 ) );

                var x = KVS.Mix( v0.x, v1.x, a );
                var y = KVS.Mix( v0.y, v1.y, a );
                var z = KVS.Mix( v0.z, v1.z, a );

                return [ x, y, z ];
            }

            function interpolated_value( v0, v1 )
            {
                var s0 = plane_function( v0.x, v0.y, v0.z );
                var s1 = plane_function( v1.x, v1.y, v1.z );
                var a = Math.abs( s0 / ( s1 - s0 ) );

                var line_size = object.numberOfNodesPerLine();
                var slice_size = object.numberOfNodesPerSlice();
                var id0 = Math.floor( v0.x + v0.y * line_size + v0.z * slice_size );
                var id1 = Math.floor( v1.x + v1.y * line_size + v1.z * slice_size );

                return KVS.Mix( object.values[id0][0], object.values[id1][0], a );
            }

            function plane_function( x, y, z )
            {
                return coef.x * x + coef.y * y + coef.z * z + coef.w;
            }
        }
    },
};
