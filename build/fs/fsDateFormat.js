(function() {
  angular.module('formstamp').directive('fsDateFormat', [
    '$filter', function($filter) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          ngModel.$formatters.push(function(value) {
            return $filter('date')(value, 'MM/dd/yyyy');
          });
          return ngModel.$parsers.unshift(function(value) {
            var date;
            date = new Date(value);
            if (isNaN(date.getTime())) {
              return null;
            } else {
              return date;
            }
          });
        }
      };
    }
  ]);

}).call(this);
