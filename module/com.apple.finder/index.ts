/**
 * Created by rlong on 19/03/2016.
 */


/// <reference path="../../component/popup.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/session.ts" />




    // export namespace model {
    //
    //
    //
    //     // export interface IHttpPromiseErrorHandler {
    //     //     handleHttpPromiseError( origin:any, callee: any, reason:any);
    //     // }
    //     //
    //     // export class CurrentFolder {
    //     //
    //     //     $http: angular.IHttpService = null;
    //     //
    //     //     folderName: string = null;
    //     //     folderPath: string = null;
    //     //     folderPosixPath: string = null;
    //     //     pathComponents: IPathComponent[] = [];
    //     //     httpPromiseErrorHandler: IHttpPromiseErrorHandler = null;
    //     //
    //     //     // filePath: FilePath = null; // new FilePath( "inbox", "scratch:rlong:Movies:inbox");
    //     //     files: any[] = [];
    //     //     folders: any[] = [];
    //     //
    //     //     constructor( $http: angular.IHttpService ) {
    //     //
    //     //         this.$http = $http;
    //     //
    //     //         // this.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
    //     //         //this.openFolderPath( "64G:Movies" );
    //     //         //this.openFolderPath( "64G:Movies" );
    //     //
    //     //     }
    //     //
    //     //     public openFolderPath( folderPath: string ): angular.IHttpPromise<CurrentFolder> {
    //     //
    //     //         this.folderPath = folderPath;
    //     //         this.files = [];
    //     //         this.folders = [];
    //     //
    //     //         this.pathComponents = [];
    //     //         {
    //     //             var path = "";
    //     //             var tokens = folderPath.split(":");
    //     //             for( let tokenIndex in tokens ) {
    //     //
    //     //                 let token = tokens[tokenIndex];
    //     //                 if( 0 === token.length ) {
    //     //                     continue;
    //     //                 }
    //     //
    //     //                 path += token + ":";
    //     //                 this.pathComponents.push( {name:token, path:path} );
    //     //             }
    //     //         }
    //     //         console.log( this.pathComponents );
    //     //
    //     //
    //     //         return finder.service.list_path.invoke( this.$http, this.folderPath ).then<CurrentFolder>(
    //     //
    //     //             ( promiseValue: jsonbroker.BrokerMessage ) =>  { // successCallback
    //     //
    //     //                 console.log( promiseValue );
    //     //
    //     //                 let pojo: any = promiseValue.orderedParamaters[0];
    //     //                 this.folderName = pojo._name;
    //     //                 this.folderPosixPath = pojo._posix_path;
    //     //                 this.files = pojo._files;
    //     //                 this.folders = pojo._folders;
    //     //                 return this;
    //     //
    //     //             }
    //     //             ,(reason: any) => { // errorCallback
    //     //
    //     //                 if( this.httpPromiseErrorHandler ) {
    //     //                     this.httpPromiseErrorHandler.handleHttpPromiseError( this, this.openFolderPath, reason );
    //     //                 }
    //     //                 return reason;
    //     //
    //     //             }
    //     //         )
    //     //
    //     //     }
    //     //
    //     // }
    //     //
    //     //
    //     // export interface IRootLocation {
    //     //     _name: string;
    //     //     _path: string;
    //     //     _iconClass?: string;
    //     // }
    //     //
    //     //
    //     //
    //     // export class Roots {
    //     //
    //     //     disks: IRootLocation[] = null;
    //     //     places: IRootLocation[] = null;
    //     //
    //     //     current: IRootLocation = null;
    //     //
    //     //     $http:angular.IHttpService = null;
    //     //
    //     //     constructor( $http: angular.IHttpService ) {
    //     //
    //     //         this.$http = $http;
    //     //
    //     //
    //     //         // this.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
    //     //         //this.openFolderPath( "64G:Movies" );
    //     //
    //     //
    //     //     }
    //     //
    //     //     public list_roots() {
    //     //
    //     //         finder.service.list_roots.invoke( this.$http ).then(
    //     //
    //     //             ( promiseValue: jsonbroker.BrokerMessage ) => { // successCallback
    //     //
    //     //                 console.log( promiseValue );
    //     //                 let pojo: any = promiseValue.orderedParamaters[0];
    //     //                 this.disks = pojo._disks;
    //     //                 console.log( this.disks );
    //     //                 this.places = pojo._places;
    //     //                 console.log( this.places );
    //     //
    //     //                 this.current = this.disks[0];
    //     //
    //     //             },
    //     //             (reason: any) => { // errorCallback
    //     //
    //     //                 console.error( reason );
    //     //
    //     //             }
    //     //
    //     //         );
    //     //
    //     //     }
    //     //
    //     // }
    //
    // }

