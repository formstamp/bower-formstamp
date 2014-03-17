(function() {
  angular.module("formstamp").directive("fsDatetime", [
    '$compile', function($compile) {
      return {
        restrict: "A",
        scope: {
          disabled: '=ngDisabled',
          "class": '@'
        },
        require: '?ngModel',
        replace: true,
        template: "<div class=\"fs-datetime fs-widget-root\" ng-class='{ \"fs-with-value\": value }'>\n  <div fs-date ng-model=\"date\" ng-disabled=\"disabled\" fs-null-form></div>\n  <div fs-time ng-model=\"time\" ng-disabled=\"disabled\" fs-null-form with-date></div>\n  <button type=\"button\"\n          class=\"btn btn-default fs-datetime-clear-btn\"\n          ng-show='value'\n          ng-disabled=\"disabled\"\n          ng-click='clearDate()'>&times;</button>\n</div>",
        controller: function($scope) {
          return $scope.clearDate = function() {
            $scope.time = null;
            $scope.date = null;
            return $scope.value = null;
          };
        },
        link: function(scope, element, attrs, ngModelCtrl, transcludeFn) {
          if (ngModelCtrl) {
            scope.value = null;
            scope.$watch('time', function(newValue, oldValue) {
              var hours, minutes, parts;
              if (!angular.equals(newValue, oldValue)) {
                if (newValue) {
                  parts = newValue.split(':');
                  minutes = parseInt(parts[1]) || 0;
                  hours = parseInt(parts[0]) || 0;
                  scope.value || (scope.value = new Date());
                  scope.value = angular.copy(scope.value);
                  scope.value.setHours(hours);
                  scope.value.setMinutes(minutes);
                  scope.value.setSeconds(0);
                  return scope.value.setMilliseconds(0);
                }
              }
            });
            scope.$watch('date', function(newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                if (newValue) {
                  scope.value || (scope.value = new Date());
                  scope.value = angular.copy(scope.value);
                  scope.value.setDate(newValue.getDate());
                  scope.value.setMonth(newValue.getMonth());
                  return scope.value.setFullYear(newValue.getFullYear());
                }
              }
            });
            scope.$watch('value', function(newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                return ngModelCtrl.$setViewValue(scope.value);
              }
            });
            return ngModelCtrl.$render = function() {
              scope.date = scope.value = ngModelCtrl.$viewValue;
              return scope.time = ngModelCtrl.$viewValue ? toTimeStr({
                hours: ngModelCtrl.$viewValue.getHours(),
                minutes: ngModelCtrl.$viewValue.getMinutes()
              }) : null;
            };
          }
        }
      };
    }
  ]);

}).call(this);
