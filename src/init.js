window.onload = function() {
    var config = {
        width: 510,
        height: 300,
        middleLineColor: "rgb(133,205,250)",
        axisX: {
            max: 50,
            min: 15,
            points: [ 15, 20, 25, 30, 35, 40, 45, 50 ]
        },
        axisY: {
            max: 3,
            min: 0,
            middle: 2.2,
            points: [ 0, 1, 2, 3 ],
            points2: [
                { val: 0,   lbl: "0" },
                { val: 0.6, lbl: "20" },
                { val: 1.2, lbl: "40" },
                { val: 1.8, lbl: "60" },
                { val: 2.4, lbl: "80" },
                { val: 3,   lbl: "100%" }
            ]
        },
        data: [{
                color: "rgb(102,217,2)",
                label: "Менеджмент",
                id: "someid",
                points: [
                    { x: 18,   y: 1.2, percent: 42 },
                    { x: 28.4, y: 2,   percent: 70 },
                    { x: 40.4, y: 0.8, percent: 10 }
                ]
            }, {
                color: "rgb(0,150,245)",
                label: "Менеджер",
                id: "someid2",
                points: [ { x: 28, y: 2.2, percent: 15 } ]
            }, {
                color: "rgb(241,220,45)",
                label: "Программист",
                id: "someid3",
                points: [
                    { x: 17, y: 2.3, percent: 50 },
                    { x: 24, y: 0.6, percent: 15 },
                    { x: 28, y: 3,   percent: 1  },
                    { x: 35, y: 3,   percent: 6  },
                    { x: 40, y: 2,   percent: 9  },
                    { x: 48, y: 0.5, percent: 31 }
                ]
            }
        ]
    };

    var chart = new Chart( "#charts", config ), $ = Kitana, active, id;

    active = $.find( "charts-nav__link" )[ 2 ];

    $.addEvent( $.find( "charts-nav" )[ 0 ], "click", onChartsLinkClick );

    onChartsLinkClick.call( null, { target: active } );

    function onChartsLinkClick( e ) {
        var link = e.target;

        if ( !$.hasClass( link, "charts-nav__link" ) ) { return; }

        if ( !$.hasClass( link, "charts-nav__link_active" ) ) {
            active ? $.removeClass( active, "charts-nav__link_active" ) : null;
            active = $.addClass( link, "charts-nav__link_active" );
            id = link.getAttribute( "data-id" );
            chart.draw( id );
        }

        return false;
    }
};