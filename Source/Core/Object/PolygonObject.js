// PolygonObject
KVS.PolygonObject = function()
{
    this.coords = [];
    this.colors = [];
    this.connections = [];
    this.min_coord = new KVS.Vec3();
    this.max_coord = new KVS.Vec3();
};

KVS.PolygonObject.prototype =
{
    constructor: KVS.PolygonObject,

    numberOfVertices: function()
    {
        return this.coords.length;
    },

    updateMinMaxCoords: function()
    {
        var min_coord = new KVS.Vec3().fromArray( this.coords[0] );
        var max_coord = new KVS.Vec3().fromArray( this.coords[0] );

        var nvertices = this.numberOfVertices();
        for ( var i = 0; i < nvertices; i++ )
        {
            var coord = new KVS.Vec3().fromArray( this.coords[i] );
            min_coord = KVS.Min( min_coord, coord );
            max_coord = KVS.Max( max_coord, coord );
        }

        this.min_coord = min_coord;
        this.max_coord = max_coord;
    },

    objectCenter: function()
    {
        return this.min_coord.clone().add( this.max_coord ).divScalar( 2 );
    },

    setMinMaxCoords: function( min_coord, max_coord )
    {
        this.min_coord = min_coord;
        this.max_coord = max_coord;
    },
};
