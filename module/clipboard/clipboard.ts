// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//


/// <reference path="../../github/lib.json_broker/json_broker.ts" />


module clipboard {

    const SERVICE_NAME = "remote_gateway.AppleScriptService:clipboard";


    export class ClipBoardProxy {

        adapter: json_broker.IBrokerAdapter;

        constructor( messageBrokerAdapter: json_broker.IBrokerAdapter ) {

            this.adapter = messageBrokerAdapter;
        }

        ping(): angular.IPromise<void> {

            let request = json_broker.BrokerMessage.buildRequest( SERVICE_NAME, "ping" );

            return this.adapter.dispatch( request ).then(
                () => {}
            );
        }


        get_clipboard(): angular.IPromise<string> {
            let request = json_broker.BrokerMessage.buildRequest( SERVICE_NAME, "get_clipboard" );

            return this.adapter.dispatch( request ).then(
                (promiseValue:json_broker.BrokerMessage) => {

                    console.log( promiseValue );

                    return promiseValue.orderedParameters[0];
                }
            );

        }

        set_clipboard( clipboardValue: string ): angular.IPromise<void>  {

            let request = json_broker.BrokerMessage.buildRequest( SERVICE_NAME, "set_clipboard" );
            request.orderedParameters = [clipboardValue];

            return this.adapter.dispatch( request ).then(
                () => {}
            );
        }

    }



}