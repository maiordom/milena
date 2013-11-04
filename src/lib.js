window.Kitana = {
    find: function( class_list, elem ) {
        return this.getElementsByClassName( class_list, elem );
    },

    getElementsByClassName: function( class_list, elem ) {
        var res = [], i, ilen, j, jlen;

        if ( document.getElementsByClassName ) {
            var nodes = ( elem || document ).getElementsByClassName( class_list );

            for ( i = 0, ilen = nodes.length; i < ilen; i++ ) {
                res[ i ] = nodes[ i ];
            }
        } else {
            var node = elem || document,
                list = node.getElementsByTagName( "*" ),
                arr  = class_list.split( /\s+/ );

            for ( i = 0, ilen = list.length; i < ilen; i++ )
            for ( j = 0, jlen = arr.length;  j < jlen; j++ ) {
                if ( list[ i ].className.search( "\\b" + arr[ j ] + "\\b") != -1 ) {
                    res.push( list[ i ] );
                    break;
                }
            }
        }

        return res;
    },

    addEvent: function( elem, event_type, handle ) {
        if ( elem.addEventListener ) {
            elem.addEventListener( event_type, handle, false );
        } else if ( elem.attachEvent ) {
            elem.attachEvent( "on" + event_type, handle );
        }
    },

    hasClass: function( elem, class_name ) {
        return elem.className.match( new RegExp( "(\\s|^)" + class_name + "(\\s|$)" ) );
    },

    addClass: function( elem, class_name ) {
        if ( this.hasClass( elem, class_name ) ) { return false; }

        var re = new RegExp( "(^|\\s)" + class_name + "(\\s|$)", "g" );

        if ( re.test( elem.className ) ) { return false; }

        elem.className = ( elem.className + " " + class_name ).replace( /\s+/g, " " ).replace( /(^ | $)/g, "" );

        return elem;
    },

    removeClass: function ( elem, class_name ) {
        if ( !this.hasClass( elem, class_name ) ) { return false; }

        var re = new RegExp( "(^|\\s)" + class_name + "(\\s|$)", "g" );

        elem.className = elem.className.replace( re, "$1" ).replace( /\s+/g, " " ).replace( /(^ | $)/g, "" );

        return elem;
    }
};