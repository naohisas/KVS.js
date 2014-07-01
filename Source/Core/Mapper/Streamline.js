// Streamline
KVS.Streamline = function()
{
    this.line_width = 1;
    this.seed_point = new KVS.Vec3();
    this.integration_step_length = 0.5;
    this.integration_time = 300;
    this.integration_method = KVS.RungeKutta4; // KVS.Euler, KVS.RungeKutta2, or KVS.RungeKutta4
    this.integration_direction = KVS.ForwardDirection; // KVS.ForwardDirection, KVS.BackwardDirection
};

KVS.Streamline.prototype =
{
    constructor: KVS.Streamline,

    setLineWidth: function( width )
    {
        this.line_width = width;
    },

    setSeedPoint: function( p )
    {
        this.seed_point.set( p.x, p.y, p.z );
    },

    setIntegrationStepLength: function( length )
    {
        this.integration_step_length = length;
    },

    setIntegrationTime: function( time )
    {
        this.integration_time = time;
    },

    setIntegrationMethod: function( method )
    {
        this.integration_method = method;
    },

    setIntegrationDirection: function( direction )
    {
        this.integration_direction = direction;
    },

    exec: function( volume )
    {
        var line = new KVS.LineObject();

        if ( !( volume instanceof KVS.StructuredVolumeObject ) )
        {
            return line;
        }

        if ( volume.vectorLength() != 3 )
        {
            return line;
        }

        if ( !inside_volume( this.seed_point ) )
        {
            return line;
        }

        var vertex = this.seed_point;
        var coords = [];
        var colors = [];

        var value = interpolated_value( vertex );
        var color = interpolated_color( value );
        coords.push( vertex.toArray() );
        colors.push( color.toArray() );

        var method = this.integration_method;
        var integrator = [ euler, runge_kutta_2, runge_kutta_4 ];
        var step_length = this.integration_step_length * this.integration_direction;
        for ( var i = 0; i < this.integration_time; i++ )
        {
            vertex = next_vertex( vertex, step_length, integrator[ method ] );
            if ( !inside_volume( vertex ) ) { break; }

            value = interpolated_value( vertex );
            color = interpolated_color( value );

            coords.push( vertex.toArray() );
            colors.push( color.toArray() );
        }

        line.line_type = KVS.StripLine;
        line.width = this.line_width;
        line.coords = coords;
        line.colors = colors;
        line.min_coord = volume.min_coord;
        line.max_coord = volume.max_coord;

        return line;

        function next_vertex( p, step_length, integrator )
        {
            return integrator( p, step_length );
        }

        function euler( p, step_length )
        {
            var k0 = step_length;
            var v1 = p;

            // p + k1;
            var k1 = direction( v1 ).mulScalar( k0 );
            return p.clone().add( k1 );
        }

        function runge_kutta_2( p, step_length )
        {
            var k0 = step_length;
            var v1 = p;

            // v2 = p + k1 / 2;
            var k1 = direction( v1 ).mulScalar( k0 );
            var v2 = p.clone().add( k1.clone().divScalar( 2 ) );
            if ( !inside_volume( v2 ) ) { return p; }

            // p + k2;
            var k2 = direction( v2 ).mulScalar( k0 );
            return p.clone().add( k2 );
        }

        function runge_kutta_4( p, step_length )
        {
            var k0 = step_length;
            var v1 = p;

            // v2 = p + k1 / 2;
            var k1 = direction( v1 ).mulScalar( k0 );
            var v2 = p.clone().add( k1.clone().divScalar( 2 ) );
            if ( !inside_volume( v2 ) ) { return p; }

            // v3 = p + k2 / 2;
            var k2 = direction( v2 ).mulScalar( k0 );
            var v3 = p.clone().add( k2.clone().divScalar( 2 ) );
            if ( !inside_volume( v3 ) ) { return p; }

            // v4 = p + k3;
            var k3 = direction( v3 ).mulScalar( k0 );
            var v4 = p.clone().add( k3 );
            if ( !inside_volume( v4 ) ) { return p; }

            // p + ( k1 + 2.0 * ( k2 + k3 ) + k4 ) / 6.0
            var k4 = direction( v4 ).mulScalar( k0 );
            var tmp1 = k2.clone().add( k3 ).mulScalar( 2 );
            var tmp2 = k1.clone().add( tmp1 ).add( k4 ).divScalar( 6 );
            return p.clone().add( tmp2 );
        }

        function direction( p )
        {
            return interpolated_value( p ).normalize();
        }

        function interpolated_value( p )
        {
            var cell = new KVS.Vec3( Math.floor( p.x ), Math.floor( p.y ), Math.floor( p.z ) );
            var indices = cell_node_indices( index_of( cell ) );

            var local = p.clone().sub( cell );
            var N = interpolation_function( local );

            var ret = new KVS.Vec3();
            for ( var i = 0; i < 8; i++ )
            {
                var v = new KVS.Vec3().fromArray( volume.values[ indices[i] ] );
                ret.add( v.mulScalar( N[i] ) );
            }

            return ret;

            function index_of( cell )
            {
                var dim = volume.resolution;
                return cell.x + dim.x * cell.y + dim.x * dim.y * cell.z;
            }

            function cell_node_indices( cell_index )
            {
                var lines = volume.numberOfNodesPerLine();
                var slices = volume.numberOfNodesPerSlice();

                var id0 = cell_index;
                var id1 = id0 + 1;
                var id2 = id1 + lines;
                var id3 = id0 + lines;
                var id4 = id0 + slices;
                var id5 = id1 + slices;
                var id6 = id2 + slices;
                var id7 = id3 + slices;

                return [ id0, id1, id2, id3, id4, id5, id6, id7 ];
            }

            function interpolation_function( p )
            {
                var x = p.x;
                var y = p.y;
                var z = p.z;

                var N0 = ( 1 - x ) * ( 1 - y ) * z;
                var N1 = x * ( 1 - y ) * z;
                var N2 = x * y * z;
                var N3 = ( 1 - x ) * y * z;
                var N4 = ( 1 - x ) * ( 1 - y ) * ( 1 - z );
                var N5 = x * ( 1 - y ) * ( 1 - z );
                var N6 = x * y * ( 1 -z );
                var N7 = ( 1 - x ) * y * ( 1 - z );

                return [ N0, N1, N2, N3, N4, N5, N6, N7 ];
            }
        }

        function interpolated_color( v )
        {
            var smin = volume.min_value;
            var smax = volume.max_value;
            return KVS.RainbowColorMap( smin, smax, v.length() );
        }

        function inside_volume( p )
        {
            var dimx = volume.resolution.x;
            var dimy = volume.resolution.y;
            var dimz = volume.resolution.z;

            if ( p.x < 0 || dimx - 1 < p.x ) return false;
            if ( p.y < 0 || dimy - 1 < p.y ) return false;
            if ( p.z < 0 || dimz - 1 < p.z ) return false;

            return true;
        }
    },
};
