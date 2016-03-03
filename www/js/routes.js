angular.module('courier')
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true)
    $routeProvider
      .when('/', {
        templateUrl: 'templates/landing.html',
        controller: 'MainController'
      })
      .when('/signup', {
        templateUrl: 'templates/signup.html',
        controller: 'SignupController'
      })
  })
