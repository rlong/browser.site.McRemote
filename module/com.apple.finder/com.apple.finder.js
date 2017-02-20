/**
 * Created by rlong on 20/03/2016.
 */
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
var finder;
(function (finder) {
    var BrokerMessage = json_broker.BrokerMessage;
    var SERVICE_NAME = "remote_gateway.AppleScriptService:com.apple.finder";
    var FolderItem = (function () {
        function FolderItem() {
        }
        return FolderItem;
    }());
    finder.FolderItem = FolderItem;
    var Folder = (function () {
        function Folder(folderPath, response) {
            this.folderName = null;
            this._folder_path = null;
            this.folderPosixPath = null;
            this.pathComponents = [];
            this.files = [];
            this.folders = [];
            var pojo = response.orderedParameters[0];
            this.folderName = pojo._name;
            this._folder_path = pojo._folder_path;
            this.folderPosixPath = pojo._posix_path;
            this.files = pojo._files;
            this.folders = pojo._folders;
            {
                var path = "";
                var tokens = folderPath.split(":");
                for (var tokenIndex in tokens) {
                    var token = tokens[tokenIndex];
                    if (0 === token.length) {
                        continue;
                    }
                    path += token + ":";
                    this.pathComponents.push({ name: token, path: path });
                }
            }
        }
        return Folder;
    }());
    finder.Folder = Folder;
    // this.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
    //this.openFolderPath( "64G:Movies" );
    var Roots = (function () {
        function Roots(brokerMessage) {
            this.disks = null;
            this.places = null;
            console.log(brokerMessage);
            var pojo = brokerMessage.orderedParameters[0];
            this.disks = pojo._disks;
            this.places = pojo._places;
        }
        return Roots;
    }());
    finder.Roots = Roots;
    var Proxy = (function () {
        function Proxy(adapter) {
            this.adapter = adapter;
        }
        ///////////////////////////////////////////////////////////////////////
        // Test / Debugging
        ///////////////////////////////////////////////////////////////////////
        Proxy.prototype.ping = function () {
            var request = json_broker.BrokerMessage.buildRequest(SERVICE_NAME, "ping");
            return this.adapter.dispatch(request).then(function () { });
        };
        Proxy.prototype.list_path = function (path) {
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, "list_path", [path]);
            return this.adapter.dispatch(request).then(function (response) {
                return new Folder(path, response);
            });
        };
        Proxy.prototype.list = function (parent, child) {
            var path = parent._folder_path + child._name + ":";
            return this.list_path(path);
        };
        Proxy.prototype.list_roots = function () {
            var _this = this;
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, "list_roots");
            return this.adapter.dispatch(request).then(function (response) {
                var roots = new Roots(response);
                return _this.adapter.resolve(roots);
            });
        };
        return Proxy;
    }());
    finder.Proxy = Proxy;
})(finder || (finder = {}));
//# sourceMappingURL=com.apple.finder.js.map