angular.module('courier')
  .controller('ChatController', function($scope, $firebaseObject, $rootScope, $firebaseArray, $firebaseAuth, $location) {
    $rootScope.css = 'rest';
    $scope.messages = [];

    var URL = 'https://courier-app.firebaseio.com/';
    var ref = new Firebase(URL);

    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
      if(authData) {

        var userURL = URL + '/users/' + authData.uid;
        var connections = new Firebase(userURL + '/connections');
        var lastOnline = new Firebase(userURL + '/lastOnline');
        var connected = new Firebase(URL + '/.info/connected');
        var connectedUsersRef = new Firebase(URL + '/connectedUsers/' + authData.uid);
        var connectedList = new Firebase(URL + '/connectedUsers/');
        $scope.connectedList = $firebaseArray(connectedList);

        var userRef = new Firebase(userURL);//User data Firebase
        var obj = $firebaseObject(userRef);

        var chatRef = new Firebase(URL + '/chat/public/');
        var chatArray = $firebaseArray(chatRef);//Chat data Firebase

        var connectedUsers = $firebaseObject(connectedUsersRef);

        chatArray.$loaded()
        .then(function(data) {
          $scope.chat = data;
        })
        .catch(function(error) {
          console.log("Error:", error);
        });

        obj.$loaded().then(function(userData) {
          $scope.user = userData;

          if($scope.user.userType != 'Admin'){
            connected.on('value', function(snap) {
              if (snap.val() === true) {
                var con = connections.push(true);
                connectedUsers.name = $scope.user.name;
                connectedUsers.$save();
                con.onDisconnect().remove();
                conUser.onDisconnect().remove();
                lastOnline.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
              }
            });
          }
          else {
            $location.path('/dash');
          }

        });

        $scope.user = obj;
        $scope.chat = chatArray;

        $scope.chatWindow = function() {
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
