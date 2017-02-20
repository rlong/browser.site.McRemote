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

    export class FolderItem {
        _name: string;
        _size?: number;
    }


    export class Folder {

        folderName: string = null;
        _folder_path: string = null;
        folderPosixPath: string = null;
        pathComponents: IPathComponent[] = [];

        files: FolderItem[] = [];
        folders: FolderItem[] = [];

        constructor( folderPath: string, response: json_broker.BrokerMessage ) {

            let pojo: any = response.orderedParameters[0];
            this.folderName = pojo._name;
            this._folder_path = pojo._folder_path;
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

    export interface IRootLocation {
        _name: string;
        _path: string;
        _iconClass: string;
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

        list( parent: Folder, child: FolderItem ):angular.IPromise<Folder> {

            let path = parent._folder_path + child._name + ":";
            return this.list_path( path );

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