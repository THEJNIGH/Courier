angular.module('courier')
  .controller('EditController', function($scope, $firebaseAuth, $rootScope, $firebaseObject, $location) {
    $rootScope.css = 'edit';
    $scope.del = false;

    var obj;
    var URL = 'https://courier-app.firebaseio.com/';
    var ref = new Firebase(URL);

    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
      if(authData) {
        var userRef = new Firebase(URL + '/users/' + authData.uid);
        obj = $firebaseObject(userRef);
        obj.$loaded()
        .then(function(data) {
          $scope.user = obj;
          $scope.editUser = obj;
        })
        .catch(function(error) {
          console.error("Error:", error);
        });

      }
      else {
        console.log("Logged out.")
      }

    });// ends $onAuth

    $scope.editProfile = function() {
      $scope.user.name = $scope.editUser.name;
      $scope.user.email = $scope.editUser.email;
      $scope.user.bio = $scope.editUser.bio;
      obj.$save();
      alert('Saved successfully');
      $location.path('/chat');
    }

    $scope.delUser = function() {
      $scope.authObj.$removeUser({
        email: $scope.user.email,
        password: $scope.passUser
      }).then(function() {
        obj.$remove();
        alert('Account removed successfully!');
        $location.path('/')
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    }
  })
