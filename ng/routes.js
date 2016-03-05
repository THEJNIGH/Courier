angular.module('courier')
  .config(function($routeProvider, $locationProvider) {
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
  })
