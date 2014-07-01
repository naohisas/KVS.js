
// Vector 3D
KVS.Vec3 = function( x, y, z )
{
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

KVS.Vec3.prototype =
{
    constructor: KVS.Vec3,

    clone: function()
    {
        return new KVS.Vec3( this.x, this.y, this.z );
    },

    copy: function( v )
    {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    },

    swap: function( v )
    {
        KVS.Swap( this.x, v.x );
        KVS.Swap( this.y, v.y );
        KVS.Swap( this.z, v.z );
        return this;
    },

    set: function( x, y, z )
    {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },

    fromArray: function( array )
    {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
        return this;
    },

    toArray: function()
    {
        return [ this.x, this.y, this.z ];
    },

    add: function( v )
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    },

    sub: function( v )
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    },

    mul: function( v )
    {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    },

    mulScalar: function( s )
    {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    },

    div: function( v )
    {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    },

    divScalar: function( s )
    {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    },

    length: function()
    {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    },

    normalize: function()
    {
        return this.divScalar( this.length() );
    },

    min: function()
    {
        return Math.min( this.x, Math.min( this.y, this.z ) );
    },

    max: function()
    {
        return Math.max( this.x, Math.max( this.y, this.z ) );
    },

    cross: function( v )
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;

        return this;
    },

    dot: function( v )
    {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },
};
