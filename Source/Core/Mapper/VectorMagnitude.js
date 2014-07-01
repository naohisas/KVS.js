// Vector magnitude
KVS.VectorMagnitude = function()
{
};

KVS.VectorMagnitude.prototype =
{
    constructor: KVS.VectorMagnitude,

    exec: function( volume )
    {
        if ( volume.vectorLength() != 3 ) { return volume; }

        var svolume = new KVS.StructuredVolumeObject();
        svolume.resolution = volume.resolution;

        var values = [];
        var nnodes = volume.numberOfNodes();
        for ( var i = 0; i < nnodes; i++ )
        {
            var s = new KVS.Vec3().fromArray( volume.values[i] ).length();
            values.push( [s] );
        }

        svolume.values = values;
        svolume.min_coord = volume.min_coord;
        svolume.max_coord = volume.max_coord;
        svolume.min_value = volume.min_value;
        svolume.max_value = volume.max_value;

        return svolume;
    }
};
