/**
 * Created by local-rlong on 07/06/2016.
 */



namespace session {


    export class Context {

    }

    var context: Context = null;

    export function setup( module: angular.IModule ) {

        context = new Context();
    }

}