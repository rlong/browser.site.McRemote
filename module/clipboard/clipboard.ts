/**
 * Created by rlong on 20/03/2016.
 */



/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />



module clipboard {

    const SERVICE_NAME = "remote_gateway.AppleScriptService:clipboard";

    import IRequestHandler = json_broker.IRequestHandler;
    import BrokerMessage = json_broker.BrokerMessage;

    export class ClipBoardProxy {

        requestHandler: IRequestHandler;

        constructor( requestHandler: IRequestHandler ) {

            this.requestHandler = requestHandler;
        }

        ping(): Promise<void> {

            let request = BrokerMessage.buildRequest( SERVICE_NAME, "ping" );

            return this.requestHandler.dispatch( request ).then(
                () => {}
            );
        }

        get_clipboard(): Promise<string> {
            let request = BrokerMessage.buildRequest( SERVICE_NAME, "get_clipboard" );

            return this.requestHandler.dispatch( request ).then(
                (promiseValue:BrokerMessage) => {

                    console.log( promiseValue );

                    return promiseValue.orderedParameters[0];
                }
            );

        }

        set_clipboard( clipboardValue: string ): Promise<void>  {
            let request = BrokerMessage.buildRequest( SERVICE_NAME, "set_clipboard" );
            request.orderedParameters = [clipboardValue];

            return this.requestHandler.dispatch( request ).then(
                () => {}
            );

        }

    }





}