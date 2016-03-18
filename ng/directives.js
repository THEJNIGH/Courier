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
