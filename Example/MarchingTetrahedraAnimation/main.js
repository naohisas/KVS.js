function main()
{
    var volume = new KVS.SPXData();
    var isosurface = new KVS.Isosurface();
    var mesh = undefined;
    var screen = new KVS.THREEScreen();

    screen.init( volume );
    setup();
    animation( 0.01 );
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
        isosurface.setIsovalue( isovalue );

        var line = KVS.ToTHREELine( edge.exec( volume ) );
        mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );
        screen.scene.add( line );
        screen.scene.add( mesh );
        screen.draw();
    }

    function animation( increment )
    {
        var running = true;
        var request_id = 0;

        start();
        window.addEventListener( "click", click, false );

        function update()
        {
            screen.scene.remove( mesh );

            var isovalue = isosurface.isovalue + increment;
            var smin = volume.min_value;
            var smax = volume.max_value;
            if ( smax < isovalue ) { isovalue = smin; }
            isosurface.setIsovalue( isovalue );
            mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) );

            screen.scene.add( mesh );

            request_id = window.requestAnimationFrame( update );
        }

        function start()
        {
            running = true;
            request_id = window.requestAnimationFrame( update );
        }

        function stop()
        {
            running = false;
            window.cancelAnimationFrame( request_id );
        }

        function click()
        {
            if ( running ) stop();
            else start();
        }
    }
}
