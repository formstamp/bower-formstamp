(function() {
  var __slice = [].slice;

  angular.module('formstamp').directive('fsTimeFormat', [
    '$filter', function($filter) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          var prev;
          prev = null;
          return ngModel.$parsers.unshift(function(value) {
            var ideal, matched, patterns, _, _i, _ref, _ref1;
            value || (value = '');
            patterns = [/^[012]/, /^([0-1][0-9]|2[0-3]):?/, /^([0-1][0-9]|2[0-3]):?[0-5]/, /^([0-1][0-9]|2[0-3]):?([0-5][0-9])/];
            ideal = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
            _ref = patterns.filter(function(p) {
              return p.test(value);
            }), _ = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), matched = _ref[_i++];
            if (!ideal.test(value) && prev !== value) {
              if (value.length > 2) {
                value = value.replace(/^(\d\d)([^:]*)$/, "$1:$2");
              }
              value = ((_ref1 = value.match(matched)) != null ? _ref1[0] : void 0) || '';
              prev = value;
              ngModel.$setViewValue(value);
              ngModel.$render();
            }
            return value;
          });
        }
      };
    }
  ]);

}).call(this);
