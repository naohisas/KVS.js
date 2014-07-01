// 3x3 Matrix
KVS.Mat3 = function( a00, a01, a02, a10, a11, a12, a20, a21, a22 )
{
    this.row =[];
    this.row[0] = new KVS.Vec3( a00, a01, a02 );
    this.row[1] = new KVS.Vec3( a10, a11, a12 );
    this.row[2] = new KVS.Vec3( a20, a21, a22 );
};

KVS.Mat3.prototype =
{
    constructor: KVS.Mat3,

    clone: function()
    {
        return new KVS.Mat3(
            this.row[0].x, this.row[0].y, this.row[0].z,
            this.row[1].x, this.row[1].y, this.row[1].z,
            this.row[2].x, this.row[2].y, this.row[2].z
        );
    },

    copy: function( m )
    {
        this.row[0].copy( m.row[0] );
        this.row[1].copy( m.row[1] );
        this.row[2].copy( m.row[2] );
    },

    swap: function( m )
    {
        this.row[0].swap( m.row[0] );
        this.row[1].swap( m.row[1] );
        this.row[2].swap( m.row[2] );
        return this;
    },

    set: function( a00, a01, a02, a10, a11, a12, a20, a21, a22 )
    {
        this.row[0].set( a00, a01, a02 );
        this.row[1].set( a10, a11, a12 );
        this.row[2].set( a20, a21, a22 );
        return this;
    },

    fromArray: function( array )
    {
        this.row[0].set( array[0], array[1], array[2] );
        this.row[1].set( array[3], array[4], array[5] );
        this.row[2].set( array[6], array[7], array[8] );
        return this;
    },

    fromArray2D: function( array2d )
    {
        this.row[0].fromArray( array2d[0] );
        this.row[1].fromArray( array2d[1] );
        this.row[2].fromArray( array2d[2] );
    },

    toArray: function()
    {
        return [
            this.row[0].x, this.row[0].y, this.row[0].z,
            this.row[1].x, this.row[1].y, this.row[1].z,
            this.row[2].x, this.row[2].y, this.row[2].z
        ];
    },

    toArray2D: function()
    {
        return [ this.row[0].toArray(), this.row[1].toArray(), this.row[2].toArray() ];
    },

    add: function( m )
    {
        this.row[0].add( m.row[0] );
        this.row[1].add( m.row[1] );
        this.row[2].add( m.row[2] );
        return this;
    },

    sub: function( m )
    {
        this.row[0].sub( m.row[0] );
        this.row[1].sub( m.row[1] );
        this.row[2].sub( m.row[2] );
        return this;
    },

    mul: function( m )
    {
        this.row[0].x = this.row[0].x * m.row[0].x + this.row[0].y * m.row[1].x + this.row[0].z * m.row[2].x;
        this.row[0].y = this.row[0].x * m.row[0].y + this.row[0].y * m.row[1].y + this.row[0].z * m.row[2].y;
        this.row[0].z = this.row[0].x * m.row[0].z + this.row[0].y * m.row[1].z + this.row[0].z * m.row[2].z;
        this.row[1].x = this.row[1].x * m.row[0].x + this.row[1].y * m.row[1].x + this.row[1].z * m.row[2].x;
        this.row[1].y = this.row[1].x * m.row[0].y + this.row[1].y * m.row[1].y + this.row[1].z * m.row[2].y;
        this.row[1].z = this.row[1].x * m.row[0].z + this.row[1].y * m.row[1].z + this.row[1].z * m.row[2].z;
        this.row[2].x = this.row[2].x * m.row[0].x + this.row[2].y * m.row[1].x + this.row[2].z * m.row[2].x;
        this.row[2].y = this.row[2].x * m.row[0].y + this.row[2].y * m.row[1].y + this.row[2].z * m.row[2].y;
        this.row[2].z = this.row[2].x * m.row[0].z + this.row[2].y * m.row[1].z + this.row[2].z * m.row[2].z;
        return this;
    },

    mulVec: function( v )
    {
        return new KVS.Vec3( this.row[0].dot( v ), this.row[1].dot( v ), this.row[2].dot( v ) );
    },

    mulScalar: function( s )
    {
        this.row[0].mulScalar( s );
        this.row[1].mulScalar( s );
        this.row[2].mulScalar( s );
        return this;
    },

    divScalar: function( s )
    {
        this.row[0].divScalar( s );
        this.row[1].divScalar( s );
        this.row[2].divScalar( s );
        return this;
    },

    zero: function()
    {
        this.row[0].set( 0, 0, 0 );
        this.row[1].set( 0, 0, 0 );
        this.row[2].set( 0, 0, 0 );
        return this;
    },

    identity: function()
    {
        this.row[0].set( 1, 0, 0 );
        this.row[1].set( 0, 1, 0 );
        this.row[2].set( 0, 0, 1 );
        return this;
    },

    transpose: function()
    {
        KVS.Swap( this.row[0].y, this.row[1].x );
        KVS.Swap( this.row[0].z, this.row[2].x );
        KVS.Swap( this.row[1].z, this.row[2].y );
        return this;
    },

    invert: function( determinant )
    {
        var det22 = [
            this.row[1].y * this.row[2].z - this.row[1].z * this.row[2].y,
            this.row[1].x * this.row[2].z - this.row[1].z * this.row[2].x,
            this.row[1].x * this.row[2].y - this.row[1].y * this.row[2].x,
            this.row[0].y * this.row[2].z - this.row[0].z * this.row[2].y,
            this.row[0].x * this.row[2].z - this.row[0].z * this.row[2].x,
            this.row[0].x * this.row[2].y - this.row[0].y * this.row[2].x,
            this.row[0].y * this.row[1].z - this.row[0].z * this.row[1].y,
            this.row[0].x * this.row[1].z - this.row[0].z * this.row[1].x,
            this.row[0].x * this.row[1].y - this.row[0].y * this.row[1].x,
        ];

        var det33 = this.row[0].x * det22[0] - this.row[0].y * det22[1] + this.row[0].z * det22[2];
        if ( determinant != undefined ) determinant = det33;

        this.set( det22[0], -det22[3], det22[6], -det22[1], det22[4], -det22[7], det22[2], -det22[5], det22[8] );
        this.divScalar( det33 );
        return this;
    },

    trace: function()
    {
        return this.row[0].x + this.row[1].y + this.row[2].z;
    },

    determinant: function()
    {
        return this.row[0].clone().cross( this.row[1] ).dot( this.row[2] );
    },

    transposed: function()
    {
        return this.clone().transpose();
    },

    inverted: function()
    {
        return this.clone().invert();
    },

    min: function()
    {
        return Math.min( this.row[0].min(), Math.min( this.row[1].min(), this.row[2].min() ) );
    },

    max: function()
    {
        return Math.max( this.row[0].max(), Math.max( this.row[1].max(), this.row[2].max() ) );
    },
};
