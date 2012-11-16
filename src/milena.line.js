Milena.Line = function( data, config ) {
    var is_init, line, x, y, chart, path, tipPathD,
        tip2 = config.tip2, tips = [], dots = [], rails = [], helpers = [], masks = [];

    function setTipPathD() {
        tipPathD = [
            "M 46.5,29.5 v -22 ",
            "c 0,-6.627 -0.391,-6 -7.018,-6 ",
            "H 24 ",
            "H 9.016 ",
            "C 2.389,1.5 1.5,0.873 1.5,7.5 ",
            "v 22 ",
            "c 0,5.521 -0.178,6.008 3.507,6.016 ",
            "C 5.746,35.518 24,44.375 24,44.375 ",
            "s 18.503,-8.857 19.242,-8.859 ",
            "C 46.927,35.508 46.5,35.021 46.5,29.5 ",
            "z"
        ].join( "" );
    }

    function getTip2D( w ) {
        return "M 0,11 l 11,11 " + w + ",0 0,-22 -" + w + ",0 M 0,11 11,0";
    }

    function drawItems() {
        var block, items, item, tip;

        chart = config.charts_block.append( "g" ).attr( { id: data.id, "class": "chart", visibility: "hidden" } );
        path  = chart.append( "path" ).attr( "stroke", data.color );
        block = chart.append( "g" ).attr( "class", "dots" );
        items = block.selectAll( ".dots-item" ).data( data.points ).enter().append( "g" ).attr( "class", "dots-item" );

        items.each( function( d, i ) {
            item         = d3.select( this );
            tips[ i ]    = item.append( "g" ).attr( { "class": "tip" } );
            rails[ i ]   = item.append( "line" ).attr( { "class": "x-rail" } );
            masks[ i ]   = item.append( "line" ).attr( { "class": "x-mask" } );
            helpers[ i ] = item.append( "text" ).attr( { "class": "x-helper" } );
            dots[ i ]    = item.append( "circle" ).attr( { "class": "dot" } );

            tip = tips[ i ];

            tip.append( "path" ).attr( { "class": "tip-mask", d: tipPathD, fill: "#fff", stroke: "#fff" } );
            tip.append( "path" ).attr( { "class": "tip-path", d: tipPathD } );
            tip.append( "text" ).attr( { "class": "tip-y", x: 24, y: 19 } );
            tip.append( "text" ).attr( { "class": "tip-val", x: 24, y: 34 } );
        });
    }

    function drawGradient() {
        var gnt = chart.append( "linearGradient" ).attr( {
            x1: 0, y1: 0, x2: 0, y2: 44, gradientUnits: "userSpaceOnUse", id: data.id + "-gradient"
        });

        gnt.append( "stop" ).attr( { offset: 0, "stop-color": "#fff", "stop-opacity": 0.12 } );
        gnt.append( "stop" ).attr( { offset: 1, "stop-color": data.color, "stop-opacity": 0.14 } );
    }

    function drawTip( g, d ) {
        g.attr( "transform", "translate(" + ( x( d.x ) - 24 ) + "," + ( y( d.y ) - 55 ) + ")" );
        g.select( ".tip-path" ).attr( { fill: "url(#" + data.id + "-gradient)", stroke: data.color } );
        g.select( ".tip-y" ).text( ( d.y + "" ).replace( ".", "," ) );
        g.select( ".tip-val" ).text( d.percent + "%" );
    }

    function setData() {
        x = d3.scale.linear().domain( config.domain_x ).range( [ 0, config.w ] );
        y = d3.scale.linear().domain( config.domain_y ).range( [ config.h, 0 ] );

        line = d3.svg.line()
            .x( function( d ) { return x( d.x ); } )
            .y( function( d ) { return y( d.y ); } );

        path.attr( "d", line( data.points ) );

        for ( var d, i = 0, ilen = data.points.length; i < ilen; i++ ) {
            d = data.points[ i ];
            dots[ i ].attr( { cx: x( d.x ), cy: y( d.y ), r: 5, stroke: data.color } );
            helpers[ i ].attr( { x: x( d.x ), y: config.h - 12 } ).text( d.x );
            rails[ i ].attr( { x1: x( d.x ), y1: y( d.y ) + 12, x2: x( d.x ), y2: config.h } );
            masks[ i ].attr( { x1: x( d.x ), y1: config.h - 23, x2: x( d.x ), y2: config.h - 8 } );
            drawTip( tips[ i ],  d );
        }
    }

    function bindEvents() {
        for ( var i = 0, ilen = dots.length; i < ilen; i++ ) {
            dots[ i ]
                .on( "mouseover", onDotMouseOver )
                .on( "mouseout",  onDotMouseOut );
        }
    }

    function onDotMouseOver( o ) {
        var tx = x( o.x ) + config.margin.left + 15,
            ty = y( o.y ) + config.margin.top - 10,
            coords = "translate(" + tx + "," + ty + ")";

        tip2.g.attr( { visibility: "visible", transform: coords } );
        d3.select( this ).transition().attr( "r", 7 );
    }

    function onDotMouseOut() {
        tip2.g.attr( { visibility: "hidden" } );
        d3.select( this ).transition().attr( "r", 5 );
    }

    function setTip2Data() {
        tip2.text.text( data.label );
        tip2.path.attr( { stroke: data.color } );
        tip2.g.attr( { visibility: "visible" } );
        tip2.width = tip2.text.node().getBBox().width;
        tip2.g.attr( { visibility: "hidden" } );
        tip2.path.attr( { d: getTip2D( tip2.width + 5 ) } );
    }

    function draw() {
        if ( !is_init ) {
            is_init = true;
            setTipPathD();
            drawItems();
            drawGradient();
            bindEvents();
            setData();
        }

        show();
        setTip2Data();
    }

    function show() {
        chart.attr( "visibility", "visible" );
    }

    function hide() {
        chart.attr( "visibility", "hidden" );
    }

    return {
        show: show,
        hide: hide,
        render: draw
    }
};