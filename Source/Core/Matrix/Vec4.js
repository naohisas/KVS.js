// Vector 4D
KVS.Vec4 = function( x, y, z, w )
{
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
};

KVS.Vec4.prototype =
{
    constructor: KVS.Vec4,

    clone: function()
    {
        return new KVS.Vec4( this.x, this.y, this.z, this.w );
    },

    copy: function( v )
    {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    },

    swap: function( v )
    {
        KVS.Swap( this.x, v.x );
        KVS.Swap( this.y, v.y );
        KVS.Swap( this.z, v.z );
        KVS.Swap( this.w, v.w );
        return this;
    },

    set: function( x, y, z, w )
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    },

    fromArray: function( array )
    {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
        this.w = array[3];
        return this;
    },

    toArray: function()
    {
        return [ this.x, this.y, this.z, this.w ];
    },

    add: function( v )
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    },

    sub: function( v )
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    },

    mul: function( v )
    {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        this.w *= v.w;
        return this;
    },

    mulScalar: function( s )
    {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    },

    div: function( v )
    {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        this.w /= v.w;
        return this;
    },

    divScalar: function( s )
    {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        this.w /= s;
        return this;
    },

    length: function()
    {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );
    },

    normalize: function()
    {
        return this.divScalar( this.length() );
    },

    min: function()
    {
        return Math.min( this.x, Math.min( this.y, Math.min( this.z, this.w ) ) );
    },

    max: function()
    {
        return Math.max( this.x, Math.max( this.y, Math.max( this.z, this.w ) ) );
    },

    dot: function( v )
    {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    },
};
