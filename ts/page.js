/**
 * Created by local-rlong on 07/06/2016.
 */
/// <reference path="../typings/index.d.ts" />
/// <reference path="../component/popup.ts" />
var page;
(function (page) {
    var context;
    (function (context) {
        function setup(module) {
            component.popup.setup(module);
        }
        context.setup = setup;
    })(context = page.context || (page.context = {}));
})(page || (page = {}));
//# sourceMappingURL=page.js.map