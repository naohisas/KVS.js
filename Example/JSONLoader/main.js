function main( data )
{
    var volume = new KVS.JSONLoader( data );
    var screen = new KVS.THREEScreen();

    var z = volume.max_coord.max() * 1.8;
    screen.init( volume.objectCenter() );
    screen.camera.position.set( 0, 0, z );
    screen.camera.up.set( 0, 0, 1 );
    setup();
    screen.loop();

    function setup()
    {
        var color = new KVS.Vec3( 1, 1, 1 );
        var box = new KVS.BoundingBox();
        box.setColor( color );
        box.setWidth( 5 );

        var smin = volume.min_value;
        var smax = volume.max_value;
        var isovalue = KVS.Mix( smin, smax, 0.5 );
        var isosurface = new KVS.Isosurface();
        isosurface.setIsovalue( isovalue );

        var line = KVS.ToTHREELine( box.exec( volume ) );
        var mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );
        screen.scene.add( line );
        screen.scene.add( mesh );
        screen.draw();
    }
}
