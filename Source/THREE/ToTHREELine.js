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
