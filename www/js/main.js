angular.module('courier', ['ngRoute', 'firebase', 'ui.bootstrap']);

angular.module('courier')
  .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true)
    $routeProvider
      .when('/', {
        templateUrl: 'templates/landing.html',
        controller: 'MainController'
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
  .controller('MainController', ["$scope", "$firebaseArray", "$firebaseAuth", "$location", function($scope, $firebaseArray, $firebaseAuth, $location) {
    $scope.register = false;

    var ref = new Firebase("https://courier-app.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.registerUser = function() {
      $scope.authObj.$createUser({
        email: $scope.newUser.email,
        password: $scope.newUser.password
      }).then(function(userData) {
        return $scope.authObj.$authWithPassword({
          email: $scope.newUser.email,
          password: $scope.newUser.password
        });
      }).then(function(authData) {
        $location.path('/chat');
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    }

    $scope.login = function() {
      $scope.authObj.$authWithPassword({
        email: $scope.user.email,
        password: $scope.user.password,
      }).then(function(authData) {
        console.log("Logged in as:", authData.uid);
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    }

  }]);

angular.module('courier')
  .controller('SignupController', ["$scope", function($scope) {
    $scope.user = 'Bob';
  }]);
