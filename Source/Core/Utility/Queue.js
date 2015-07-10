KVS.Queue = function()
{
    this.bucket = [];
};

KVS.Queue.prototype =
{
    constructor: KVS.Queue,

    enqueue: function( element )
    {
        this.bucket.push( element );
    },

    dequeue: function()
    {
        return this.bucket.shift();
    },

    size: function()
    {
        return this.bucket.length;
    },

    peek: function()
    {
        return ( this.bucket.length > 0 ) ? this.bucket[0] : null;
    },

    empty: function()
    {
        return ( this.bucket.length == 0 );
    },
};
