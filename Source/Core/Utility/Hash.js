// Hash table
KVS.Hash = function()
{
    this.bucket = {};
};

KVS.Hash.prototype =
{
    constructor: KVS.Hash,

    insert: function( key, value )
    {
        this.bucket[key] = value;
    },

    find: function( key )
    {
        return this.bucket[key];
    },

    remove: function( key )
    {
        delete this.bucket[key];
    },

    contains: function( key )
    {
        return this.bucket.hasOwnProperty( key );
    },

    each: function( func )
    {
        for ( var key in this.bucket ) { func( key ); }
    },
};
