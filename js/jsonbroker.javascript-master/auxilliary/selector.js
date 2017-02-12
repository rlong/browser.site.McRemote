//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//
// vvv 56703AD6-8D35-416C-824C-FAF6B8EF91EF file_preprocessor.application.j2se.jsmin.JavascriptMinify

var selector = selector || {};


// root is optional
selector.selectAll = function( listSpecifier, root ) {

    var nList = listSpecifier;
    if( listSpecifier instanceof NodeList) {
        return nList;
    }

    if( undefined != root ) {
        return root.querySelectorAll(listSpecifier);
    }

    return document.querySelectorAll(listSpecifier);

}

// root is optional
selector.selectAllAndApply = function( listSpecifier, func, root ) {

    var nList = selector.selectAll( listSpecifier, root );

    for( var i = 0, count = nList.length; i < count; i++ ) {
        var target = nList.item(i);
        func.apply( target );
    }

    return nList;

};

/**
 *
 * @param {string} listSpecifier
 * @param {string} eventName
 * @param {function} func
 * @param root is optional
 * @return {*}
 */
selector.addEventListener = function( listSpecifier, eventName, func, root ) {

    return selector.selectAllAndApply( listSpecifier, function() {
        this.addEventListener( eventName, func);
    },root);
};

// root is optional
selector.addClass = function( listSpecifier, className, root ) {

    return selector.selectAllAndApply( listSpecifier, function() {
        this.classList.add( className );
    },root);
}

// root is optional
selector.removeClass = function( listSpecifier, className, root ) {

    return selector.selectAllAndApply( listSpecifier, function() {
        this.classList.remove( className );
    },root);
}



// ^^^ 56703AD6-8D35-416C-824C-FAF6B8EF91EF file_preprocessor.application.j2se.jsmin.JavascriptMinify