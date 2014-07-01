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
