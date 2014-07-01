// Extract edges
KVS.ExtractEdge = function()
{
    this.color = new KVS.Vec3();
    this.width = 1;
};

KVS.ExtractEdge.prototype =
{
    constructor: KVS.ExtractEdge,

    setColor: function( color )
    {
        this.color = color;
    },

    setWidth: function( width )
    {
        this.width = width;
    },

    exec: function( volume )
    {
        var line = new KVS.LineObject();

        if ( !( volume instanceof KVS.UnstructuredVolumeObject ) )
        {
            return line;
        }

        if ( volume.numberOfNodesPerCell() != 4 )
        {
            return line;
        }

        var ncells = volume.numberOfCells();
        for ( var i = 0; i < ncells; i++ )
        {
            var id = volume.connections[i];
            var v0 = volume.coords[ id[0] ];
            var v1 = volume.coords[ id[1] ];
            var v2 = volume.coords[ id[2] ];
            var v3 = volume.coords[ id[3] ];

            line.coords.push( v0 ); line.coords.push( v1 );
            line.coords.push( v0 ); line.coords.push( v2 );
            line.coords.push( v0 ); line.coords.push( v3 );
            line.coords.push( v1 ); line.coords.push( v2 );
            line.coords.push( v2 ); line.coords.push( v3 );
            line.coords.push( v3 ); line.coords.push( v1 );
        }

        line.line_type = KVS.SegmentLine;
        line.width = this.width;
        line.colors.push( this.color.toArray() );
        line.setMinMaxCoords( volume.min_coord, volume.max_coord );

        return line;
    },
};
