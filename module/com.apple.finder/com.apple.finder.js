/**
 * Created by rlong on 20/03/2016.
 */
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
var com;
(function (com) {
    var apple;
    (function (apple) {
        var finder;
        (function (finder) {
            var service;
            (function (service) {
                function buildTemplateReqest() {
                    var answer = new json_broker.BrokerMessage();
                    answer.messageType = "request";
                    answer.metaData = {};
                    answer.serviceName = "remote_gateway.AppleScriptService:finder";
                    answer.majorVersion = 1;
                    answer.minorVersion = 0;
                    answer.orderedParameters = [];
                    // answer.associativeParamaters = {};
                    return answer;
                }
                var list_roots;
                (function (list_roots) {
                    function invoke($http) {
                        var request = buildTemplateReqest();
                        request.methodName = "list_roots";
                        return request.post($http);
                    }
                    list_roots.invoke = invoke;
                })(list_roots = service.list_roots || (service.list_roots = {}));
                //export function list_roots( $http:angular.IHttpService ) :angular.IHttpPromise<jsonbroker.BrokerMessage> {
                //
                //    let request:jsonbroker.BrokerMessage = buildTemplateReqest();
                //    request.methodName = "list_roots";
                //
                //    return request.post($http);
                //
                //}
                var list_path;
                (function (list_path) {
                    function invoke($http, path) {
                        var request = buildTemplateReqest();
                        request.methodName = "list_path";
                        request.orderedParameters = [path];
                        return request.post($http);
                    }
                    list_path.invoke = invoke;
                })(list_path = service.list_path || (service.list_path = {}));
                var ping;
                (function (ping) {
                    function invoke($http) {
                        var request = buildTemplateReqest();
                        request.methodName = "ping";
                        return request.post($http);
                    }
                    ping.invoke = invoke;
                })(ping = service.ping || (service.ping = {}));
            })(service = finder.service || (finder.service = {}));
            var FinderProxy = (function () {
                function FinderProxy() {
                }
                return FinderProxy;
            }());
            finder.FinderProxy = FinderProxy;
        })(finder = apple.finder || (apple.finder = {}));
    })(apple = com.apple || (com.apple = {}));
})(com || (com = {}));
//# sourceMappingURL=com.apple.finder.js.map