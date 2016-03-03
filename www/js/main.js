angular.module('courier', ['ngRoute', 'firebase', 'ui.bootstrap']);

angular.module('courier')
  .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true)
    $routeProvider
      .when('/', {
        templateUrl: 'templates/landing.html',
        controller: 'MainController'
      })
      .when('/signup', {
        templateUrl: 'templates/signup.html',
        controller: 'SignupController'
      })
      .when('/chat', {
        templateUrl: 'templates/chat.html',
        controller: 'ChatController'
      })
  }])

angular.module('courier')
  .controller('ChatController', ["$scope", "$firebaseArray", function($scope, $firebaseArray) {
    var URL = 'https://courier-app.firebaseio.com/'
    var list = $firebaseArray(new Firebase(URL));

    // add an item
    $scope.dummy = { foo: "bar" };
    list.$add($scope.dummy)
    .then( function(ref) {
      var id = ref.key();
      console.info("Added Object with ID: " + id + " to Firebase");
    });


    // make the list available in the DOM
    $scope.list = list;
  }]);

angular.module('courier')
  .controller('MainController', ["$scope", function($scope) {
    console.log('It works.');
  }]);

angular.module('courier')
  .controller('SignupController', ["$scope", function($scope) {
    $scope.user = 'Bob';
  }]);
