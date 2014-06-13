KVS.SingleTetData = function()
{
    var volume = new KVS.UnstructuredVolumeObject();
    volume.coords = [ [0,0,3], [0,3,-3], [-3,-3,-3], [3,-3,-3] ];
    volume.connections = [ [0,1,2,3] ];
    volume.values = [ [1], [2], [3], [4] ];
    volume.updateMinMaxCoords();
    volume.updateMinMaxValues();
    return volume;
}
