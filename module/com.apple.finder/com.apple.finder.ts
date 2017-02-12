/**
 * Created by rlong on 20/03/2016.
 */



/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />



module com.apple.finder {

    export module service {


        function buildTemplateReqest():json_broker.BrokerMessage {



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


        export module list_roots {

            export function invoke( $http:angular.IHttpService ) :angular.IHttpPromise<json_broker.BrokerMessage> {

                let request:json_broker.BrokerMessage = buildTemplateReqest();
                request.methodName = "list_roots";

                return request.post($http);

            }

        }

        //export function list_roots( $http:angular.IHttpService ) :angular.IHttpPromise<jsonbroker.BrokerMessage> {
        //
        //    let request:jsonbroker.BrokerMessage = buildTemplateReqest();
        //    request.methodName = "list_roots";
        //
        //    return request.post($http);
        //
        //}

        export module list_path {

            export function invoke($http:angular.IHttpService, path: String ): angular.IHttpPromise<jsonbroker.BrokerMessage> {

                let request:json_broker.BrokerMessage = buildTemplateReqest();
                request.methodName = "list_path";
                request.orderedParameters = [path];

                return request.post($http);
            }

        }

        export module ping {

            export function invoke( $http:angular.IHttpService ) :angular.IHttpPromise<jsonbroker.BrokerMessage> {

                let request:json_broker.BrokerMessage = buildTemplateReqest();
                request.methodName = "ping";

                return request.post($http);

            }

        }



    }


    export class FinderProxy {

        //$http:angular.IHttpService;
        //
        //
        //constructor($http:angular.IHttpService) {
        //    this.$http = $http;
        //}
        //
        //private static buildTemplateReqest():jsonbroker.BrokerMessage {
        //    var answer = new jsonbroker.BrokerMessage();
        //    answer.messageType = "request";
        //    answer.metaData = {};
        //    answer.serviceName = "remote_gateway.AppleScriptService:finder";
        //    answer.majorVersion = 1;
        //    answer.minorVersion = 0;
        //    answer.orderedParamaters = [];
        //
        //    return answer;
        //
        //}
        //
        //
        //list_roots():angular.IHttpPromise<any> {
        //
        //    let request:jsonbroker.BrokerMessage = FinderProxy.buildTemplateReqest();
        //    request.methodName = "list_roots";
        //
        //    return request.post(this.$http);
        //}
        //
        //list_rootsGetResponse(response: jsonbroker.IHttpResponse) {
        //
        //    let brokerMessage: jsonbroker.BrokerMessage = jsonbroker.BrokerMessage.buildFromHttpResponse( response );
        //    return brokerMessage.orderedParamaters[0];
        //
        //}
        //
        //ping():angular.IHttpPromise<any> {
        //
        //    let request:jsonbroker.BrokerMessage = FinderProxy.buildTemplateReqest();
        //    request.methodName = "ping";
        //
        //    return request.post(this.$http);
        //}
        //
        //pingGetResponse(response: jsonbroker.IHttpResponse) {
        //
        //    let brokerMessage: jsonbroker.BrokerMessage = jsonbroker.BrokerMessage.buildFromHttpResponse( response );
        //    return brokerMessage.orderedParamaters;
        //
        //}

    }


}