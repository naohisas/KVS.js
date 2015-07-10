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
