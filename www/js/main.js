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
  .controller('ChatController', ["$scope", "$firebaseObject", "$rootScope", "$firebaseArray", "$firebaseAuth", function($scope, $firebaseObject, $rootScope ,$firebaseArray, $firebaseAuth) {
    $rootScope.css = 'rest';

    var URL = 'https://courier-app.firebaseio.com/';
    var ref = new Firebase(URL);
    var list = $firebaseArray(ref);
    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
      if (authData) {
        var userRef = new Firebase(URL + '/users/' + authData.uid);
        var obj = $firebaseObject(userRef);

        // to take an action after the data loads, use the $loaded() promise
        obj.$loaded().then(function() {
          console.log("loaded record:", obj.$id, obj.name);

         // To iterate the key/value pairs of the object, use angular.forEach()
          angular.forEach(obj, function(value, key) {
            console.log(key, value);
          });
        });

         // To make the data available in the DOM, assign it to $scope
         $scope.data = obj;

        console.log("Logged in as:", authData.uid);
      } else {
        console.log("Logged out");
      }
    });

    // make the list available in the DOM
    $scope.list = list;
  }]);

angular.module('courier')
  .controller('MainController', ["$scope", "$rootScope", "$firebaseArray", "$firebaseAuth", "$location", function($scope, $rootScope, $firebaseArray, $firebaseAuth, $location) {

    //Using scoped variable to properly use ng-show with forms.
    $scope.register = false;

    $rootScope.css = 'style';

    //Setting the reference to the Courier application.
    var ref = new Firebase("https://courier-app.firebaseio.com/users/");

    //Scoping a variable called authObj to the firebaseAuth with the reference to the Courier application.
    $scope.authObj = $firebaseAuth(ref);

    //Registering a new user to the Courier application.
    $scope.registerUser = function() {
      $scope.authObj.$createUser({
        email: $scope.newUser.email,
        password: $scope.newUser.password
      }).then(function(userData) {

        ref.child(userData.uid).set({
          name: $scope.newUser.name,
          email: $scope.newUser.email,
          userType: 'user'
        })

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

    //Loggin the user into the application.
    $scope.login = function() {
      $scope.authObj.$authWithPassword({
        email: $scope.user.email,
        password: $scope.user.password,
      }).then(function(authData) {
        $location.path('/chat');
        console.log("Logged in as:", authData.uid);
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    }

  }]);
