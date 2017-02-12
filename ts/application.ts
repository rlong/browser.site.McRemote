/**
 * Created by local-rlong on 07/06/2016.
 */


/// <reference path="../typings/index.d.ts" />
/// <reference path="../component/popup.ts" />


namespace application {

    export namespace context {

        export function setup( module: angular.IModule ) {

        }

    }

    export namespace utility {

        export function copyInto( destinationObject: any, sourceObject?: any ) {
            if( !sourceObject ) {
                return;
            }
            for (var prop in sourceObject) {
                destinationObject[prop] = sourceObject[prop];
            }
        }

    }

}