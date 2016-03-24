angular.module('courier')
  .controller('AdminController', function($scope, $firebaseObject, $firebaseArray, $rootScope, $firebaseAuth, $location) {
    $rootScope.css = 'admin';

    var obj;
    var URL = 'https://courier-app.firebaseio.com/';
    var ref = new Firebase(URL);

    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
      if(authData) {
        var userRef = new Firebase(URL + '/users/');
        array = $firebaseArray(userRef);
        array.$loaded()
        .then(function() {
          $scope.users = array;
        })
        .catch(function(error) {
          console.error("Error:", error);
        });
      }
      else {
        console.log("Logged Out.");
      }
    });

    $scope.removeUser = function(user) {
      array.$remove(user).then(function(ref) {
        ref.key() === item.$id; // true
      });
    }

    $scope.delUser = function() {
      $scope.authObj.$removeUser({
        email: $scope.user.email,
        password: $scope.passUser
      }).then(function() {
        obj.$remove();
        alert('Account removed successfully!');
        $location.path('/');
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    }
  })
