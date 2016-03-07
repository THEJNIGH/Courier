angular.module('courier')
  .controller('MainController', function($scope, $rootScope, $firebaseArray, $firebaseAuth, $location) {

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
          email: $scope.newUser.email
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

  });
