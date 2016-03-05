angular.module('courier')
  .controller('MainController', function($scope, $firebaseArray, $firebaseAuth, $location) {
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

  });
