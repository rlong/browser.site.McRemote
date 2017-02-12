/**
 * Created by rlong on 19/03/2016.
 */


/// <reference path="../../typings/browser.d.ts" />
/// <reference path="../../component/component.popup.ts" />
/// <reference path="../../ts/jsonbroker/jsonbroker.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/session.ts" />
/// <reference path="finder.ts" />



namespace index {


    export namespace model {


        export interface IPathComponent {
            name: string;
            path: string;
        }

        export interface IHttpPromiseErrorHandler {
            handleHttpPromiseError( origin:any, callee: any, reason:any);
        }

        export class CurrentFolder {

            $http: angular.IHttpService = null;

            folderName: string = null;
            folderPath: string = null;
            folderPosixPath: string = null;
            pathComponents: IPathComponent[] = [];
            httpPromiseErrorHandler: IHttpPromiseErrorHandler = null;

            // filePath: FilePath = null; // new FilePath( "inbox", "scratch:rlong:Movies:inbox");
            files: any[] = [];
            folders: any[] = [];

            constructor( $http: angular.IHttpService ) {

                this.$http = $http;

                // this.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
                //this.openFolderPath( "64G:Movies" );
                //this.openFolderPath( "64G:Movies" );

            }

            public openFolderPath( folderPath: string ): angular.IHttpPromise<CurrentFolder> {

                this.folderPath = folderPath;
                this.files = [];
                this.folders = [];

                this.pathComponents = [];
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
                console.log( this.pathComponents );


                return finder.service.list_path.invoke( this.$http, this.folderPath ).then<CurrentFolder>(

                    ( promiseValue: jsonbroker.BrokerMessage ) =>  { // successCallback

                        console.log( promiseValue );

                        let pojo: any = promiseValue.orderedParamaters[0];
                        this.folderName = pojo._name;
                        this.folderPosixPath = pojo._posix_path;
                        this.files = pojo._files;
                        this.folders = pojo._folders;
                        return this;

                    }
                    ,(reason: any) => { // errorCallback

                        if( this.httpPromiseErrorHandler ) {
                            this.httpPromiseErrorHandler.handleHttpPromiseError( this, this.openFolderPath, reason );
                        }
                        return reason;

                    }
                )

            }

        }


        export interface IRootLocation {
            _name: string;
            _path: string;
            _iconClass?: string;
        }



        export class Roots {

            disks: IRootLocation[] = null;
            places: IRootLocation[] = null;

            current: IRootLocation = null;

            $http:angular.IHttpService = null;

            constructor( $http: angular.IHttpService ) {

                this.$http = $http;


                // this.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
                //this.openFolderPath( "64G:Movies" );


            }

            public list_roots() {

                finder.service.list_roots.invoke( this.$http ).then(

                    ( promiseValue: jsonbroker.BrokerMessage ) => { // successCallback

                        console.log( promiseValue );
                        let pojo: any = promiseValue.orderedParamaters[0];
                        this.disks = pojo._disks;
                        console.log( this.disks );
                        this.places = pojo._places;
                        console.log( this.places );

                        this.current = this.disks[0];

                    },
                    (reason: any) => { // errorCallback

                        console.error( reason );

                    }

                );

            }

        }

    }

    export class ViewController implements model.IHttpPromiseErrorHandler{

        currentFolder: model.CurrentFolder = null;
        roots: model.Roots = null;


        $http: angular.IHttpService = null;
        $uibModal: any = null

        constructor( $scope: any, $http: angular.IHttpService, $uibModal: any ) {

            this.currentFolder = new model.CurrentFolder( $http );
            this.currentFolder.httpPromiseErrorHandler = this;
            this.currentFolder.openFolderPath( "64G:Movies:" );

            this.roots = new model.Roots( $http );
            this.roots.list_roots();

            //console.log( $http );
            this.$http = $http;
            //console.log( this.$http );

            this.$uibModal = $uibModal;

            // this.model.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );


        }

        // IHttpPromiseErrorHandler.handlehttpPromiseError
        handleHttpPromiseError( origin:any, callee: any, reason:any) {
            console.error( reason );
            popup.showHttpPromiseError( this.$uibModal, reason );
            //popup.show( this.$uibModal, "Err-oh!");

        }



        public openFolderPath( folderPath: string ) {
            this.currentFolder.openFolderPath(folderPath).then(
                (promiseValue:model.CurrentFolder) => {

                },
                (reason:any) => {

                }

            )
        }


        public openFolder( folder ) {

            console.log( folder );

            this.currentFolder.openFolderPath( this.currentFolder.folderPath + folder._name + ":" );

        }

        public breadcrumbOnClick( pathComponent: model.IPathComponent ) {

            console.log( pathComponent );
            this.currentFolder.openFolderPath( pathComponent.path );

        }

        public fileButtonOnClick( file ) {

            console.log( file );

            var modalInstance = this.$uibModal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                //size: size,
                resolve: {
                    file: function () {
                        return file;
                    },
                    parentFolderPosixPath: () => {
                        return this.currentFolder.folderPosixPath;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                this.$scope.selected = selectedItem;
            }, function () {
                console.log( 'Modal dismissed at: ' + new Date());
            });

        }


        public downloadFile( path: string ) {
            let location = "/_dynamic_/HLSimpleGetFileRequestHandler/" + path;
            console.log( location );
            window.open( location );
        }



        public ping() {

            finder.service.ping.invoke( this.$http ).then(

                ( response: jsonbroker.BrokerMessage ) => { // successCallback

                    console.log( response );

                },
                (reason: any) => { // errorCallback

                    console.error( reason );

                }
            );
        }

        public list_roots() {

            finder.service.list_roots.invoke( this.$http ).then(

                ( response: jsonbroker.BrokerMessage ) => { // successCallback

                    console.log( response );

                },
                (reason: any) => { // errorCallback

                    console.error( reason );

                }

            );
        }

        public rootLocationOnSelect( rootLocation: model.IRootLocation) {

            console.log( rootLocation);
            this.roots.current = rootLocation;
            this.currentFolder.openFolderPath( rootLocation._path );
        }

    }

}

namespace file_info {


    export class Model {

    }


    export class ViewController {

    }
}

var mcRemote= angular.module('mc-remote', ['ngAnimate', 'ui.bootstrap']);

application.context.setup( mcRemote );
session.context.setup( mcRemote );
page.context.setup( mcRemote );


mcRemote.controller('index', function ($scope: any, $http: angular.IHttpService, $uibModal: any ) {

    $scope.variable = "hey hey (from angular)";
    console.log( $http  );
    $scope.viewController = new index.ViewController( $scope, $http, $uibModal );
    $scope.currentFolder = $scope.viewController.currentFolder;
    $scope.roots = $scope.viewController.roots;

    // $scope.controller.ping();

});




mcRemote.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, parentFolderPosixPath, file) {

    $scope.file = file;
    $scope.fileUrl = "/_dynamic_/HLFileDownloadRequestHandler/" + parentFolderPosixPath + "/" + file._name;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});



