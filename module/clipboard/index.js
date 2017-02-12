/**
 */
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../github/lib.json_broker/angular1.ts" />
/// <reference path="clipboard.ts" />
var ViewController = (function () {
    function ViewController($http, $q) {
        this.clipboardAsText = "";
        var requestHandler = json_broker.angular1.buildRequestHandler($http, $q);
        this.proxy = new clipboard.ClipBoardProxy(requestHandler);
    }
    ViewController.prototype.copyButtonOnClick = function () {
        this.get_clipboard();
    };
    ViewController.prototype.get_clipboard = function () {
        var self = this;
        this.proxy.get_clipboard().then(function (promiseValue) {
            console.log(promiseValue);
            self.clipboardAsText = promiseValue;
        }, function (reason) {
            console.error(reason);
        });
    };
    ViewController.prototype.pasteButtonOnClick = function () {
        this.proxy.set_clipboard(this.clipboardAsText).then(function () {
            console.log("entered");
        }, function (reason) {
            console.error(reason);
        });
    };
    return ViewController;
}());
var mcRemote = angular.module('McRemote', []);
mcRemote.controller('index', ["$http", "$q", "$scope", function ($http, $q, $scope) {
        $scope.viewController = new ViewController($http, $q);
        $scope.viewController.get_clipboard();
    }]);
//# sourceMappingURL=index.js.map