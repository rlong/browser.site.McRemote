/**
 * Created by rlong on 13/03/2016.
 */
/// <reference path="../../ts/page.ts" />
var mcRemote = page.buildAngularModule();
// mcRemote.component('hello2', {
//     template:  '<h3>{{$ctrl.greeting}} Solar System!</h3>' +
//     '<button ng-click="$ctrl.toggleGreeting()">toggle greeting</button>',
//
//     controller: function() {
//
//         console.log( "hey hey from hello2" );
//
//         this.greeting = 'fa fa fa';
//
//         this.toggleGreeting = function() {
//             this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
//         }
//     }
// });
mcRemote.component('bye', {
    template: '<h3>good bye {{$ctrl.greeting}}!</h3>',
    controller: function () {
        this.greeting = 'cruel world';
        this.toggleGreeting = function () {
            this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello';
        };
    }
});
mcRemote.component('list', {
    template: '<h3>list {{$ctrl.path}}!</h3>',
    controller: function ($scope, $stateParams) {
        console.log($scope);
        console.log($stateParams);
        console.log($stateParams.path);
        this.path = $stateParams.path;
        this.greeting = 'cruel world';
        this.toggleGreeting = function () {
            this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello';
        };
    }
});
mcRemote.config(function ($stateProvider) {
    {
        var helloState = {
            name: 'hello',
            url: '/hello',
            template: '<h3>hello world!</h3>'
        };
        $stateProvider.state(helloState);
    }
    {
        var bye = {
            name: 'bye',
            url: '/bye',
            component: 'bye'
        };
        $stateProvider.state(bye);
    }
    {
        var aboutState = {
            name: 'about',
            url: '/about',
            template: '<h3>Its the UI-Router hello world app!</h3>'
        };
        $stateProvider.state(aboutState);
    }
    {
        var listState = {
            name: 'list',
            url: 'list/{path}',
            // template: '<h3>listy p:{{params.path}} p:{{params()}} t:{{$transition$}}</h3>'
            component: 'list'
        };
        $stateProvider.state(listState);
    }
});
mcRemote.controller('index', ["$scope", function ($scope) {
        $scope.variable = "hey hey (from angular)";
    }]);
{
    // var myApp = angular.module('hellosolarsystem', ['ui.router', 'ui.router.visualizer']);
    var myApp = angular.module('hellosolarsystem', ['ui.router']);
}
angular.module('hellosolarsystem').component('about', {
    template: '<h3>Its the UI-Router<br>Hello Solar System app!</h3>'
});
angular.module('hellosolarsystem').component('hello', {
    template: '<h3>{{$ctrl.greeting}} solar sytem!</h3>' +
        '<button ng-click="$ctrl.toggleGreeting()">toggle greeting</button>',
    controller: function () {
        this.greeting = 'hello';
        this.toggleGreeting = function () {
            this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello';
        };
    }
});
angular.module('hellosolarsystem').config(function ($stateProvider) {
    console.log("'config' callback");
    // An array of state definitions
    var states = [
        {
            name: 'hello',
            url: '/hello',
            // Using component: instead of template:
            // component: 'hello'
            template: '<h1>hello</h1>'
        },
        {
            name: 'about',
            url: '/about',
            component: 'about'
        },
        {
            name: 'people',
            url: '/people',
            component: 'people',
            // This state defines a 'people' resolve
            // It delegates to the PeopleService to HTTP fetch (async)
            // The people component receives this via its `bindings: `
            resolve: {
                people: function (PeopleService) {
                    return PeopleService.getAllPeople();
                }
            }
        },
        {
            name: 'person',
            // This state takes a URL parameter called personId
            url: '/people/{personId}',
            component: 'person',
            // This state defines a 'person' resolve
            // It delegates to the PeopleService, passing the personId parameter
            resolve: {
                person: function (PeopleService, $transition$) {
                    return PeopleService.getPerson($transition$.params().personId);
                }
            }
        }
    ];
    // Loop over the state definitions and register them
    states.forEach(function (state) {
        $stateProvider.state(state);
    });
});
