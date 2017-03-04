// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//
var ClipboardComponent = (function () {
    function ClipboardComponent($http, $q) {
        this.clipboardAsText = "";
        var brokerAdapter = json_broker.buildBrokerAdapter($http, $q);
        this.proxy = new clipboard.ClipBoardProxy(brokerAdapter);
    }
    ClipboardComponent.prototype.copyButtonOnClick = function () {
        this.get_clipboard();
    };
    ClipboardComponent.prototype.get_clipboard = function () {
        var self = this;
        this.proxy.get_clipboard().then(function (promiseValue) {
            console.log(promiseValue);
            self.clipboardAsText = promiseValue;
            // window.prompt("clipboard:", promiseValue);
        }, function (reason) {
            console.error(reason);
        });
    };
    ClipboardComponent.prototype.pasteButtonOnClick = function () {
        this.proxy.set_clipboard(this.clipboardAsText).then(function () {
            console.log("entered");
        }, function (reason) {
            console.error(reason);
        });
    };
    ClipboardComponent.setup = function (module) {
        module.component('clipboardComponent', {
            templateUrl: 'ClipboardComponent.html',
            controller: ["$http", "$q", function ($http, $q) {
                    var answer = new ClipboardComponent($http, $q);
                    answer.get_clipboard();
                    return answer;
                }],
            bindings: {}
        });
    };
    return ClipboardComponent;
}());
//# sourceMappingURL=ClipboardComponent.js.map