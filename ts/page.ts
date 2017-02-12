/**
 * Created by local-rlong on 07/06/2016.
 */



/// <reference path="../typings/index.d.ts" />
/// <reference path="../component/popup.ts" />


namespace page {

    export namespace context {

        export function setup( module: angular.IModule ) {
            component.popup.setup( module );
        }
    }
}