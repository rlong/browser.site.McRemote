/**
 * Created by local-rlong on 13/02/2017.
 */


module utility {

    export function copyInto( destinationObject: any, sourceObject?: any ) {
        if( !sourceObject ) {
            return;
        }
        for (var prop in sourceObject) {
            destinationObject[prop] = sourceObject[prop];
        }
    }

}