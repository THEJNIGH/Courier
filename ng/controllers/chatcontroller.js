angular.module('courier')
  .controller('ChatController', function($scope, $firebaseObject, $rootScope, $firebaseArray, $firebaseAuth) {
    $rootScope.css = 'rest';
    $scope.messages = [];

    var URL = 'https://courier-app.firebaseio.com/';
    var ref = new Firebase(URL);
    var online = new Firebase(URL + '/.info/connected');

    online.on("value", function(snap) {
      if (snap.val() === true) {

      } else {
        console.log("not connected");
      }
    });

    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
      if(authData) {

        var userRef = new Firebase(URL + '/users/' + authData.uid);//User data Firebase
        var obj = $firebaseObject(userRef);

        var chatRef = new Firebase(URL + '/chat/public/');
        var chatArray = $firebaseArray(chatRef);//Chat data Firebase

        chatArray.$loaded()
        .then(function(data) {
          $scope.chat = data;
          console.log("CHAT DATA::: ", $scope.chat);
        })
        .catch(function(error) {
          console.log("Error:", error);
        });

        obj.$loaded().then(function(userData ) {
          console.log("USERDATA", userData);
          $scope.user = userData;
        });

        $scope.user = obj;
        $scope.chat = chatArray;

        $scope.chatWindow = function() {
          console.log("FIRE", $scope.chat);
          var getDate = Date.now();

          chatArray.$add({
            text : $scope.message.text,
            user : $scope.user.name,
            timeStamp : getDate
          })
          .then(function(data) {
            console.log(data);
          })
          .catch(function(error) {
            console.log("Error:", error);
          });

          console.log($scope.messages);
          $scope.message.text = "";
        };
      }
      else {
        console.log("Logged out.")
      }

    });// ends $onAuth
  });
