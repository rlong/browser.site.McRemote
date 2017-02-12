/**
 * Created by rlong on 20/03/2016.
 */
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
var clipboard;
(function (clipboard) {
    var SERVICE_NAME = "remote_gateway.AppleScriptService:clipboard";
    var BrokerMessage = json_broker.BrokerMessage;
    var ClipBoardProxy = (function () {
        function ClipBoardProxy(requestHandler) {
            this.requestHandler = requestHandler;
        }
        ClipBoardProxy.prototype.ping = function () {
            var request = BrokerMessage.buildRequest(SERVICE_NAME, "ping");
            return this.requestHandler.dispatch(request).then(function () { });
        };
        ClipBoardProxy.prototype.get_clipboard = function () {
            var request = BrokerMessage.buildRequest(SERVICE_NAME, "get_clipboard");
            return this.requestHandler.dispatch(request).then(function (promiseValue) {
                console.log(promiseValue);
                return promiseValue.orderedParameters[0];
            });
        };
        ClipBoardProxy.prototype.set_clipboard = function (clipboardValue) {
            var request = BrokerMessage.buildRequest(SERVICE_NAME, "set_clipboard");
            request.orderedParameters = [clipboardValue];
            return this.requestHandler.dispatch(request).then(function () { });
        };
        return ClipBoardProxy;
    }());
    clipboard.ClipBoardProxy = ClipBoardProxy;
})(clipboard || (clipboard = {}));
//# sourceMappingURL=clipboard.js.map