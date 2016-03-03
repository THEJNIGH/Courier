angular.module('courier')
  .controller('ChatController', function($scope, $firebaseArray) {
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
  });
