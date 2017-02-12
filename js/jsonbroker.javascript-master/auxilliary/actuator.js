//  Copyright (c) 2014 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//
// vvv 20F6A984-B4D1-45B4-9312-0CA7FD888FE7 file_preprocessor.application.j2se.jsmin.JavascriptMinify


var actuator = actuator || {};






// vvv Android 2.3.X (GINGERBREAD_MR1) and possibly later versions does not support HTMLElement.classList

actuator.ClassList = function(htmlElement) {
    this._htmlElement = htmlElement;
}

actuator.ClassList.prototype.remove = function( activeClass ) {

    activeClass = " " + activeClass; // padding

    var clazz = this._htmlElement.getAttribute( "class");
    if( !clazz ) {
        return;
    }

    clazz = clazz.replace( activeClass, "" );
    this._htmlElement.setAttribute( "class", clazz );

}

actuator.ClassList.prototype.add = function( activeClass ) {

    activeClass = " " + activeClass; // padding

    var clazz = this._htmlElement.getAttribute( "class");
    if( !clazz ) {
        this._htmlElement.setAttribute( "class", activeClass );
        return;
    }
    clazz = clazz + activeClass;
    this._htmlElement.setAttribute( "class", clazz );

}

// ^^^ Android 2.3.X (GINGERBREAD_MR1) and possibly later versions does not support HTMLElement.classList



actuator.currentTarget = null;
actuator.suppresMouseEvents = false;

actuator.updateCurrentTarget = function(nextTarget, activeClass) {

    if( nextTarget == actuator.currentTarget ) {
        return;
    }

    // switching away from actuator.currentTarget
    if( null != actuator.currentTarget ) {
        actuator.currentTarget.classList.remove( activeClass );
    }

    if( null != nextTarget ) {
        nextTarget.classList.add( activeClass );
    }

    actuator.currentTarget = nextTarget;

}


actuator.setupActuator = function( listSpecifier, activeClass, onActuateStart, onActuateCommit ) {


    // vvv Android 2.3.X (GINGERBREAD_MR1) and possibly later versions does not support HTMLElement.classList

    // selector.selectAllAndApply = function( listSpecifier, func, root ) {
    listSpecifier = selector.selectAllAndApply( listSpecifier, function(){
        if( !this.classList) {
            this.classList = new actuator.ClassList(this);
        }
    });

    // ^^^ Android 2.3.X (GINGERBREAD_MR1) and possibly later versions does not support HTMLElement.classList


    ///////////////////////////////////////////////////////////////////////////
    // Starting Actuation
    {


        var actuateStart = function(e) {

            // a touch event ?
            if(e.touches ) {
                actuator.suppresMouseEvents = true;
            } else if( actuator.suppresMouseEvents ) {
                return;
            }

            actuator.updateCurrentTarget( e.currentTarget, activeClass );

            if( onActuateStart ) {
                onActuateStart.call( this, e);
            }

            // a touch event ?
            if(e.touches ) {

                // take note of it's `Y` position
                e.currentTarget.startActuationY = e.touches[0].clientY;

            }
//            e.preventDefault();
//            e.stopPropagation();

        }

        listSpecifier = selector.addEventListener( listSpecifier, "mousedown", actuateStart );
        listSpecifier = selector.addEventListener( listSpecifier, "touchstart", actuateStart );

    }

    ///////////////////////////////////////////////////////////////////////////
    // Committing Actuation
    {

        var actuateCommit = function( e ) {

            // a touch event ?
            if(e.touches ) {
                actuator.suppresMouseEvents = true;
            } else if( actuator.suppresMouseEvents ) {
                return;
            }

            if( null == actuator.currentTarget ) {
                return;
            }

            actuator.updateCurrentTarget( null, activeClass );


            if( onActuateCommit ) {
                onActuateCommit.call( this, e );
            }
//                e.stopPropagation();
//            e.preventDefault();

        };

        listSpecifier = selector.addEventListener( listSpecifier, "click", actuateCommit );
        listSpecifier = selector.addEventListener( listSpecifier, "touchend", actuateCommit );


    }

    ///////////////////////////////////////////////////////////////////////////
    // Cancelling Actuation
    {

        listSpecifier = selector.addEventListener( listSpecifier, "touchmove", function(e){

            // a touch event ?
            if(e.touches ) {
                actuator.suppresMouseEvents = true;
            } else if( actuator.suppresMouseEvents ) {
                return;
            }

            if( null == actuator.currentTarget ) {
                return;
            }

            // a touch event ?
            if(e.touches ) {
                actuator.suppresMouseEvents = true;
            } else if( actuator.suppresMouseEvents ) {
                return;
            }

            var verticalTravel = actuator.currentTarget.startActuationY - e.touches[0].clientY;

            // too much vertical travel ...
            if( -15 > verticalTravel || 15 < verticalTravel ) {
                actuator.updateCurrentTarget( null, activeClass );
                return;
            }

        });

        listSpecifier = selector.addEventListener( listSpecifier, "mouseout", function(e){

            actuator.updateCurrentTarget( null, activeClass );

        });

    }


};


// ^^^ 20F6A984-B4D1-45B4-9312-0CA7FD888FE7 file_preprocessor.application.j2se.jsmin.JavascriptMinify
