(function() {
  angular.module("formstamp").directive("fsTime", [
    '$compile', '$filter', '$timeout', function($compile, $filter, $timeout) {
      return {
        restrict: "A",
        scope: {
          disabled: '=ngDisabled',
          "class": '@'
        },
        require: '?ngModel',
        replace: true,
        template: function(el) {
          return "<div class=\"fs-time fs-widget-root\">\n  <input\n    fs-null-form\n    fs-input\n    fs-focus-when='active'\n    fs-blur-when='!active'\n    fs-on-focus='active = true'\n    fs-on-blur='onBlur()'\n    fs-hold-focus\n    fs-time-format\n    fs-down='move(1)'\n    fs-up='move(-1)'\n    fs-pg-up='move(-11)'\n    fs-pg-down='move(11)'\n    fs-enter='onEnter()'\n    fs-esc='active = false'\n    ng-model=\"value\"\n    class=\"form-control\"\n    ng-disabled=\"disabled\"\n    type=\"text\"/>\n\n  <span class=\"glyphicon glyphicon-time\" ng-click=\"active = !disabled\"></span>\n  <div ng-if='!disabled && active' fs-list items=\"dropdownItems\">\n    {{item}}\n  </div>\n</div>";
        },
        link: function(scope, element, attrs, ngModelCtrl) {
          var dynamicItems, h, hours, items, m, minutes, num, updateDropdown, watchFn, zh, _i, _j, _len, _len1;
          hours = (function() {
            var _i, _results;
            _results = [];
            for (num = _i = 0; _i <= 23; num = ++_i) {
              _results.push(num);
            }
            return _results;
          })();
          minutes = ['00', '15', '30', '45'];
          items = [];
          for (_i = 0, _len = hours.length; _i < _len; _i++) {
            h = hours[_i];
            zh = h < 10 ? "0" + h : h;
            for (_j = 0, _len1 = minutes.length; _j < _len1; _j++) {
              m = minutes[_j];
              items.push("" + zh + ":" + m);
            }
          }
          dynamicItems = function() {
            if (scope.value && scope.value.length === 5 && indexOf(items, scope.value) === -1) {
              return [scope.value];
            } else {
              return [];
            }
          };
          updateDropdown = function() {
            return scope.dropdownItems = $filter('filter')(items, scope.value).concat(dynamicItems());
          };
          scope.$watch('value', function(q) {
            return updateDropdown();
          });
          scope.onBlur = function() {
            return $timeout(function() {
              return scope.active = false;
            }, 0, true);
          };
          scope.onEnter = function() {
            scope.select(scope.listInterface.selectedItem);
            scope.active = false;
            return false;
          };
          scope.move = function(d) {
            return scope.listInterface.move && scope.listInterface.move(d);
          };
          scope.select = function(value) {
            scope.value = value;
            return scope.active = false;
          };
          scope.listInterface = {
            onSelect: scope.select,
            move: function() {
              return console.log("not-implemented listInterface.move() function");
            }
          };
          if (ngModelCtrl) {
            watchFn = function(newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                return ngModelCtrl.$setViewValue(newValue);
              }
            };
            scope.$watch('value', watchFn);
            return ngModelCtrl.$render = function() {
              return scope.value = ngModelCtrl.$viewValue;
            };
          }
        }
      };
    }
  ]);

}).call(this);
