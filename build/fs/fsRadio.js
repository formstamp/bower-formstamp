(function() {
  angular.module("formstamp").directive("fsRadio", [
    '$window', function($window) {
      return {
        restrict: "A",
        scope: {
          required: '=',
          disabled: '=ngDisabled',
          items: '=',
          inline: '=',
          keyAttr: '@',
          valueAttr: '@'
        },
        require: '?ngModel',
        template: function(el, attrs) {
          var itemTpl, name, template;
          itemTpl = el.html() || '{{item.label}}';
          name = "fsRadio_" + (nextUid());
          return template = "<div class='fs-widget-root fs-radio fs-racheck' ng-class=\"{disabled: disabled, enabled: !disabled}\">\n  <div class=\"fs-radio-item\"\n     ng-repeat=\"item in items\" >\n    <input\n     fs-null-form\n     type=\"radio\"\n     ng-model=\"$parent.selectedItem\"\n     name=\"" + name + "\"\n     ng-value=\"item\"\n     ng-disabled=\"disabled\"\n     id=\"" + name + "_{{$index}}\" />\n\n    <label for=\"" + name + "_{{$index}}\">\n      <span class='fs-radio-btn'><span></span></span>\n\n      " + itemTpl + "\n    </label>\n  </div>\n</div>";
        },
        link: function(scope, element, attrs, ngModelCtrl, transcludeFn) {
          if (ngModelCtrl) {
            scope.$watch('selectedItem', function(newValue, oldValue) {
              if (newValue !== oldValue) {
                return ngModelCtrl.$setViewValue(scope.selectedItem);
              }
            });
            return ngModelCtrl.$render = function() {
              return scope.selectedItem = ngModelCtrl.$modelValue;
            };
          }
        }
      };
    }
  ]);

}).call(this);
