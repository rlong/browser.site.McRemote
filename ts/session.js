/**
 * Created by local-rlong on 07/06/2016.
 */
var session;
(function (session) {
    var Context = /** @class */ (function () {
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