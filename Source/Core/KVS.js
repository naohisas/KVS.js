/*****************************************************************************/
/**
 *  @file   KVS.js
 *  @author Naohisa Sakamoto
 */
/*****************************************************************************/
var KVS = { REVISION: '0' };

// Line type
KVS.StripLine = 0;
KVS.SegmentLine = 1;

// Axis type
KVS.XAxis = 0;
KVS.YAxis = 1;
KVS.ZAxis = 2;

// Integration method used in the streamline calculation
KVS.Euler = 0;
KVS.RungeKutta2 = 1;
KVS.RungeKutta4 = 2;

// Trace direction used in the streamline calculation
KVS.ForwardDirection = 1;
KVS.BackwardDirection = -1;

// Utilities
KVS.Min = function( vec1, vec2 )
{
    var x = Math.min( vec1.x, vec2.x );
    var y = Math.min( vec1.y, vec2.y );
    var z = Math.min( vec1.z, vec2.z );
    return new KVS.Vec3( x, y, z );
};

KVS.Max = function( vec1, vec2 )
{
    var x = Math.max( vec1.x, vec2.x );
    var y = Math.max( vec1.y, vec2.y );
    var z = Math.max( vec1.z, vec2.z );
    return new KVS.Vec3( x, y, z );
};

KVS.Mix = function( x, y, a )
{
    return x * ( 1.0 - a ) + y * a;
};

KVS.Swap = function( a, b )
{
    b = [ a, a = b ][0];
}

KVS.Clamp = function( a, b, c )
{
    return Math.max( b, Math.min( c, a ) );
};

KVS.HSV2RGB = function( hsv )
{
    var h = hsv.x;
    var s = hsv.y;
    var v = hsv.z;

    if ( s == 0 )
    {
        return new KVS.Vec3( v, v, v );
    }
    else
    {
        var H = ( h < 1 ? h : h - 1 ) * 6.0;
        var i = Math.floor( H );

        var temp1 = v * ( 1 - s );
        var temp2 = v * ( 1 - s * ( H - i ) );
        var temp3 = v * ( 1 - s * ( 1 - H + i ) );

        var r, g, b;
        switch ( i )
        {
        case 0:  { r = v; g = temp3; b = temp1; break; }
        case 1:  { r = temp2; g = v; b = temp1; break; }
        case 2:  { r = temp1; g = v; b = temp3; break; }
        case 3:  { r = temp1; g = temp2; b = v; break; }
        case 4:  { r = temp3; g = temp1; b = v; break; }
        default: { r = v; g = temp1; b = temp2; break; }
        }

        return new KVS.Vec3( r, g, b );
    }
};

KVS.RainbowColorMap = function( smin, smax, s )
{
    var h = ( s - smin ) / ( smax - smin );
    return KVS.HSV2RGB( new KVS.Vec3( ( 1 - h ) * 0.75, 1, 1 ) );
};
