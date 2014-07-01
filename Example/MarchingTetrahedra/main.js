function main()
{
    //var volume = new KVS.SingleTetData();
    var volume = new KVS.SPXData();
    var screen = new KVS.THREEScreen();

    screen.init( volume );
    setup();
    screen.loop();

    function setup()
    {
        var color = new KVS.Vec3( 1, 1, 1 );
        var edge = new KVS.ExtractEdge();
        edge.setColor( color );
        edge.setWidth( 1 );

        var smin = volume.min_value;
        var smax = volume.max_value;
        var isovalue = KVS.Mix( smin, smax, 0.5 );
        var isosurface = new KVS.Isosurface();
        isosurface.setIsovalue( isovalue );

        var line = KVS.ToTHREELine( edge.exec( volume ) );
        var mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );
        screen.scene.add( line );
        screen.scene.add( mesh );
        screen.draw();
    }
}
