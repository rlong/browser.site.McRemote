/**
 * Created by local-rlong on 07/06/2016.
 */
/// <reference path="../typings/index.d.ts" />
/// <reference path="../component/popup.ts" />
var application;
(function (application) {
    var Context = (function () {
        function Context() {
        }
        return Context;
    }());
    application.Context = Context;
    var context = null;
    function setup(module) {
        context = new Context();
    }
    application.setup = setup;
})(application || (application = {}));
//# sourceMappingURL=application.js.map