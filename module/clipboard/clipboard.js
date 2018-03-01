// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
var clipboard;
(function (clipboard) {
    var SERVICE_NAME = "remote_gateway.AppleScriptService:clipboard";
    var ClipBoardProxy = /** @class */ (function () {
        function ClipBoardProxy(messageBrokerAdapter) {
            this.adapter = messageBrokerAdapter;
        }
        ClipBoardProxy.prototype.ping = function () {
            var request = json_broker.BrokerMessage.buildRequest(SERVICE_NAME, "ping");
            return this.adapter.dispatch(request).then(function () { });
        };
        ClipBoardProxy.prototype.get_clipboard = function () {
            var request = json_broker.BrokerMessage.buildRequest(SERVICE_NAME, "get_clipboard");
            return this.adapter.dispatch(request).then(function (promiseValue) {
                console.log(promiseValue);
                return promiseValue.orderedParameters[0];
            });
        };
        ClipBoardProxy.prototype.set_clipboard = function (clipboardValue) {
            var request = json_broker.BrokerMessage.buildRequest(SERVICE_NAME, "set_clipboard");
            request.orderedParameters = [clipboardValue];
            return this.adapter.dispatch(request).then(function () { });
        };
        return ClipBoardProxy;
    }());
    clipboard.ClipBoardProxy = ClipBoardProxy;
})(clipboard || (clipboard = {}));
//# sourceMappingURL=clipboard.js.map