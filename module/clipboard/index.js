/**
 */
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../ts/page.ts" />
var ViewController = (function () {
    function ViewController($http, $q) {
        this.clipboardAsText = "";
        var brokerAdapter = json_broker.buildBrokerAdapter($http, $q);
        this.proxy = new clipboard.ClipBoardProxy(brokerAdapter);
    }
    ViewController.prototype.copyButtonOnClick = function () {
        this.get_clipboard();
    };
    ViewController.prototype.get_clipboard = function () {
        var self = this;
        this.proxy.get_clipboard().then(function (promiseValue) {
            console.log(promiseValue);
            self.clipboardAsText = promiseValue;
            // window.prompt("clipboard:", promiseValue);
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
var mcRemote = page.buildAngularModule();
mcRemote.controller('index', ["$http", "$q", "$scope",
    function ($http, $q, $scope) {
        $scope.viewController = new ViewController($http, $q);
        $scope.viewController.get_clipboard();
    }]);
//# sourceMappingURL=index.js.map