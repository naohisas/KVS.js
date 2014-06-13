KVS.SingleCubeData = function()
{
    var volume = new KVS.StructuredVolumeObject();
    volume.resolution.set( 2, 2, 2 );
    volume.values = [ [0], [20], [30] , [100], [150], [60], [200], [250] ];
    volume.setMinMaxCoords( new KVS.Vec3( 0, 0, 0 ), new KVS.Vec3( 1, 1, 1 ) );
    volume.setMinMaxValues( 0, 255 );
    return volume;
}
