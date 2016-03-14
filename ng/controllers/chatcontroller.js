angular.module('courier')
  .controller('ChatController', function($scope, $firebaseObject, $rootScope ,$firebaseArray, $firebaseAuth) {
    $rootScope.css = 'rest';

    var URL = 'https://courier-app.firebaseio.com/';
    var ref = new Firebase(URL);
    var chat = $firebaseArray(ref);
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
  });
