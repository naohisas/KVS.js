// StructuredVolumeObject
KVS.StructuredVolumeObject = function()
{
    this.resolution = new KVS.Vec3();
    this.values = [];
    this.min_coord = new KVS.Vec3();
    this.max_coord = new KVS.Vec3();
    this.min_value = 0;
    this.max_value = 0;
};

KVS.StructuredVolumeObject.prototype =
{
    constructor: KVS.StructuredVolumeObject,

    vectorLength: function()
    {
        return this.values[0].length;
    },

    numberOfNodes: function()
    {
        return this.resolution.x * this.resolution.y * this.resolution.z;
    },

    numberOfNodesPerLine: function()
    {
        return this.resolution.x;
    },

    numberOfNodesPerSlice: function()
    {
        return this.resolution.x * this.resolution.y;
    },

    numberOfNodesPerCell: function()
    {
        return 8;
    },

    numberOfCells: function()
    {
        return ( this.resolution.x - 1 ) * ( this.resolution.y - 1 ) * ( this.resolution.z - 1 );
    },

    updateMinMaxCoords: function()
    {
        var min_coord = new KVS.Vec3( 0, 0, 0 );
        var max_coord = this.resolution.clone().sub( new KVS.Vec3( 1, 1, 1 ) );

        this.min_coord = min_coord;
        this.max_coord = max_coord;
    },

    updateMinMaxValues: function()
    {
        var min_value = 0;
        var max_value = 0;

        if ( this.vectorLength() == 1 )
        {
            min_value = this.values[0][0];
            max_value = this.values[0][0];

            var nnodes = this.numberOfNodes();
            for ( var i = 0; i < nnodes; i++ )
            {
                var value = this.values[i][0];
                min_value = Math.min( min_value, value );
                max_value = Math.max( max_value, value );
            }
        }
        else if ( this.vectorLength() == 3 )
        {
            min_value = new KVS.Vec3().fromArray( this.values[0] ).length();
            max_value = new KVS.Vec3().fromArray( this.values[0] ).length();

            var nnodes = this.numberOfNodes();
            for ( var i = 0; i < nnodes; i++ )
            {
                var value = new KVS.Vec3().fromArray( this.values[i] ).length();
                min_value = Math.min( min_value, value );
                max_value = Math.max( max_value, value );
            }
        }

        this.min_value = min_value;
        this.max_value = max_value;
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

    setMinMaxValues: function( min_value, max_value )
    {
        this.min_value = min_value;
        this.max_value = max_value;
    },
};
