KVS.TornadoData = function( dimx, dimy, dimz )
{
    var volume = new KVS.StructuredVolumeObject();
    volume.resolution.set( dimx, dimy, dimz );

    var t = 0;
    var dx = 1.0 / ( dimx - 1.0 );
    var dy = 1.0 / ( dimy - 1.0 );
    var dz = 1.0 / ( dimz - 1.0 );
    for ( var k = 0; k < dimz; k++ )
    {
        var z  = k * dz;
        var xc = 0.5 + 0.1 * Math.sin( 0.04 * t + 10.0 * z );
        var yc = 0.5 + 0.1 * Math.cos( 0.03 * t + 3.0 * z );
        var r  = 0.1 + 0.4 * z * z + 0.1 * z * Math.sin( 8.0 * z );
        var r2 = 0.2 + 0.1 * z;
        for ( var j = 0; j < dimy; j++ )
        {
            var y = j * dy;
            for ( var i = 0; i < dimx; i++ )
            {
                var x = i * dx;
                var temp  = Math.sqrt( ( y - yc ) * ( y - yc ) + ( x - xc ) * ( x - xc ) );
                var scale = Math.abs( r - temp );
                scale = scale > r2 ? 0.8 - scale : 1.0;

                var z0 = 0.1 * ( 0.1 - temp * z );
                if ( z0 < 0.0 )  z0 = 0.0;
                temp = Math.sqrt( temp * temp + z0 * z0 );

                var epsiron = 0.00000000001;
                scale = ( r + r2 - temp ) * scale / ( temp + epsiron );
                scale = scale / ( 1 + z );

                var v0 = scale *  ( y - yc ) + 0.1 * ( x - xc );
                var v1 = scale * -( x - xc ) + 0.1 * ( y - yc );
                var v2 = scale * z0;
                volume.values.push( [ v0, v1, v2 ] );
            }
        }
    }

    volume.updateMinMaxCoords();
    volume.updateMinMaxValues();

    return volume;
};

// DEPRECATED
KVS.CreateTornadoData = function( dimx, dimy, dimz )
{
    var volume = new KVS.StructuredVolumeObject();
    volume.resolution.set( dimx, dimy, dimz );

    var t = 0;
    var dx = 1.0 / ( dimx - 1.0 );
    var dy = 1.0 / ( dimy - 1.0 );
    var dz = 1.0 / ( dimz - 1.0 );
    for ( var k = 0; k < dimz; k++ )
    {
        var z  = k * dz;
        var xc = 0.5 + 0.1 * Math.sin( 0.04 * t + 10.0 * z );
        var yc = 0.5 + 0.1 * Math.cos( 0.03 * t + 3.0 * z );
        var r  = 0.1 + 0.4 * z * z + 0.1 * z * Math.sin( 8.0 * z );
        var r2 = 0.2 + 0.1 * z;
        for ( var j = 0; j < dimy; j++ )
        {
            var y = j * dy;
            for ( var i = 0; i < dimx; i++ )
            {
                var x = i * dx;
                var temp  = Math.sqrt( ( y - yc ) * ( y - yc ) + ( x - xc ) * ( x - xc ) );
                var scale = Math.abs( r - temp );
                scale = scale > r2 ? 0.8 - scale : 1.0;

                var z0 = 0.1 * ( 0.1 - temp * z );
                if ( z0 < 0.0 )  z0 = 0.0;
                temp = Math.sqrt( temp * temp + z0 * z0 );

                var epsiron = 0.00000000001;
                scale = ( r + r2 - temp ) * scale / ( temp + epsiron );
                scale = scale / ( 1 + z );

                var v0 = scale *  ( y - yc ) + 0.1 * ( x - xc );
                var v1 = scale * -( x - xc ) + 0.1 * ( y - yc );
                var v2 = scale * z0;
                volume.values.push( [ v0, v1, v2 ] );
            }
        }
    }

    volume.updateMinMaxCoords();
    volume.updateMinMaxValues();

    return volume;
};
