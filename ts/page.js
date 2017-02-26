/**
 * Created by local-rlong on 07/06/2016.
 */
/// <reference path="../component/popup.ts" />
var page;
(function (page) {
    function buildAngularModule() {
        return angular.module('McRemote', ['ngAnimate', 'ui.bootstrap', "ui.router"]);
    }
    page.buildAngularModule = buildAngularModule;
    var Context = (function () {
        function Context() {
        }
        return Context;
    }());
    page.Context = Context;
    function setup(module) {
        page.context = new Context();
        component.popup.setup(module);
    }
    page.setup = setup;
})(page || (page = {}));
