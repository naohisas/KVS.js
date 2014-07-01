// PointObject
KVS.PointObject = function()
{
    this.size = 1;
    this.coords =[]; // [[x,y,z],[x,y,z],...]
    this.colors = []; // [[r,g,b],[r,g,b],...]
    this.min_coord = new KVS.Vec3();
    this.max_coord = new KVS.Vec3();
};

KVS.PointObject.prototype =
{
    constructor: KVS.PointObject,

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
};
