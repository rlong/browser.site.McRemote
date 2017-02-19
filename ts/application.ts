/**
 * Created by local-rlong on 07/06/2016.
 */


/// <reference path="../typings/index.d.ts" />
/// <reference path="../component/popup.ts" />



namespace application {



    export class Context {

    }

    var context: Context = null;

    export function setup( module: angular.IModule ) {

        context = new Context();
    }

}