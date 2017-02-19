/**
 * Created by local-rlong on 13/02/2017.
 */
var utility;
(function (utility) {
    function copyInto(destinationObject, sourceObject) {
        if (!sourceObject) {
            return;
        }
        for (var prop in sourceObject) {
            destinationObject[prop] = sourceObject[prop];
        }
    }
    utility.copyInto = copyInto;
})(utility || (utility = {}));
