function BoundingBoxGeometry( volume )
{
    var minx = volume.min_coord.x;
    var miny = volume.min_coord.y;
    var minz = volume.min_coord.z;

    var maxx = volume.max_coord.x;
    var maxy = volume.max_coord.y;
    var maxz = volume.max_coord.z;

    var vertices = [
        [ minx, miny, minz ], // 0
        [ maxx, miny, minz ], // 1
        [ maxx, miny, maxz ], // 2
        [ minx, miny, maxz ], // 3
        [ minx, maxy, minz ], // 4
        [ maxx, maxy, minz ], // 5
        [ maxx, maxy, maxz ], // 6
        [ minx, maxy, maxz ] // 7
    ];

    var faces = [
        [ 0, 1, 2 ], // f0
        [ 0, 2, 3 ], // f1
        [ 7, 6, 5 ], // f2
        [ 7, 5, 4 ], // f3
        [ 0, 4, 1 ], // f4
        [ 1, 4, 5 ], // f5
        [ 1, 5, 6 ], // f6
        [ 1, 6, 2 ], // f7
        [ 2, 6, 3 ], // f8
        [ 3, 6, 7 ], // f9
        [ 0, 3, 7 ], // f10
        [ 0, 7, 4 ], // f11
    ];

    var geometry = new THREE.Geometry();

    var nvertices = vertices.length;
    for ( var i = 0; i < nvertices; i++ )
    {
        var vertex = new THREE.Vector3().fromArray( vertices[i] );
        geometry.vertices.push( vertex );
    }

    var nfaces = faces.length;
    for ( var i = 0; i < nfaces; i++ )
    {
        var id = faces[i];
        var face = new THREE.Face3( id[0], id[1], id[2] );
        geometry.faces.push( face );
    }

    geometry.doubleSided = true;

    return geometry;
}

function VolumeTexture( volume )
{
    var width = volume.resolution.x * volume.resolution.z;
    var height = volume.resolution.y;
    var data = new Uint8Array( width * height );
    for ( var z = 0, index = 0; z < volume.resolution.z; z++ )
    {
        for ( var y = 0; y < volume.resolution.y; y++ )
        {
            for ( var x = 0; x < volume.resolution.x; x++, index++ )
            {
                var u = volume.resolution.x * z + x;
                var v = y;
                data[ width * v + u ] = volume.values[index][0];
            }
        }
    }

    var format = THREE.AlphaFormat;
    var type = THREE.UnsignedByteType;

    var texture = new THREE.DataTexture( data, width, height, format, type );
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
}

function TransferFunctionTexture()
{
    var resolution = 256;
    var width = resolution;
    var height = 1;
    var data = new Float32Array( width * height * 4 );
    for ( var i = 0; i < resolution; i++ )
    {
        var color = KVS.RainbowColorMap( 0, 255, i );
        var alpha = i / 255.0;
        data[ 4 * i + 0 ] = color.x;
        data[ 4 * i + 1 ] = color.y;
        data[ 4 * i + 2 ] = color.z;
        data[ 4 * i + 3 ] = alpha;
    }

    var format = THREE.RGBAFormat;
    var type = THREE.FloatType;

    var texture = new THREE.DataTexture( data, width, height, format, type );
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
}

function main()
{
    var volume = new KVS.LobsterData();
    var screen = new KVS.THREEScreen();

    screen.init( volume, {
        width: window.innerWidth,
        height: window.innerHeight,
        enableAutoResize: false
    });

//    screen.dynamicDampingFactor = 0.3;
//    screen.trackball.rotatetSpeed = 1.0;
//    screen.trackball.noPan = false;
//    screen.trackball.noZoom = false;
//    screen.renderer.setClearColor( new THREE.Color( "black" ) );

    var exit_buffer = new THREE.Scene();
    var exit_texture = new THREE.WebGLRenderTarget(
        screen.width, screen.height,
        {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            format: THREE.RGBFormat,
            type: THREE.FloatType,
            generateMipmaps: false
        }
    );

    var bounding_geometry = BoundingBoxGeometry( volume );
    var volume_texture = VolumeTexture( volume );
    var transfer_function_texture = TransferFunctionTexture();

    var bounding_material = new THREE.ShaderMaterial( {
        vertexShader: document.getElementById( 'bounding.vert' ).textContent,
        fragmentShader: document.getElementById( 'bounding.frag' ).textContent,
        side: THREE.BackSide
    });

    var bounding_mesh = new THREE.Mesh( bounding_geometry, bounding_material );
    exit_buffer.add( bounding_mesh );

    var raycaster_material = new THREE.ShaderMaterial( {
        vertexShader: document.getElementById( 'raycaster.vert' ).textContent,
        fragmentShader: document.getElementById( 'raycaster.frag' ).textContent,
        side: THREE.FrontSide,
        uniforms: {
            volume_resolution: { type: "v3", value: volume.resolution },
            exit_points: { type: "t", value: exit_texture },
            volume_data: { type: "t", value: volume_texture },
            transfer_function_data: { type: "t", value: transfer_function_texture },
            light_position: { type: 'v3', value: screen.light.position },
            camera_position: { type: 'v3', value: screen.camera.position },
            background_color: { type: 'v3', value: new THREE.Vector3().fromArray( screen.renderer.getClearColor().toArray() ) },
        }
    });

    var raycaster_mesh = new THREE.Mesh( bounding_geometry, raycaster_material );
    screen.scene.add( raycaster_mesh );

    document.addEventListener( 'mousemove', function() {
        screen.light.position.copy( screen.camera.position );
    });

    window.addEventListener( 'resize', function() {
        screen.resize( [ window.innerWidth, window.innerHeight ] );
    });

    screen.loop();

    screen.draw = function()
    {
        if ( screen.renderer == undefined ) return;
        screen.scene.updateMatrixWorld();
        screen.trackball.handleResize();
        screen.renderer.render( exit_buffer, screen.camera, exit_texture, true );
        screen.renderer.render( screen.scene, screen.camera );
        screen.trackball.update();
    }
}
