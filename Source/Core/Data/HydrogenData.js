KVS.HydrogenData = function( dimx, dimy, dimz )
{
    var volume = new KVS.StructuredVolumeObject();
    volume.resolution.set( dimx, dimy, dimz );

    var kr1 = 32.0 / dimx;
    var kr2 = 32.0 / dimy;
    var kr3 = 32.0 / dimz;
    var kd = 6.0;

    var index = 0;
    for ( var z = 0; z < dimz; ++z )
    {
        var dz = kr3 * ( z - ( dimz / 2.0 ) );
        for ( var y = 0; y < dimy; ++y )
        {
            var dy = kr2 * ( y - ( dimy / 2.0 ) );
            for ( var x = 0; x < dimx; ++x )
            {
                var dx = kr1 * ( x - ( dimx / 2.0 ));
                var r = Math.sqrt( dx * dx + dy * dy + dz * dz );
                var cos_theta = dz / r;
                var phi = kd * ( r*r ) * Math.exp( -r/2 ) * ( 3 * cos_theta * cos_theta - 1 );

                var c = phi * phi;
                if ( c > 255.0 ) { c = 255.0; }

                volume.values.push( [c] );
            }
        }
    }

    volume.updateMinMaxCoords();
    volume.setMinMaxValues( 0, 255 );

    return volume;
};

// DEPRECATED
KVS.CreateHydrogenData = function( dimx, dimy, dimz )
{
    var volume = new KVS.StructuredVolumeObject();
    volume.resolution.set( dimx, dimy, dimz );

    var kr1 = 32.0 / dimx;
    var kr2 = 32.0 / dimy;
    var kr3 = 32.0 / dimz;
    var kd = 6.0;

    var index = 0;
    for ( var z = 0; z < dimz; ++z )
    {
        var dz = kr3 * ( z - ( dimz / 2.0 ) );
        for ( var y = 0; y < dimy; ++y )
        {
            var dy = kr2 * ( y - ( dimy / 2.0 ) );
            for ( var x = 0; x < dimx; ++x )
            {
                var dx = kr1 * ( x - ( dimx / 2.0 ));
                var r = Math.sqrt( dx * dx + dy * dy + dz * dz );
                var cos_theta = dz / r;
                var phi = kd * ( r*r ) * Math.exp( -r/2 ) * ( 3 * cos_theta * cos_theta - 1 );

                var c = phi * phi;
                if ( c > 255.0 ) { c = 255.0; }

                volume.values.push( [c] );
            }
        }
    }

    volume.updateMinMaxCoords();
    volume.setMinMaxValues( 0, 255 );

    return volume;
};
