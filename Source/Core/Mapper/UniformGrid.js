// Uniform grid
KVS.UniformGrid = function( volume, grid_index )
{
    this.volume = volume;
    this.base_indices = new KVS.Vec3( -1, -1, -1 );
    this.values = [ [], [], [], [], [], [], [], [] ];
    this.interpolation_functions = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
    if ( grid_index != undefined ) { this.bind( grid_index ); }
};

KVS.UniformGrid.prototype =
{
    constructor: KVS.UniformGrid,

    bind: function( grid_index )
    {
        this.base_indices = this.baseIndicesOf( grid_index );

        var nlines = this.volume.numberOfNodesPerLine();
        var nslices = this.volume.numberOfNodesPerSlice();
        var indices = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
        indices[0] = this.base_indices.x + this.base_indices.y * nlines + this.base_indices.z * nslices;
        indices[1] = indices[0] + 1;
        indices[2] = indices[1] + nlines;
        indices[3] = indices[0] + nlines;
        indices[4] = indices[0] + nslices;
        indices[5] = indices[1] + nslices;
        indices[6] = indices[2] + nslices;
        indices[7] = indices[3] + nslices;

        for ( var i = 0; i < indices.length; i++ )
        {
            this.values[i] = this.volume.values[ indices[i] ];
            this.interpolation_functions[i] = 0;
        }
    },

    setLocalPoint: function( local )
    {
        this.updateInterpolationFunctions( local );
    },

    globalToLocal: function( global )
    {
        var p = global.x - this.base_indices.x;
        var q = global.y - this.base_indices.y;
        var r = global.z - this.base_indices.z;
        return new KVS.Vec3( p, q, r );
    },

    value: function()
    {
        var N = this.interpolation_functions;
        var nnodes = this.values.length;
        var veclen = this.values[0].length;

        var v = [];
        for ( var i = 0; i < veclen; i++ )
        {
            v[i] = 0;
            for ( var j = 0; j < nnodes; j++ )
            {
                v[i] += this.values[j][i] * N[j];
            }
        }

        return v;
    },

    updateInterpolationFunctions: function( local )
    {
        var p = local.x;
        var q = local.y;
        var r = local.z;

        var N = this.interpolation_functions;
        N[0] = ( 1 - p ) * ( 1 - q ) * r;
        N[1] = p * ( 1 - q ) * r;
        N[2] = p * q * r;
        N[3] = ( 1 - p ) * q * r;
        N[4] = ( 1 - p ) * ( 1 - q ) * ( 1 - r );
        N[5] = p * ( 1 - q ) * ( 1 - r );
        N[6] = p * q * ( 1 - r );
        N[7] = ( 1 - p ) * q * ( 1 - r );
    },

    findGrid: function( global )
    {
        var dim = this.volume.resolution;
        if ( global.x < 0 || global.x >= dim.x - 1 ) { return -1; }
        if ( global.y < 0 || global.y >= dim.y - 1 ) { return -1; }
        if ( global.z < 0 || global.z >= dim.z - 1 ) { return -1; }

        var i = Math.floor( global.x );
        var j = Math.floor( global.y );
        var k = Math.floor( global.z );
        return this.gridIndexOf( new KVS.Vec3( i, j, k ) );
    },

    gridIndexOf: function( base_indices )
    {
        var dimx = this.volume.resolution.x - 1;
        var dimy = this.volume.resolution.y - 1;
        return base_indices.x + base_indices.y * dimx + base_indices.z * dimx * dimy;
    },

    baseIndicesOf: function( grid_index )
    {
        var dimx = this.volume.resolution.x - 1;
        var dimy = this.volume.resolution.y - 1;
        var dimxy = dimx * dimy;
        var i = Math.floor( grid_index % dimxy % dimx );
        var j = Math.floor( grid_index % dimxy / dimx );
        var k = Math.floor( grid_index / dimxy );
        return new KVS.Vec3( i, j, k );
    },
};
