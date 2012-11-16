Milena = {};

Milena.Plot = function( id, config ) {
    var w, h, ow, oh, plot, svg, ax, ay, axis = {}, charts = {}, tip2 = {},
        margin = { left: 50, top: 60, right: 50, bottom: 30 };

    function init() {
        cacheData();
        drawCtx();
        drawAxisX();
        drawAxisYLeft();
        drawAxisYRight();
        drawCharts();
        drawTip2();
        initCharts();
    }

    function cacheData() {
        ow = config.width;
        oh = config.height;
        w  = ow - margin.left - margin.right;
        h  = oh - margin.top  - margin.bottom;
        ax = d3.scale.linear().domain( d3.extent( config.axisX.points ) ).range( [ 0, w ] );
        ay = d3.scale.linear().domain( d3.extent( config.axisY.points ) ).range( [ h, 0 ] );

        config.domain_x = [ config.axisX.min, config.axisX.max ];
        config.domain_y = [ config.axisY.min, config.axisY.max ];
    }

    function drawCtx() {
        plot = d3.select( id );
        svg = plot.append( "svg" ).attr( { "class": "svg", width: ow, height: oh } );
    }

    function drawCharts () {
        charts.block = svg.append( "g" )
            .attr( { "class" : "charts", "transform": "translate(" + margin.left + "," + margin.top + ")" } );
    }

    function drawTip2() {
        tip2.g    = svg.append( "g" ).attr( { "class": "tip2", visibility: "hidden" } );
        tip2.path = tip2.g.append( "path" ).attr( { "class": "tip2-path" } );
        tip2.text = tip2.g.append( "text" ).attr( { x: 10, y: 15 } );
    }

    function drawAxisItems( axis, data, className, type ) {
        var trans;

        switch( type ) {
            case "bottom": { trans = margin.left +     "," + ( margin.top + h ); } break;
            case "left":   { trans = margin.left +     "," +   margin.top;       } break;
            case "right":  { trans = margin.left + w + "," +   margin.top;       } break;
        }

        axis.attr( "transform", "translate(" + trans + ")" );

        return axis
            .selectAll( "." + className )
            .data( data )
            .enter()
            .append( "g" )
            .style( "opacity", 1 )
            .attr( "class", className );
    }

    function drawAxisX() {
        axis.x = svg.append( "g" ).attr( "class", "axis-x axis-x-left" );

        var items = drawAxisItems( axis.x, config.axisX.points, "axis-x-item", "bottom" );

        items.attr( "transform", function( d ) {
            return "translate(" + ax( d ) + ",0)";
        });

        items
            .append( "line" )
            .attr( { "class": "tick", x1: 0, y1: -1, x2: 0, y2: 3 } );

        items
            .append( "text" )
            .attr( { y: 9, x: 0, dy: ".71em", "text-anchor": "middle" } )
            .text( function( d ) { return d; } );

        axis.x
            .append( "line" )
            .attr( { "class": "axis-x-line", x1: 0, y1: 0, x2: w, y2: 0 } );
    }

    function drawAxisYLeft() {
        axis.yLeft = svg.append( "g" ).attr( "class", "axis-y axis-y-left" );

        var items = drawAxisItems( axis.yLeft, config.axisY.points, "axis-y-item", "left" );

        items.attr( "transform", function( d ) {
            return "translate(0," + ay( d ) + ")";
        });

        items
            .append( "line" )
            .attr( { "class": "tick", x1: 0, y1: 0, x2: w, y2: 0 } );

        items
            .append( "text" )
            .attr( { x: -14, y: 0, dy: ".32em", "text-anchor": "end" } )
            .text( function( d ) { return d; } );

        d3.select( items.node() ).remove();
    }

    function drawAxisYRight() {
        axis.yRight = svg.append( "g" ).attr( "class", "axis-y axis-y-right" );

        var items = drawAxisItems( axis.yRight, config.axisY.points2, "axis-y-item", "right" );

        items.attr( "transform", function( d ) {
            return "translate(0," + ay( d.val ) + ")";
        });

        items
            .append( "text" )
            .attr( { x: 8, y: -1, dy: ".32em", "text-anchor": "start" } )
            .text( function( d ) { return d.lbl; } );
    }

    function initCharts() {
        config.charts_block = charts.block;
        config.tip2 = tip2;
        config.margin = margin;
        config.w = w;
        config.h = h;

        for ( var i = 0, ilen = config.data.length; i < ilen; i++ ) {
            charts[ config.data[ i ].id ] = Milena.Line( config.data[ i ], config );
        }
    }

    function draw( id ) {
        charts.active ? charts.active.hide() : null;

        if ( charts[ id ] ) {
            charts.active = charts[ id ];
            charts.active.render();
        }
    }

    init();

    return {
        draw: draw
    };
};

window.Chart = Milena.Plot;