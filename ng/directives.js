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
