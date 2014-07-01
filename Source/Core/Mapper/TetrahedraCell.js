KVS.TetrahedraCell = function( volume, index )
{
    this.volume = volume;
    this.cell_coords = [];
    this.cell_values = [];
    this.interpolation_functions = [];
    if ( index != undefined ) { this.bind( index ); }
};

KVS.TetrahedraCell.prototype =
{
    constructor: KVS.TetrahedraCell,

    bind: function( index )
    {
        this.cell_coords = [];
        this.cell_values = [];
        this.interpolation_functions = [];

        var id = this.volume.connections[ index ];
        for ( var i = 0; i < id.length; i++ )
        {
            this.cell_coords.push( this.volume.coords[ id[i] ] );
            this.cell_values.push( this.volume.values[ id[i] ] );
            this.interpolation_functions.push( 0 );
        }
    },

    setLocalPoint: function( local )
    {
        this.updateInterpolationFunctions( local );
    },

    localToGlobal: function( local )
    {
        this.setLocalPoint( local );

        var x = 0;
        var y = 0;
        var z = 0;

        var N = this.interpolation_functions;
        for ( var i = 0; i < this.cell_coords.length; i++ )
        {
            x += this.cell_coords[i][0] * N[i];
            y += this.cell_coords[i][1] * N[i];
            z += this.cell_coords[i][2] * N[i];
        }

        return new KVS.Vec3( x, y, z );
    },

    globalToLocal: function( global )
    {
        var C3 = new KVS.Vec3().fromArray( this.cell_coords[3] );
        return this.jacobian().inverted().mulVec( global.clone().sub( C3 ) );
    },

    volume: function()
    {
        return Math.Abs( this.jacobian().determinant() ) / 6;
    },

    value: function()
    {
        var N = this.interpolation_functions;
        var nvalues = this.cell_values.length;
        var veclen = this.cell_values[0].length;

        var v = [];
        for ( var i = 0; i < veclen; i++ )
        {
            v[i] = 0;
            for ( var j = 0; j < nvalues; j++ )
            {
                v[i] += this.cell_values[j][i] * N[j];
            }
        }

        return v;
    },

    gradient: function()
    {
        var dx = this.cells_values[0][0] - this.cells_values[3][0];
        var dy = this.cells_values[1][0] - this.cells_values[3][0];
        var dz = this.cells_values[2][0] - this.cells_values[3][0];
        var g = new KVS.Vec3( dx, dy, dz );
        return this.jacobian().inverted().transposed().mulVec( g );
    },

    randomSampling: function()
    {
        var s = Math.random();
        var t = Math.random();
        var u = Math.random();

        var p, q, r;
        if ( s + t + u <= 1 )
        {
            p = s;
            q = t;
            r = u;
        }
        else if ( s - t + u  >= 1 )
        {
            p = -u + 1;
            q = -s + 1;
            r = t;
        }
        else if ( s + t - u  >= 1 )
        {
            p = -s + 1;
            q = -t + 1;
            r = u;
        }
        else if ( -s + t + u >= 1 )
        {
            p = -u + 1;
            q = s;
            r = -t + 1;
        }
        else
        {
            p = 0.5 * s - 0.5 * t - 0.5 * u + 0.5;
            q = -0.5 * s + 0.5 * t - 0.5 * u + 0.5;
            r = -0.5 * s - 0.5 * t + 0.5 * u + 0.5;
        }

        var local = new KVS.Vec3( p, q, r );
        return this.localToGlobal( local );
    },

    updateInterpolationFunctions: function( local )
    {
        var p = local.x;
        var q = local.y;
        var r = local.z;

        var N = this.interpolation_functions;
        N[0] = p;
        N[1] = q;
        N[2] = r;
        N[3] = 1 - p - q - r;
    },

    jacobian: function()
    {
        var C0 = new KVS.Vec3().fromArray( this.cell_coords[0] );
        var C1 = new KVS.Vec3().fromArray( this.cell_coords[1] );
        var C2 = new KVS.Vec3().fromArray( this.cell_coords[2] );
        var C3 = new KVS.Vec3().fromArray( this.cell_coords[3] );
        var J30 = C0.sub( C3 ).toArray();
        var J31 = C1.sub( C3 ).toArray();
        var J32 = C2.sub( C3 ).toArray();
        return new KVS.Mat3().fromArray2D( [ J30, J31, J32 ] );
    },
};
