(function() {
  angular.module('formstamp').directive('fsDate', function() {
    return {
      restrict: 'EA',
      require: '?ngModel',
      scope: {
        "class": '@',
        disabled: '=ngDisabled',
        placeholder: '@'
      },
      templateUrl: '/templates/date.html',
      replace: true,
      link: function($scope, element, attrs, ngModel) {
        $scope.selectedDate = {};
        if (ngModel) {
          ngModel.$render = function() {
            return $scope.selectedDate.date = ngModel.$modelValue;
          };
          $scope.$watch('selectedDate.date', function(newDate, oldDate) {
            var updatedDate;
            updatedDate = updateDate(newDate, oldDate);
            if ((updatedDate != null ? updatedDate.getTime() : void 0) !== (oldDate != null ? oldDate.getTime() : void 0)) {
              return ngModel.$setViewValue(updatedDate);
            }
          });
        }
        return $scope.close = function() {
          return $scope.active = false;
        };
      }
    };
  });

}).call(this);
