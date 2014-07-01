// OrthoSlice
KVS.OrthoSlice = function()
{
    this.module = new KVS.SlicePlane();
};

KVS.OrthoSlice.prototype =
{
    constructor: KVS.OrthoSlice,

    setPlane: function( position, axis )
    {
        var normal = new KVS.Mat3().identity().row[ axis ];
        this.module.setPlaneWithPointAndNormal( normal.clone().mul( position ), normal );
    },

    exec: function( object )
    {
        return this.module.exec( object );
    },
};
