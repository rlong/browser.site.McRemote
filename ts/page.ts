/**
 * Created by local-rlong on 07/06/2016.
 */



/// <reference path="../component/popup.ts" />

namespace page {


    export function buildAngularModule(): angular.IModule {

        return angular.module('McRemote', ['ngAnimate', 'ui.bootstrap', "ui.router"]);
    }



    export class Context {

    }

    export var context: Context;

    export function setup( module: angular.IModule ) {

        context = new Context();
        component.popup.setup( module );

    }


}