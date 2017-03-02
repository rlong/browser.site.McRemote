/**
 * Created by local-rlong on 01/03/2017.
 */



module filePicker {

    class ViewController {

        $uibModal: angular.ui.bootstrap.IModalService = null

        brokerAdapter: json_broker.IBrokerAdapter;

        proxy: finder.Proxy;

        roots: finder.Roots = null;
        currentRoot: finder.IRootLocation = null;

        currentFolder: finder.Folder = null;


        constructor( brokerAdapter: json_broker.IBrokerAdapter, $uibModal: angular.ui.bootstrap.IModalService ) {

            this.proxy = new finder.Proxy( brokerAdapter );

            this.setupRootsAndCurrentFolder();

        }

        setupRootsAndCurrentFolder() {

            this.proxy.list_roots().then(
                (roots: finder.Roots) => {
                    console.log( roots );
                    this.roots = roots;
                    this.currentRoot = roots.places[0];

                    return this.proxy.list_path( this.currentRoot._path );
                },
                ( reason ) => {
                    console.error( reason );
                }
            ).then(
                ( folder: finder.Folder ) => {
                    console.log( folder );
                    this.currentFolder = folder;
                }
            )
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


        public openFolderItem( folderItem: finder.FolderItem ) {

            this.proxy.list( this.currentFolder, folderItem ).then(
                (folder:finder.Folder) => {

                    this.currentFolder = folder;
                },
                ( reason ) => {
                    console.error( reason );
                }
            )

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

        public folderOnClick( folder ) {
            console.log( folder );
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


        public rootLocationOnSelect( rootLocation: finder.IRootLocation) {

            console.log( rootLocation);
            // this.roots.current = rootLocation;
            // this.currentFolder.openFolderPath( rootLocation._path );
        }

    }


    export function setup( module: angular.IModule ) {

        module.component('filePicker', {

            templateUrl:  'filePicker.html',

            controller: [ "$http","$q", "$scope", "$stateParams", "$uibModal",

                function( $http: angular.IHttpService, $q: angular.IQService, $scope: any,  $stateParams: any, $uibModal: angular.ui.bootstrap.IModalService) {

                    let brokerAdapter: json_broker.IBrokerAdapter  = json_broker.buildBrokerAdapter( $http, $q );
                    $scope.viewController = new ViewController( brokerAdapter, $uibModal );

                    console.log( $stateParams );
                    this.path = $stateParams.path;
                }]
        });
    }
}