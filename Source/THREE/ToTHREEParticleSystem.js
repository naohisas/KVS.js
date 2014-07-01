KVS.ToTHREEParticleSystem = function( point )
{
    // In order to draw a point as round-shaped point, the defulat fragment shader
    // defined for THREE.ParticleSystemMaterial is over-written with the following
    // fragment shader.
    THREE.ShaderLib['particle_basic'].fragmentShader =
        [
            "uniform vec3 psColor;",
            "uniform float opacity;",
            THREE.ShaderChunk[ "color_pars_fragment" ],
            THREE.ShaderChunk[ "map_particle_pars_fragment" ],
            THREE.ShaderChunk[ "fog_pars_fragment" ],
            THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
            THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],
            "void main() {",
            /*add*/"vec3 n;",
            /*add*/"n.xy = gl_PointCoord * 2.0 - 1.0;",
            /*add*/"n.z = 1.0 - dot( n.xy, n.xy );",
            /*add*/"if ( n.z < 0.0 ) discard;",
            "    gl_FragColor = vec4( psColor, opacity );",
            THREE.ShaderChunk[ "logdepthbuf_fragment" ],
            THREE.ShaderChunk[ "map_particle_fragment" ],
            THREE.ShaderChunk[ "alphatest_fragment" ],
            THREE.ShaderChunk[ "color_fragment" ],
            THREE.ShaderChunk[ "shadowmap_fragment" ],
            THREE.ShaderChunk[ "fog_fragment" ],
            "}"
        ].join('\n');

    var geometry = new THREE.Geometry();
    var material = new THREE.ParticleSystemMaterial();

    material.size = point.size;

    if ( point.colors.length == 0 )
    {
        material.color = new THREE.Color( "white" );
    }
    else if ( point.colors.length == 1 )
    {
        var c = point.colors[0];
        material.color = new THREE.Color( c[0], c[1], c[2] );
    }
    else // if ( point.colors.length == point.coords.length )
    {
        material.vertexColors = true;
        for ( var i = 0; i < point.colors.length; i++ )
        {
            var c = point.colors[i];
            geometry.colors.push( new THREE.Color( c[0], c[1] ,c[2] ) );
        }
    }

    var nvertices = point.coords.length;
    for ( var i = 0; i < nvertices; i++ )
    {
        var v = new THREE.Vector3().fromArray( point.coords[i] );
        geometry.vertices.push( v );
    }

    return new THREE.ParticleSystem( geometry, material );
};
