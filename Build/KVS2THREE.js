KVS.THREEScreen = function()
{
    this.width = 0;
    this.height = 0;
    this.scene = undefined;
    this.camera = undefined;
    this.light = undefined;
    this.renderer = undefined;
    this.trackball = undefined;
};

KVS.THREEScreen.prototype =
{
    constructor: KVS.THREEScreen,

    init: function( object, options )
    {
        if (options === undefined) {
            options = {};
        }
        if (options.width === undefined) {
            options.width = window.innerWidth;
        }
        if (options.height === undefined) {
            options.height = window.innerHeight;
        }
        if (options.enableAutoResize === undefined) {
            options.enableAutoResize = true;
        }
        if (options.targetDom === undefined) {
            options.targetDom = document.body;
        }

        this.width = options.width;
        this.height = options.height;

        var max_range = object.max_coord.clone().sub( object.min_coord ).max();
        var center = object.objectCenter();

        var fov = 45;
        var aspect = this.width / this.height;
        var near = 0.1;
        var far = max_range * 100;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
        this.camera.position.set( center.x, center.y, max_range * 2 );
        this.camera.up.set( 0, 1, 0 );
        this.scene.add( this.camera );

        this.light = new THREE.DirectionalLight( new THREE.Color( "white" ) );
        this.light.position.copy( this.camera.position );
        this.scene.add( this.light );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( this.width, this.height );
//        this.renderer.setClearColor( new THREE.Color( "black" ) );
        this.renderer.setClearColor( new THREE.Color( 0.828125, 0.86328125, 0.89453125 ) );

        options.targetDom.appendChild( this.renderer.domElement );

        this.trackball = new THREE.TrackballControls( this.camera, this.renderer.domElement );
        this.trackball.staticMoving = true;
        this.trackball.rotateSpeed = 3;
        this.trackball.radius = Math.min( this.width, this.height );
        this.trackball.target = center;
        this.trackball.noRotate = false;
        this.trackball.update();
        this.trackball.addEventListener( 'change', this.draw );

        if (options.enableAutoResize) {
            window.addEventListener( 'resize', this.resize.bind( this ), false );
        }
    },

    resize: function(size)
    {
        this.width = size === undefined ? window.innerWidth : size[0];
        this.height = size === undefined ? window.innerHeight : size[1];
        var aspect = this.width / this.height;

        this.renderer.setSize( this.width, this.height );
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.trackball.handleResize();
        this.draw();
    },

    draw: function()
    {
        if ( this.renderer == undefined ) return;
        this.trackball.handleResize();
        this.renderer.render( this.scene, this.camera );
        this.trackball.update();
    },

    loop: function()
    {
        requestAnimationFrame( this.loop.bind( this ) );
        this.draw();
    },
};

KVS.ToTHREELine = function( line )
{
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial();

    material.linewidth = line.width;

    if ( line.colors.length == 0 )
    {
        material.color = new THREE.Color( "white" );
    }
    else if ( line.colors.length == 1 )
    {
        var c = line.colors[0];
        material.color = new THREE.Color( c[0], c[1], c[2] );
    }
    else if ( line.colors.length == line.coords.length )
    {
        material.vertexColors = THREE.VertexColors;
        for ( var i = 0; i < line.colors.length; i++ )
        {
            var c = line.colors[i];
            geometry.colors.push( new THREE.Color( c[0], c[1] ,c[2] ) );
        }
    }
    else
    {
        material.vertexColors = THREE.FaceColors;
        console.log("Not supported.");
    }

    var nvertices = line.coords.length;
    for ( var i = 0; i < nvertices; i++ )
    {
        var v = new THREE.Vector3().fromArray( line.coords[i] );
        geometry.vertices.push( v );
    }

    var type = (line.line_type == KVS.StripLine) ? THREE.LineStrip : THREE.LinePieces;

    return new THREE.Line( geometry, material, type );
};

KVS.ToTHREEMesh = function( polygon )
{
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial();

    material.side = THREE.DoubleSide;

    var npolygons = polygon.connections.length;
    for ( var i = 0; i < npolygons; i++ )
    {
        var id = polygon.connections[i];
        geometry.faces.push( new THREE.Face3( id[0], id[1], id[2] ) );
    }

    if ( polygon.colors.length == 0 )
    {
        material.color = new THREE.Color( "white" );
    }
    else if ( polygon.colors.length == 1 )
    {
        var c = polygon.colors[0];
        material.color = new THREE.Color( c[0], c[1], c[2] );
    }
    else if ( polygon.colors.length == polygon.coords.length )
    {
        material.vertexColors = THREE.VertexColors;
        for ( var i = 0; i < npolygons; i++ )
        {
            var id0 = geometry.faces[i].a;
            var id1 = geometry.faces[i].b;
            var id2 = geometry.faces[i].c;
            var c0 = polygon.colors[id0];
            var c1 = polygon.colors[id1];
            var c2 = polygon.colors[id2];
            geometry.faces[i].vertexColors.push( new THREE.Color( c0[0], c0[1], c0[2] ) );
            geometry.faces[i].vertexColors.push( new THREE.Color( c1[0], c1[1], c1[2] ) );
            geometry.faces[i].vertexColors.push( new THREE.Color( c2[0], c2[1], c2[2] ) );
        }
    }
    else if ( polygon.colors.length == polygon.connections.length )
    {
        material.vertexColors = THREE.FaceColors;
        for ( var i = 0; i < npolygons; i++ )
        {
            var c = polygon.colors[i];
            geometry.faces[i].color = new THREE.Color( c[0], c[1], c[2] );
        }
    }

    var nvertices = polygon.numberOfVertices();
    for ( var i = 0; i < nvertices; i++ )
    {
        var v = new THREE.Vector3().fromArray( polygon.coords[i] );
        geometry.vertices.push( v );
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return new THREE.Mesh( geometry, material );
};

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

