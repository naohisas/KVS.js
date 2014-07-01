// Bounding box
KVS.BoundingBox = function()
{
    this.color = new KVS.Vec3();
    this.width = 1;
};

KVS.BoundingBox.prototype =
{
    constructor: KVS.BoundingBox,

    setColor: function( color )
    {
        this.color = color;
    },

    setWidth: function( width )
    {
        this.width = width;
    },

    exec: function( object )
    {
        var minx = object.min_coord.x;
        var miny = object.min_coord.y;
        var minz = object.min_coord.z;

        var maxx = object.max_coord.x;
        var maxy = object.max_coord.y;
        var maxz = object.max_coord.z;

        var v0 = [ minx, miny, minz ];
        var v1 = [ maxx, miny, minz ];
        var v2 = [ maxx, miny, maxz ];
        var v3 = [ minx, miny, maxz ];
        var v4 = [ minx, maxy, minz ];
        var v5 = [ maxx, maxy, minz ];
        var v6 = [ maxx, maxy, maxz ];
        var v7 = [ minx, maxy, maxz ];

        var line = new KVS.LineObject();
        line.coords.push( v0 ); line.coords.push( v1 );
        line.coords.push( v1 ); line.coords.push( v2 );
        line.coords.push( v2 ); line.coords.push( v3 );
        line.coords.push( v3 ); line.coords.push( v0 );
        line.coords.push( v4 ); line.coords.push( v5 );
        line.coords.push( v5 ); line.coords.push( v6 );
        line.coords.push( v6 ); line.coords.push( v7 );
        line.coords.push( v7 ); line.coords.push( v4 );
        line.coords.push( v0 ); line.coords.push( v4 );
        line.coords.push( v1 ); line.coords.push( v5 );
        line.coords.push( v2 ); line.coords.push( v6 );
        line.coords.push( v3 ); line.coords.push( v7 );

        line.line_type = KVS.SegmentLine;
        line.width = this.width;
        line.colors.push( this.color.toArray() );
        line.setMinMaxCoords( object.min_coord, object.max_coord );

        return line;
    },
};