class ViewController {


    currentFolder: finder.Folder = null;
    roots: finder.Roots = null;
    proxy: finder.Proxy;

    brokerAdapter: json_broker.IBrokerAdapter;
    $uibModal: angular.ui.bootstrap.IModalService = null

    constructor( brokerAdapter: json_broker.IBrokerAdapter, $uibModal: angular.ui.bootstrap.IModalService ) {

        this.proxy = new finder.Proxy( brokerAdapter );

        // this.currentFolder = ;
        // this.currentFolder.httpPromiseErrorHandler = this;
        // this.currentFolder.openFolderPath( "64G:Movies:" );
        //
        // this.roots = new model.Roots( $http );
        // this.roots.list_roots();
        //
        // this.$http = $http;
        // this.$uibModal = $uibModal;

        this.list_roots();

    }


    list_roots() {

        this.proxy.list_roots().then(
            (roots: finder.Roots) => {
                console.log( roots );
                this.roots = roots;
            },
            ( reason ) => {
                console.error( reason );
            }
        )
    }

    handleHttpPromiseError( origin:any, callee: any, reason:any) {
        console.error( reason );
        component.popup.showHttpPromiseError( this.$uibModal, reason );
    }



    public openFolderPath( folderPath: string ) {
        console.log( arguments );
        // this.currentFolder.openFolderPath(folderPath).then(
        //     (promiseValue:model.CurrentFolder) => {
        //
        //     },
        //     (reason:any) => {
        //
        //     }
        //
        // )
    }


    public openFolder( folder ) {

        console.log( folder );

        // this.currentFolder.openFolderPath( this.currentFolder.folderPath + folder._name + ":" );

    }

    public breadcrumbOnClick( pathComponent: finder.IPathComponent ) {

        console.log( pathComponent );
        // this.currentFolder.openFolderPath( pathComponent.path );

    }

    public fileButtonOnClick( file ) {

        console.log( file );

        // var modalInstance = this.$uibModal.open({
        //     animation: true,
        //     templateUrl: 'myModalContent.html',
        //     controller: 'ModalInstanceCtrl',
        //     //size: size,
        //     resolve: {
        //         file: function () {
        //             return file;
        //         },
        //         parentFolderPosixPath: () => {
        //             return this.currentFolder.folderPosixPath;
        //         }
        //     }
        // });
        //
        // modalInstance.result.then(function (selectedItem) {
        //     this.$scope.selected = selectedItem;
        // }, function () {
        //     console.log( 'Modal dismissed at: ' + new Date());
        // });

    }


    public downloadFile( path: string ) {
        let location = "/_dynamic_/HLSimpleGetFileRequestHandler/" + path;
        console.log( location );
        window.open( location );
    }



    public ping() {

        this.proxy.ping().then(
            ( ) => {
                console.log( "pring responded")
            },
            (reason: any) => { // errorCallback

                console.error( reason );

            }
        );
    }

    // public list_roots() {
    //
    //     finder.service.list_roots.invoke( this.$http ).then(
    //
    //         ( response: jsonbroker.BrokerMessage ) => { // successCallback
    //
    //             console.log( response );
    //
    //         },
    //         (reason: any) => { // errorCallback
    //
    //             console.error( reason );
    //
    //         }
    //
    //     );
    // }

    public rootLocationOnSelect( rootLocation: finder.IRootLocation) {

        console.log( rootLocation);
        // this.roots.current = rootLocation;
        // this.currentFolder.openFolderPath( rootLocation._path );
    }

}


var mcRemote =  page.buildAngularModule();

application.setup( mcRemote );
session.setup( mcRemote );
page.setup( mcRemote );


mcRemote.controller('index', [
    "$http","$q","$scope","$uibModal",
    function ($http: angular.IHttpService, $q: angular.IQService, $scope: any, $uibModal: angular.ui.bootstrap.IModalService ) {

    $scope.variable = "hey hey (from angular)";

    let brokerAdapter: json_broker.IBrokerAdapter  = json_broker.buildBrokerAdapter( $http, $q );

    $scope.viewController = new ViewController( brokerAdapter, $uibModal );
    $scope.currentFolder = $scope.viewController.currentFolder;
    $scope.roots = $scope.viewController.roots;

}]);




// mcRemote.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, parentFolderPosixPath, file) {
//
//     $scope.file = file;
//     $scope.fileUrl = "/_dynamic_/HLFileDownloadRequestHandler/" + parentFolderPosixPath + "/" + file._name;
//
//     $scope.ok = function () {
//         $uibModalInstance.close();
//     };
//
//     $scope.cancel = function () {
//         $uibModalInstance.dismiss('cancel');
//     };
// });



