angular.module('courier', ['ngRoute', 'firebase', 'ui.bootstrap']);

angular.module('courier').directive('ngScrollBottom', ['$timeout', function ($timeout) {
  return {
    scope: {
      ngScrollBottom: "="
    },
    link: function ($scope, $element) {
      $element = $element[0]
      console.log('log', $element)
      $scope.$watchCollection('ngScrollBottom', function (newValue) {
        console.log('newValue',newValue)
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
  }])

angular.module('courier')
  .controller('ChatController', ["$scope", "$firebaseObject", "$rootScope", "$firebaseArray", "$firebaseAuth", function($scope, $firebaseObject, $rootScope, $firebaseArray, $firebaseAuth) {
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
