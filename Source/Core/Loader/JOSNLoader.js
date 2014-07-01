KVS.JSONLoader = function( jsontext )
{
    var name = "KVS.JSONLoader";
    var data = JSON.parse( jsontext );
    switch ( data.object )
    {
    case "PointObject": { return read_point( data, name ); }
    case "LineObject": { return read_line( data, name ); }
    case "PolygonObject": { return read_polygon( data, name ); }
    case "StructuredVolumeObject": { return read_structured( data, name ); }
    case "UnstructuredVolumeObject": { return read_unstructured( data, name ); }
    default: break;
    }

    console.error( name + ": Unknown object type is specified in the input file." );
    return null;

    function read_point( data, name )
    {
        var object = new KVS.PointObject();
        if ( data.coords == undefined )
        {
            console.error( name + ": Cannot find 'coords' in the input file." );
            return object;
        }

        object.coords = data.coords;
        object.colors = colors( data );
        set_min_max_coord( object, data );

        return object;
    }

    function read_line( data, name )
    {
        var object = new KVS.LineObject();
        if ( data.coords == undefined )
        {
            console.error( name + ": Cannot find 'coords' in the input file." );
            return object;
        }

        object.coords = data.coords;
        object.line_type = line_type( data );
        object.width = line_width( data );
        object.colors = colors( data );
        set_min_max_coord( object, data );

        return object;
    }

    function read_polygon( data, name )
    {
        var object = new KVS.PolygonObject();
        if ( data.coords == undefined )
        {
            console.error( name + ": Cannot find 'coords' in the input file." );
            return object;
        }

        if ( data.connections == undefined )
        {
            console.error( name + ": Cannot find 'connections' in the input file." );
            return object;
        }

        object.coords = data.coords;
        object.connections = data.connections;
        object.colors = colors( data );
        set_min_max_coord( object, data );

        return object;
    }

    function read_structured( data, name )
    {
        var object = new KVS.StructuredVolumeObject();
        if ( data.resolution == undefined )
        {
            console.error( name + ": Cannot find 'resolution' in the input file." );
            return object;
        }

        if ( data.values == undefined )
        {
            console.error( name + ": Cannot find 'values' in the input file." );
            return object;
        }

        object.resolution = new KVS.Vec3().fromArray( data.resolution );
        object.values = data.values;
        object.updateMinMaxCoords();
        set_min_max_values( object, data );

        return object;
    }

    function read_unstructured( data, name )
    {
        var object = new KVS.UnstructuredVolumeObject();
        if ( data.coords == undefined )
        {
            console.error( name + ": Cannot find 'coords' in the input file." );
            return object;
        }

        if ( data.connections == undefined )
        {
            console.error( name + ": Cannot find 'connections' in the input file." );
            return object;
        }

        if ( data.values == undefined )
        {
            console.error( name + ": Cannot find 'values' in the input file." );
            return object;
        }

        object.coords = data.coords;
        object.connections = data.connections;
        object.values = data.values;
        set_min_max_coords( object, data );
        set_min_max_values( object, data );

        return object;
    }

    function line_width( data )
    {
        return ( data.width == undefined ) ? 1 : data.width;
    }

    function line_type( data )
    {
        return ( data.line_type == undefined ) ? KVS.StripLine : kvs_line_type();

        function kvs_line_type()
        {
            return data.line_type == "SegmentLine" ? KVS.SegmentLine : KVS.StripLine;
        }
    }

    function colors( object, data )
    {
        return ( data.colors == undefined ) ? [ [ 0, 0, 0 ] ] : data.colors;
    }

    function set_min_max_coords( object, data )
    {
        if ( data.min_coord == undefined && data.max_coord != undefined )
        {
            var max_coord = new KVS.Vec3().fromArray( data.max_coord );
            object.updateMinMaxCoords();
            object.setMinMaxCoords( object.min_coord, max_coord );
        }
        else if ( data.min_coord != undefined && data.max_coord == undefined )
        {
            var min_coord = new KVS.Vec3().fromArray( data.min_coord );
            object.updateMinMaxCoords();
            object.setMinMaxCoords( min_coord, object.max_coord );
        }
        else if ( data.min_coord != undefined && data.max_coord != undefined )
        {
            var min_coord = new KVS.Vec3().fromArray( data.min_coord );
            var max_coord = new KVS.Vec3().fromArray( data.max_coord );
            object.setMinMaxCoords( min_coord, max_coord );
        }
        else
        {
            object.updateMinMaxCoords();
        }
    }

    function set_min_max_values( object, data )
    {
        if ( data.min_value == undefined && data.max_value != undefined )
        {
            var max_value = data.max_value;
            object.updateMinMaxValues();
            object.setMinMaxValues( object.min_value, max_value );
        }
        else if ( data.min_value != undefined && data.max_value == undefined )
        {
            var min_value = data.min_value;
            object.updateMinMaxValues();
            object.setMinMaxValues( min_value, object.max_value );
        }
        else if ( data.min_value != undefined && data.max_value != undefined )
        {
            var min_value = data.min_value;
            var max_value = data.max_value;
            object.setMinMaxValues( min_value, max_value );
        }
        else
        {
            object.updateMinMaxValues();
        }
    }
};
