angular.module('courier', ['ngRoute', 'firebase', 'ui.bootstrap']);

angular.module('courier').directive('ngScrollBottom', ['$timeout', function ($timeout) {
  return {
    scope: {
      ngScrollBottom: "="
    },
    link: function ($scope, $element) {
      $element = $element[0]
      $scope.$watchCollection('ngScrollBottom', function (newValue) {
        if (newValue) {
          $timeout(function(){
            $element.scrollTop = $element.scrollHeight;
          }, 0);
        }
      });
    }
  }
}]);

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
      .when('/edit', {
        templateUrl: 'templates/edit.html',
        controller: 'EditController'
      })
      .when('/dash', {
        templateUrl: 'templates/dashboard.html',
        controller: 'AdminController'
      })
  }])

angular.module('courier')
  .controller('ChatController', ["$scope", "$firebaseObject", "$rootScope", "$firebaseArray", "$firebaseAuth", "$location", function($scope, $firebaseObject, $rootScope, $firebaseArray, $firebaseAuth, $location) {
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
  }]);

angular.module('courier')
  .controller('AdminController', ["$scope", "$firebaseObject", "$firebaseArray", "$rootScope", "$firebaseAuth", "$location", function($scope, $firebaseObject, $firebaseArray, $rootScope, $firebaseAuth, $location) {
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
  }])

angular.module('courier')
  .controller('EditController', ["$scope", "$firebaseAuth", "$rootScope", "$firebaseObject", "$location", function($scope, $firebaseAuth, $rootScope, $firebaseObject, $location) {
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
        $location.path('/');
      }).catch(function(error) {
        console.error("Error: ", error);
      });
    }
  }])

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
