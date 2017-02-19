/**
 * Created by rlong on 20/03/2016.
 */


/// <reference path="../../github/lib.json_broker/json_broker.ts" />


module finder {

    import IRequestHandler = json_broker.IRequestHandler;
    import BrokerMessage = json_broker.BrokerMessage;

    const SERVICE_NAME = "remote_gateway.AppleScriptService:com.apple.finder";

    export interface IPathComponent {
        name: string;
        path: string;
    }

    export class Folder {

        folderName: string = null;
        folderPath: string = null;
        folderPosixPath: string = null;
        pathComponents: IPathComponent[] = [];

        // filePath: FilePath = null; // new FilePath( "inbox", "scratch:rlong:Movies:inbox");
        files: any[] = [];
        folders: any[] = [];

        constructor( folderPath: string, response: json_broker.BrokerMessage ) {

            let pojo: any = response.orderedParameters[0];
            this.folderName = pojo._name;
            this.folderPosixPath = pojo._posix_path;
            this.files = pojo._files;
            this.folders = pojo._folders;

            {
                var path = "";
                var tokens = folderPath.split(":");
                for( let tokenIndex in tokens ) {

                    let token = tokens[tokenIndex];
                    if( 0 === token.length ) {
                        continue;
                    }

                    path += token + ":";
                    this.pathComponents.push( {name:token, path:path} );
                }
            }
        }
    }


    // this.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
    //this.openFolderPath( "64G:Movies" );
    export class Roots {

        disks: IRootLocation[] = null;
        places: IRootLocation[] = null;

        constructor( brokerMessage: json_broker.BrokerMessage ) {

            console.log( brokerMessage );
            let pojo: any = brokerMessage.orderedParameters[0];
            this.disks = pojo._disks;
            this.places = pojo._places;

        }

    }


    // export module service {
    //
    //
    //     function buildTemplateReqest():json_broker.BrokerMessage {
    //
    //         var answer = new json_broker.BrokerMessage();
    //         answer.messageType = "request";
    //         answer.metaData = {};
    //         answer.serviceName = "remote_gateway.AppleScriptService:finder";
    //         answer.majorVersion = 1;
    //         answer.minorVersion = 0;
    //         answer.orderedParameters = [];
    //         // answer.associativeParamaters = {};
    //
    //         return answer;
    //
    //     }
    //
    //
    //     // export module list_roots {
    //     //
    //     //     export function invoke( $http:angular.IHttpService ) :angular.IHttpPromise<json_broker.BrokerMessage> {
    //     //
    //     //         let request:json_broker.BrokerMessage = buildTemplateReqest();
    //     //         request.methodName = "list_roots";
    //     //
    //     //         return request.post($http);
    //     //
    //     //     }
    //     //
    //     // }
    //     //
    //     //export function list_roots( $http:angular.IHttpService ) :angular.IHttpPromise<jsonbroker.BrokerMessage> {
    //     //
    //     //    let request:jsonbroker.BrokerMessage = buildTemplateReqest();
    //     //    request.methodName = "list_roots";
    //     //
    //     //    return request.post($http);
    //     //
    //     //}
    //     //
    //     // export module list_path {
    //     //
    //     //     export function invoke($http:angular.IHttpService, path: String ): angular.IHttpPromise<jsonbroker.BrokerMessage> {
    //     //
    //     //         let request:json_broker.BrokerMessage = buildTemplateReqest();
    //     //         request.methodName = "list_path";
    //     //         request.orderedParameters = [path];
    //     //
    //     //         return request.post($http);
    //     //     }
    //     //
    //     // }
    // }



    export interface IRootLocation {
        _name: string;
        _path: string;
        _iconClass?: string;
    }


    export class Proxy {

        adapter: json_broker.IBrokerAdapter;

        constructor( adapter: json_broker.IBrokerAdapter ) {

            this.adapter = adapter;
        }

        ///////////////////////////////////////////////////////////////////////
        // Test / Debugging
        ///////////////////////////////////////////////////////////////////////

        ping(): angular.IPromise<void> {

            let request = json_broker.BrokerMessage.buildRequest( SERVICE_NAME, "ping" );

            return this.adapter.dispatch( request ).then(
                () => {}
            );
        }

        list_path( path: string ) :angular.IPromise<Folder> {

            let request:json_broker.BrokerMessage =
                BrokerMessage.buildRequestWithOrderedParameters( SERVICE_NAME, "list_path", [path] );

            return this.adapter.dispatch( request ).then(
                (response:json_broker.BrokerMessage) => {
                    return new Folder( path, response );
                }
            )
        }

        list_roots() :angular.IPromise<Roots> {

            let request:json_broker.BrokerMessage =
                BrokerMessage.buildRequestWithOrderedParameters( SERVICE_NAME, "list_roots" );

            return this.adapter.dispatch( request ).then(
                (response:json_broker.BrokerMessage) => {
                    let roots = new Roots( response) ;
                    return this.adapter.resolve( roots );
                }
            )
        }
    }

}