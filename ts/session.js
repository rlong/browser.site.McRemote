/**
 * Created by local-rlong on 07/06/2016.
 */
/// <reference path="../typings/index.d.ts" />
var session;
(function (session) {
    var Context = (function () {
        function Context() {
        }
        return Context;
    }());
    session.Context = Context;
    var context = null;
    function setup(module) {
        context = new Context();
    }
    session.setup = setup;
})(session || (session = {}));
//# sourceMappingURL=session.js.map