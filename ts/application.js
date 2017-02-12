/**
 * Created by local-rlong on 07/06/2016.
 */
/// <reference path="../typings/index.d.ts" />
/// <reference path="../component/popup.ts" />
var application;
(function (application) {
    var context;
    (function (context) {
        function setup(module) {
        }
        context.setup = setup;
    })(context = application.context || (application.context = {}));
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
    })(utility = application.utility || (application.utility = {}));
})(application || (application = {}));
//# sourceMappingURL=application.js.map