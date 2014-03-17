var addValidations, comp, filter, getComputedStyleFor, indexOf, innerHeightOf, nextUid, parseDate, scrollToTarget, toTimeStr, uid, updateDate, updateTime;

comp = function(a, b) {
  return ("" + a).toLowerCase().indexOf(b.toString().toLowerCase()) > -1;
};

filter = function(x, xs, valueAttr) {
  if (x) {
    return xs.filter(function(i) {
      var item;
      item = valueAttr ? i[valueAttr] : i;
      return comp(item, x);
    });
  } else {
    return xs;
  }
};

indexOf = function(array, elem) {
  var index, _i, _ref;
  for (index = _i = 0, _ref = array.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
    if (angular.equals(array[index], elem)) {
      return index;
    }
  }
  return -1;
};

getComputedStyleFor = function(elem, prop) {
  return parseInt(window.getComputedStyle(elem, null).getPropertyValue(prop));
};

innerHeightOf = function(elem) {
  return elem.clientHeight - getComputedStyleFor(elem, 'padding-top') - getComputedStyleFor(elem, 'padding-bottom');
};

scrollToTarget = function(container, target) {
  var item, viewport;
  if (!(container && target)) {
    return;
  }
  viewport = {
    top: container.scrollTop,
    bottom: container.scrollTop + innerHeightOf(container)
  };
  item = {
    top: target.offsetTop,
    bottom: target.offsetTop + target.offsetHeight
  };
  if (item.bottom > viewport.bottom) {
    return container.scrollTop += item.bottom - viewport.bottom;
  } else if (item.top < viewport.top) {
    return container.scrollTop -= viewport.top - item.top;
  }
};

addValidations = function(attrs, ctrl) {
  var match, maxLengthValidator, maxlength, minLengthValidator, minlength, pattern, patternValidator, validate, validateRegex;
  validate = function(ctrl, validatorName, validity, value) {
    ctrl.$setValidity(validatorName, validity);
    if (validity) {
      return value;
    } else {
      return void 0;
    }
  };
  if (attrs.ngMinlength) {
    minlength = parseInt(attrs.ngMinlength);
    minLengthValidator = function(value) {
      return validate(ctrl, 'minlength', ctrl.$isEmpty(value) || value.length >= minlength, value);
    };
    ctrl.$formatters.push(minLengthValidator);
    ctrl.$parsers.push(minLengthValidator);
  }
  if (attrs.ngMaxlength) {
    maxlength = parseInt(attrs.ngMaxlength);
    maxLengthValidator = function(value) {
      return validate(ctrl, 'maxlength', ctrl.$isEmpty(value) || value.length <= maxlength, value);
    };
    ctrl.$formatters.push(maxLengthValidator);
    ctrl.$parsers.push(maxLengthValidator);
  }
  if (attrs.ngPattern) {
    pattern = attrs.ngPattern;
    validateRegex = function(regexp, value) {
      return validate(ctrl, 'pattern', ctrl.$isEmpty(value) || regexp.test(value), value);
    };
    match = pattern.match(/^\/(.*)\/([gim]*)$/);
    if (match) {
      pattern = new RegExp(match[1], match[2]);
      patternValidator = function(value) {
        return validateRegex(pattern, value);
      };
    } else {
      patternValidator = function(value) {
        var patternObj;
        patternObj = scope.$eval(pattern);
        if (!patternObj || !patternObj.test) {
          throw minErr('ngPattern')('noregexp', 'Expected {0} to be a RegExp but was {1}. Element: {2}', pattern, patternObj, startingTag(element));
        }
        return validateRegex(patternObj, value);
      };
    }
    ctrl.$formatters.push(patternValidator);
    return ctrl.$parsers.push(patternValidator);
  }
};

updateTime = function(date, time) {
  if (date != null) {
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
  }
  return date;
};

updateDate = function(date, newDate) {
  switch (false) {
    case !(date == null):
      return newDate;
    case !(newDate == null):
      return date;
    default:
      date.setHours(newDate.getHours());
      date.setMinutes(newDate.getMinutes());
      date.setSeconds(newDate.getSeconds());
      return date;
  }
};

parseDate = function(dateString) {
  var parsedDate, time;
  time = Date.parse(dateString);
  if (!isNaN(time)) {
    parsedDate = new Date(time);
    return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  }
};

uid = ['0', '0', '0'];

nextUid = function() {
  var digit, index;
  index = uid.length;
  digit;
  while (index) {
    index -= 1;
    digit = uid[index].charCodeAt(0);
    if (digit === 57) {
      uid[index] = 'A';
      return uid.join('');
    }
    if (digit === 90) {
      uid[index] = '0';
    } else {
      uid[index] = String.fromCharCode(digit + 1);
      return uid.join('');
    }
  }
  uid.unshift('0');
  return uid.join('');
};

toTimeStr = function(time) {
  var h, m, _ref, _ref1;
  if (!((time != null) && (time.hours != null) && (time.minutes != null))) {
    return '';
  }
  h = (_ref = time.hours) != null ? _ref.toString() : void 0;
  if ((h != null ? h.length : void 0) < 2) {
    h = "0" + h;
  }
  m = (_ref1 = time.minutes) != null ? _ref1.toString() : void 0;
  if ((m != null ? m.length : void 0) < 2) {
    m = "0" + m;
  }
  return "" + h + ":" + m;
};

angular.module('formstamp', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/templates/calendar.html',
    "<div class=\"fs-calendar\" data-ng-switch=\"selectionMode\">\n" +
    "  <div data-ng-switch-when=\"year\">\n" +
    "    <div class=\"fs-calendar-header\">\n" +
    "      <span class=\"fs-calendar-prev\" data-ng-click=\"prevYearRange()\"></span>\n" +
    "      <span class=\"fs-calendar-title\" data-ng-click=\"switchSelectionMode()\">\n" +
    "        {{years[0]}}-{{years[years.length-1]}}\n" +
    "      </span>\n" +
    "      <span class=\"fs-calendar-next\" data-ng-click=\"nextYearRange()\"></span>\n" +
    "    </div>\n" +
    "    <table class=\"table-condensed\">\n" +
    "      <tr data-ng-repeat=\"yearGroup in yearGroups\">\n" +
    "        <td data-ng-repeat=\"year in yearGroup\"\n" +
    "            data-ng-click=\"selectYear(year)\"\n" +
    "            data-ng-class=\"{'active': year == selectedYear}\"\n" +
    "            class=\"year\">\n" +
    "          {{year}}\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </table>\n" +
    "  </div>\n" +
    "  <div data-ng-switch-when=\"month\">\n" +
    "    <div class=\"fs-calendar-header\">\n" +
    "      <span class=\"fs-calendar-prev\" data-ng-click=\"prevYear()\"></span>\n" +
    "      <span class=\"fs-calendar-title\" data-ng-click=\"switchSelectionMode()\">\n" +
    "        {{selectedYear}}\n" +
    "      </span>\n" +
    "      <span class=\"fs-calendar-next\" data-ng-click=\"nextYear()\"></span>\n" +
    "    </div>\n" +
    "    <table class=\"table-condensed\">\n" +
    "      <tr data-ng-repeat=\"monthGroup in monthGroups\">\n" +
    "        <td data-ng-repeat=\"month in monthGroup\"\n" +
    "            data-ng-click=\"selectMonth(month)\"\n" +
    "            data-ng-class=\"{'active': month == selectedMonth && isSameYear()}\"\n" +
    "            class=\"month\">\n" +
    "          {{month}}\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </table>\n" +
    "  </div>\n" +
    "  <div data-ng-switch-default>\n" +
    "    <div class=\"fs-calendar-header\">\n" +
    "      <span class=\"fs-calendar-prev\" data-ng-click=\"prevMonth()\"></span>\n" +
    "      <span class=\"fs-calendar-title\" data-ng-click=\"switchSelectionMode()\">\n" +
    "        {{selectedMonth + ', ' + selectedYear}}\n" +
    "      </span>\n" +
    "      <span class=\"fs-calendar-next\" data-ng-click=\"nextMonth()\"></span>\n" +
    "    </div>\n" +
    "    <table class=\"table-condensed\">\n" +
    "      <thead>\n" +
    "      <tr>\n" +
    "        <th data-ng-repeat=\"weekDay in weekDays\">\n" +
    "          {{weekDay}}\n" +
    "        </th>\n" +
    "      </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "      <tr data-ng-repeat=\"week in weeks\">\n" +
    "        <td data-ng-repeat=\"day in week\" class=\"day\"\n" +
    "            data-ng-class=\"{'day-in-selected-month': isDayInSelectedMonth(day),\n" +
    "                       'day-current': isCurrentDate(day),\n" +
    "                       'active bg-info': isSelectedDate(day)}\"\n" +
    "            data-ng-click=\"selectDay(day)\">\n" +
    "          {{day.getDate()}}\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/templates/date.html',
    "<div class=\"fs-date fs-widget-root\">\n" +
    "  <input\n" +
    "     fs-input\n" +
    "     fs-focus-when='active'\n" +
    "     fs-blur-when='!active'\n" +
    "     fs-on-focus='active = true'\n" +
    "     fs-on-blur='active = false'\n" +
    "     fs-hold-focus\n" +
    "     fs-esc='active = false'\n" +
    "     type=\"text\"\n" +
    "     ng-disabled=\"disabled\"\n" +
    "     class=\"form-control\"\n" +
    "     ng-model=\"selectedDate.date\"\n" +
    "     fs-date-format\n" +
    "     placeholder=\"{{placeholder}}\"\n" +
    "     fs-null-form />\n" +
    "  <span class=\"glyphicon glyphicon-calendar\" ng-click='active = !disabled'></span>\n" +
    "\n" +
    "  <div ng-if=\"!disabled && active\" class=\"open fs-calendar-wrapper\">\n" +
    "    <div class=\"dropdown-menu\">\n" +
    "      <fs-calendar ng-model=\"selectedDate.date\" on-select='close()'/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/templates/field.html',
    "<div class='form-group'\n" +
    "     ng-class='{\"has-error\": object.$errors[field].length > 0}'>\n" +
    "  <label for='{{objectName}}[{{field}}]' class='col-sm-2 control-label'>Name</label>\n" +
    "  <div class='col-sm-10'>\n" +
    "    <div w-combo\n" +
    "         class='w-field-input'\n" +
    "         items='items'\n" +
    "         invalid='object.$errors[field]'\n" +
    "         name='{{objectName}}[{{field}}]' \n" +
    "         ng-model='object[field]'></div>\n" +
    "    <div>\n" +
    "      <p ng-repeat='error in object.$errors[field]' class='text-danger'>{{error}}</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('/templates/list.html',
    "<div class=\"dropdown open fs-list\">\n" +
    "  <ul class=\"dropdown-menu\"\n" +
    "      role=\"menu\" >\n" +
    "    <li ng-repeat=\"item in items\"\n" +
    "        ng-class=\"{true: 'active'}[$index == highlightIndex]\">\n" +
    "      <a ng-click=\"highlightItem(item)\"\n" +
    "         href=\"javascript:void(0)\"\n" +
    "         tabindex='-1'>\n" +
    "         <span ng-transclude></span>\n" +
    "       </a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>\n"
  );

}]);

(function() {
  var shiftWeekDays;

  shiftWeekDays = function(weekDays, firstDayOfWeek) {
    var weekDaysHead;
    weekDaysHead = weekDays.slice(firstDayOfWeek, weekDays.length);
    return weekDaysHead.concat(weekDays.slice(0, firstDayOfWeek));
  };

  angular.module('formstamp').directive('fsCalendar', [
    '$locale', function($locale) {
      return {
        restrict: 'EA',
        templateUrl: '/templates/calendar.html',
        replace: true,
        require: '?ngModel',
        scope: {
          onSelect: '&'
        },
        controller: [
          '$scope', '$attrs', function($scope, $attrs) {
            var addDays, currentTime, i, updateSelectionRanges;
            $scope.selectionMode = 'day';
            $scope.months = $locale.DATETIME_FORMATS.SHORTMONTH;
            currentTime = new Date();
            $scope.currentDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
            $scope.selectedYear = $scope.currentDate.getFullYear();
            $scope.selectedMonth = $scope.months[$scope.currentDate.getMonth()];
            $scope.monthGroups = (function() {
              var _i, _results;
              _results = [];
              for (i = _i = 0; _i <= 2; i = ++_i) {
                _results.push($scope.months.slice(i * 4, i * 4 + 4));
              }
              return _results;
            })();
            $scope.prevMonth = function() {
              var month;
              month = indexOf($scope.months, $scope.selectedMonth) - 1;
              if (month < 0) {
                month = $scope.months.length - 1;
                $scope.selectedYear--;
              }
              return $scope.selectedMonth = $scope.months[month];
            };
            $scope.nextMonth = function() {
              var month;
              month = indexOf($scope.months, $scope.selectedMonth) + 1;
              if (month >= $scope.months.length) {
                month = 0;
                $scope.selectedYear++;
              }
              return $scope.selectedMonth = $scope.months[month];
            };
            $scope.prevYear = function() {
              return $scope.selectedYear--;
            };
            $scope.nextYear = function() {
              return $scope.selectedYear++;
            };
            $scope.prevYearRange = function() {
              var rangeSize, _i, _ref, _ref1, _results;
              rangeSize = $scope.years.length;
              return $scope.years = (function() {
                _results = [];
                for (var _i = _ref = $scope.years[0] - rangeSize, _ref1 = $scope.years[$scope.years.length - 1] - rangeSize; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
                return _results;
              }).apply(this);
            };
            $scope.nextYearRange = function() {
              var rangeSize, _i, _ref, _ref1, _results;
              rangeSize = $scope.years.length;
              return $scope.years = (function() {
                _results = [];
                for (var _i = _ref = $scope.years[0] + rangeSize, _ref1 = $scope.years[$scope.years.length - 1] + rangeSize; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
                return _results;
              }).apply(this);
            };
            $scope.switchSelectionMode = function() {
              return $scope.selectionMode = (function() {
                switch ($scope.selectionMode) {
                  case 'day':
                    return 'month';
                  case 'month':
                    return 'year';
                  default:
                    return 'day';
                }
              })();
            };
            $scope.isDayInSelectedMonth = function(day) {
              return day.getFullYear() === $scope.selectedYear && $scope.months[day.getMonth()] === $scope.selectedMonth;
            };
            $scope.isCurrentDate = function(day) {
              var _ref;
              return day.getTime() === ((_ref = $scope.currentDate) != null ? _ref.getTime() : void 0);
            };
            $scope.isSelectedDate = function(day) {
              var _ref;
              return day.getTime() === ((_ref = $scope.selectedDate) != null ? _ref.getTime() : void 0);
            };
            addDays = function(date, days) {
              return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
            };
            updateSelectionRanges = function() {
              var day, dayOffset, firstDayOfMonth, firstDayOfWeek, monthIndex, week, _i, _ref, _ref1, _results;
              monthIndex = indexOf($scope.months, $scope.selectedMonth);
              firstDayOfMonth = new Date($scope.selectedYear, monthIndex);
              dayOffset = $scope.firstDayOfWeek - firstDayOfMonth.getDay();
              if (dayOffset > 0) {
                dayOffset -= 7;
              }
              firstDayOfWeek = addDays(firstDayOfMonth, dayOffset);
              $scope.weeks = (function() {
                var _i, _results;
                _results = [];
                for (week = _i = 0; _i <= 5; week = ++_i) {
                  _results.push((function() {
                    var _j, _results1;
                    _results1 = [];
                    for (day = _j = 0; _j <= 6; day = ++_j) {
                      _results1.push(addDays(firstDayOfWeek, 7 * week + day));
                    }
                    return _results1;
                  })());
                }
                return _results;
              })();
              return $scope.years = (function() {
                _results = [];
                for (var _i = _ref = $scope.selectedYear - 5, _ref1 = $scope.selectedYear + 6; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
                return _results;
              }).apply(this);
            };
            $scope.$watch('selectedDate', function() {
              if ($scope.selectedDate != null) {
                $scope.selectedYear = $scope.selectedDate.getFullYear();
                return $scope.selectedMonth = $scope.months[$scope.selectedDate.getMonth()];
              }
            });
            $scope.$watch('selectedMonth', updateSelectionRanges);
            $scope.$watch('selectedYear', updateSelectionRanges);
            $scope.$watch('years', function() {
              return $scope.yearGroups = (function() {
                var _i, _results;
                _results = [];
                for (i = _i = 0; _i <= 3; i = ++_i) {
                  _results.push($scope.years.slice(i * 4, i * 4 + 4));
                }
                return _results;
              })();
            });
            $scope.firstDayOfWeek = parseInt($attrs.firstDayOfWeek || 0);
            return $scope.weekDays = shiftWeekDays($locale.DATETIME_FORMATS.SHORTDAY, $scope.firstDayOfWeek);
          }
        ],
        link: function(scope, element, attrs, ngModel) {
          scope.isSameYear = function() {
            var _ref;
            return ((_ref = parseDate(ngModel.$modelValue)) != null ? _ref.getFullYear() : void 0) === scope.selectedYear;
          };
          scope.selectDay = function(day) {
            scope.selectedDate = day;
            ngModel.$setViewValue(day);
            return scope.onSelect();
          };
          ngModel.$render = function() {
            return scope.selectedDate = parseDate(ngModel.$modelValue);
          };
          scope.selectMonth = function(monthName) {
            scope.selectionMode = 'day';
            scope.selectedDate = void 0;
            return scope.selectedMonth = monthName;
          };
          return scope.selectYear = function(year) {
            scope.selectionMode = 'month';
            scope.selectedDate = void 0;
            return scope.selectedYear = year;
          };
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module("formstamp").directive("fsCheckbox", [
    '$window', function($window) {
      return {
        restrict: "A",
        scope: {
          disabled: '=ngDisabled',
          required: '=',
          errors: '=',
          items: '=',
          inline: '='
        },
        require: '?ngModel',
        replace: true,
        template: function(el, attrs) {
          var itemTpl, template;
          itemTpl = el.html() || 'template me: {{item | json}}';
          return template = "<div class='fs-racheck fs-checkbox' ng-class=\"{disabled: disabled, enabled: !disabled}\">\n  <div ng-repeat='item in items'>\n    <a class=\"fs-racheck-item\"\n       href='javascript:void(0)'\n       ng-disabled=\"disabled\"\n       ng-click=\"toggle(item)\"\n       fs-space='toggle(item)'>\n      <span class=\"fs-check-outer\"><span ng-show=\"isSelected(item)\" class=\"fs-check-inner\"></span></span>\n      " + itemTpl + "\n    </a>\n  </div>\n</div>";
        },
        controller: function($scope, $element, $attrs) {
          $scope.toggle = function(item) {
            if ($scope.disabled) {
              return;
            }
            if (!$scope.isSelected(item)) {
              $scope.selectedItems.push(item);
            } else {
              $scope.selectedItems.splice(indexOf($scope.selectedItems, item), 1);
            }
            return false;
          };
          $scope.isSelected = function(item) {
            return indexOf($scope.selectedItems, item) > -1;
          };
          $scope.invalid = function() {
            return ($scope.errors != null) && $scope.errors.length > 0;
          };
          return $scope.selectedItems = [];
        },
        link: function(scope, element, attrs, ngModelCtrl, transcludeFn) {
          var setViewValue;
          if (ngModelCtrl) {
            setViewValue = function(newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                return ngModelCtrl.$setViewValue(scope.selectedItems);
              }
            };
            scope.$watch('selectedItems', setViewValue, true);
            return ngModelCtrl.$render = function() {
              if (!scope.disabled) {
                return scope.selectedItems = ngModelCtrl.$viewValue || [];
              }
            };
          }
        }
      };
    }
  ]);

}).call(this);

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

(function() {
  angular.module('formstamp').directive('fsField', [
    function() {
      var VALIDATION_DIRECTIVES;
      VALIDATION_DIRECTIVES = ['ngRequired', 'ngMinlength', 'ngMaxlength', 'ngPattern', 'ngDisabled'];
      return {
        restrict: 'A',
        replace: true,
        require: ['^fsFormFor', '^form'],
        scope: {
          items: '=',
          field: '@fsField',
          type: '@',
          label: '@'
        },
        templateUrl: '/templates/field.html',
        compile: function(tElement, tAttrs) {
          var inputDiv, inputDivRaw, type;
          type = tAttrs.type;
          inputDivRaw = tElement[0].querySelector('.fs-field-input');
          inputDiv = angular.element(inputDivRaw);
          angular.element(inputDiv).attr(type, '');
          angular.forEach(VALIDATION_DIRECTIVES, function(dir) {
            if (tAttrs[dir]) {
              return inputDiv.attr(tAttrs.$attr[dir], tAttrs[dir]);
            }
          });
          inputDiv.attr('name', tAttrs.fsField);
          return function(scope, element, attrs, ctrls) {
            var formCtrl, formForCtrl;
            formForCtrl = ctrls[0];
            formCtrl = ctrls[1];
            scope.object = formForCtrl.getObject();
            scope.objectName = formForCtrl.getObjectName();
            formCtrl = element.parent().controller('form');
            scope.defaultErrors = {
              'required': 'This field is required!',
              'pattern': 'This field should match pattern!',
              'minlength': 'This field should be longer!',
              'maxlength': 'This field should be shorter!'
            };
            scope.hasErrorFor = function(validityName) {
              return formCtrl[scope.field].$error[validityName];
            };
            return scope.$watch(function() {
              var errs;
              if (!formCtrl.$dirty) {
                return;
              }
              scope.validationErrors = [];
              angular.forEach(scope.defaultErrors, function(value, key) {
                if (scope.hasErrorFor(key)) {
                  return scope.validationErrors.push(value);
                }
              });
              if (scope.object.$error && (errs = scope.object.$error[scope.field])) {
                scope.validationErrors = scope.validationErrors.concat(errs);
              }
              console.log(scope.validationErrors);
            });
          };
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('formstamp').directive('fsErrors', function() {
    return {
      restrict: 'A',
      scope: {
        model: '='
      },
      replace: true,
      template: "<ul class='text-danger fs-errors' ng-show='model.$dirty && messages && messages.length > 0'>\n  <li ng-repeat='msg in messages'>{{ msg }}</li>\n</ul>",
      controller: function($scope) {
        var errorsWatcher, makeMessage;
        makeMessage = function(idn) {
          return "Error happened: " + idn;
        };
        errorsWatcher = function(newErrors) {
          var errorIdn, occured;
          return $scope.messages = (function() {
            var _results;
            _results = [];
            for (errorIdn in newErrors) {
              occured = newErrors[errorIdn];
              if (occured) {
                _results.push(makeMessage(errorIdn));
              }
            }
            return _results;
          })();
        };
        return $scope.$watch('model.$error', errorsWatcher, true);
      }
    };
  });

  angular.module('formstamp').directive('fsFormFor', function() {
    return {
      restrict: 'AE',
      template: function(el, attrs) {
        var html, inputReplacer, modelName, rowReplacer;
        modelName = el.attr("model");
        inputReplacer = function() {
          var attr, attributes, input, inputEl, label, name, type, _i, _len, _ref, _ref1;
          input = $(this);
          name = input.attr("name");
          type = input.attr("as");
          label = (_ref = input.attr("label")) != null ? _ref : name;
          attributes = {};
          _ref1 = input.prop("attributes");
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            attr = _ref1[_i];
            attributes[attr.name] = attr.value;
          }
          attributes['ng-model'] = "" + modelName + "." + name;
          attributes['name'] = name;
          delete attributes['as'];
          if (type.indexOf("fs-") === 0) {
            attributes[type] = true;
            inputEl = $("<div />", attributes);
            inputEl.html(input.html());
          } else {
            attributes['type'] = type;
            attributes['class'] = 'form-control';
            inputEl = $("<input />", attributes);
          }
          return "<div class=\"form-group\" ng-class=\"{'has-error': (form." + name + ".$dirty && form." + name + ".$invalid)}\">\n  <label class=\"col-sm-2 control-label\">" + label + "</label>\n  <div class=\"col-sm-10\">\n    " + (inputEl.get(0).outerHTML) + "\n    <div fs-errors model=\"form." + name + "\"></div>\n  </div>\n</div>";
        };
        rowReplacer = function() {
          var label, row;
          row = $(this);
          label = row.attr("label");
          return "<div class=\"form-group\">\n  <label class=\"col-sm-2 control-label\">" + label + "</label>\n  <div class=\"col-sm-10\">\n    " + (row.get(0).outerHTML) + "\n  </div>\n</div>";
        };
        html = el.find("fs-input").replaceWith(inputReplacer).end().find("fs-row").replaceWith(rowReplacer).end().html();
        return "<form name='form' class='form-horizontal' novalidate>\n  " + html + "\n</form>";
      }
    };
  });

}).call(this);

(function() {
  angular.module("formstamp").directive("fsInput", [
    '$parse', function($parse) {
      return {
        restrict: "A",
        link: function(scope, element, attrs) {
          var blurElement, focusElement, fsRoot, keyCodes;
          focusElement = function() {
            return setTimeout((function() {
              return element[0].focus();
            }), 0);
          };
          blurElement = function() {
            return setTimeout((function() {
              return element[0].blur();
            }), 0);
          };
          keyCodes = {
            Tab: 9,
            ShiftTab: 9,
            Enter: 13,
            Esc: 27,
            PgUp: 33,
            PgDown: 34,
            Left: 37,
            Up: 38,
            Right: 39,
            Down: 40,
            Space: 32
          };
          if (attrs["fsFocusWhen"] != null) {
            scope.$watch(attrs["fsFocusWhen"], function(newValue) {
              if (newValue) {
                return focusElement();
              }
            });
          }
          if (attrs["fsBlurWhen"] != null) {
            scope.$watch(attrs["fsBlurWhen"], function(newValue) {
              if (newValue) {
                return blurElement();
              }
            });
          }
          if (attrs["fsOnFocus"] != null) {
            element.on('focus', function(event) {
              return scope.$apply(attrs["fsOnFocus"]);
            });
          }
          if (attrs["fsOnBlur"] != null) {
            element.on('blur', function(event) {
              return scope.$apply(attrs["fsOnBlur"]);
            });
          }
          if (attrs["fsHoldFocus"] != null) {
            fsRoot = $(element).parents(".fs-widget-root").first();
            fsRoot.on("mousedown", function(event) {
              if (event.target !== element.get(0)) {
                event.preventDefault();
                return false;
              } else {
                return true;
              }
            });
          }
          return angular.forEach(keyCodes, function(keyCode, keyName) {
            var attrName, callbackExpr, shift;
            attrName = 'fs' + keyName;
            if (attrs[attrName] != null) {
              shift = keyName.indexOf('Shift') !== -1;
              callbackExpr = $parse(attrs[attrName]);
              return element.on('keydown', function(event) {
                if (event.keyCode === keyCode && event.shiftKey === shift) {
                  if (!scope.$apply(function() {
                    return callbackExpr(scope, {
                      $event: event
                    });
                  })) {
                    return event.preventDefault();
                  }
                }
              });
            }
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module("formstamp").directive("fsList", function() {
    return {
      restrict: "A",
      scope: {
        items: '=',
        "class": '@',
        listInterface: '='
      },
      transclude: true,
      replace: true,
      templateUrl: "/templates/list.html",
      link: function($scope, $element, $attrs) {
        var ensureHighlightedItemVisible;
        ensureHighlightedItemVisible = function() {
          var delayedScrollFn;
          delayedScrollFn = function() {
            var li, ul;
            ul = $element.find('ul')[0];
            li = ul.querySelector('li.active');
            return scrollToTarget(ul, li);
          };
          return setTimeout(delayedScrollFn, 0);
        };
        return $scope.$watch('highlightIndex', function(idx) {
          return ensureHighlightedItemVisible();
        });
      },
      controller: function($scope, $element, $attrs, $filter) {
        var updateSelectedItem;
        updateSelectedItem = function(hlIdx) {
          if ($scope.$parent.listInterface != null) {
            return $scope.$parent.listInterface.selectedItem = $scope.items[hlIdx];
          }
        };
        $scope.highlightItem = function(item) {
          $scope.highlightIndex = $scope.items.indexOf(item);
          return $scope.$parent.listInterface.onSelect(item);
        };
        $scope.$watch('items', function(newItems) {
          $scope.highlightIndex = 0;
          return updateSelectedItem(0);
        });
        $scope.$watch('highlightIndex', function(idx) {
          return updateSelectedItem(idx);
        });
        $scope.move = function(d) {
          var items;
          items = $scope.items;
          $scope.highlightIndex += d;
          if ($scope.highlightIndex === -1) {
            $scope.highlightIndex = items.length - 1;
          }
          if ($scope.highlightIndex >= items.length) {
            return $scope.highlightIndex = 0;
          }
        };
        $scope.highlightIndex = 0;
        if ($scope.$parent.listInterface != null) {
          return $scope.$parent.listInterface.move = function(delta) {
            return $scope.move(delta);
          };
        }
      }
    };
  });

}).call(this);

(function() {
  angular.module('formstamp').filter('exclude', function() {
    return function(input, selected) {
      if (selected == null) {
        return input;
      }
      if (input == null) {
        return [];
      }
      return input.filter(function(item) {
        return selected.indexOf(item) < 0;
      });
    };
  });

  angular.module("formstamp").directive("fsMultiselect", [
    '$window', function($window) {
      return {
        restrict: "A",
        scope: {
          items: '=',
          disabled: '=ngDisabled',
          freetext: '@',
          "class": '@'
        },
        require: '?ngModel',
        replace: true,
        template: function(el, attributes) {
          var defaultItemTpl, itemTpl;
          defaultItemTpl = "{{ item }}";
          itemTpl = el.html() || defaultItemTpl;
          return "<div class='fs-multiselect fs-widget-root' ng-class='{ \"fs-with-selected-items\": selectedItems.length > 0 }'>\n  <div class='fs-multiselect-wrapper'>\n    <div class=\"fs-multiselect-selected-items\" ng-if=\"selectedItems.length > 0\">\n      <a ng-repeat='item in selectedItems' class=\"btn\" ng-click=\"unselectItem(item)\" ng-disabled=\"disabled\">\n        " + itemTpl + "\n        <span class=\"glyphicon glyphicon-remove\" ></span>\n      </a>\n    </div>\n\n    <input ng-keydown=\"onkeys($event)\"\n           fs-null-form\n           ng-disabled=\"disabled\"\n           fs-input\n           fs-hold-focus\n           fs-on-focus=\"active = true\"\n           fs-on-blur=\"onBlur()\"\n           fs-blur-when=\"!active\"\n           fs-down='listInterface.move(1)'\n           fs-up='listInterface.move(-1)'\n           fs-pgup='listInterface.move(-11)'\n           fs-pgdown='listInterface.move(11)'\n           fs-enter='onEnter()'\n           fs-esc='active = false'\n           class=\"form-control\"\n           type=\"text\"\n           placeholder='Select something'\n           ng-model=\"search\" />\n\n    <div ng-if=\"active && dropdownItems.length > 0\" class=\"open\">\n      <div fs-list items=\"dropdownItems\">\n        " + itemTpl + "\n      </div>\n    </div>\n  </div>\n</div>";
        },
        controller: function($scope, $element, $attrs, $filter) {
          if ($attrs.freetext != null) {
            $scope.dynamicItems = function() {
              if ($scope.search) {
                return [$scope.search];
              } else {
                return [];
              }
            };
          } else {
            $scope.dynamicItems = function() {
              return [];
            };
          }
          $scope.updateDropdownItems = function() {
            var allItems, excludeFilter, searchFilter;
            searchFilter = $filter('filter');
            excludeFilter = $filter('exclude');
            allItems = $scope.items.concat($scope.dynamicItems());
            return $scope.dropdownItems = searchFilter(excludeFilter(allItems, $scope.selectedItems), $scope.search);
          };
          $scope.selectItem = function(item) {
            if ((item != null) && indexOf($scope.selectedItems, item) === -1) {
              $scope.selectedItems = $scope.selectedItems.concat([item]);
            }
            return $scope.search = '';
          };
          $scope.unselectItem = function(item) {
            var index;
            index = indexOf($scope.selectedItems, item);
            if (index > -1) {
              return $scope.selectedItems.splice(index, 1);
            }
          };
          $scope.onBlur = function() {
            $scope.active = false;
            return $scope.search = '';
          };
          $scope.onEnter = function() {
            return $scope.selectItem($scope.dropdownItems.length > 0 ? $scope.listInterface.selectedItem : null);
          };
          $scope.listInterface = {
            onSelect: function(selectedItem) {
              return $scope.selectItem(selectedItem);
            },
            move: function() {
              return console.log("not-implemented listInterface.move() function");
            }
          };
          $scope.dropdownItems = [];
          $scope.active = false;
          $scope.$watchCollection('selectedItems', function() {
            return $scope.updateDropdownItems();
          });
          $scope.$watchCollection('items', function() {
            return $scope.updateDropdownItems();
          });
          $scope.$watch('search', function() {
            return $scope.updateDropdownItems();
          });
          return $scope.updateDropdownItems();
        },
        link: function($scope, element, attrs, ngModelCtrl, transcludeFn) {
          var setViewValue;
          if (ngModelCtrl) {
            setViewValue = function(newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                return ngModelCtrl.$setViewValue(newValue);
              }
            };
            $scope.$watch('selectedItems', setViewValue, true);
            return ngModelCtrl.$render = function() {
              return $scope.selectedItems = ngModelCtrl.$modelValue || [];
            };
          }
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module("formstamp").directive("fsNullForm", function() {
    return {
      restrict: "A",
      controller: function($element) {
        var noop, nullFormCtrl;
        noop = function() {};
        nullFormCtrl = {
          $addControl: noop,
          $removeControl: noop,
          $setValidity: noop,
          $setDirty: noop,
          $setPristine: noop
        };
        return $element.data('$formController', nullFormCtrl);
      }
    };
  });

}).call(this);

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

(function() {
  angular.module("formstamp").directive("fsSelect", [
    '$compile', function($compile) {
      return {
        restrict: "A",
        scope: {
          items: '=',
          disabled: '=ngDisabled',
          freetext: '@',
          "class": '@'
        },
        require: '?ngModel',
        replace: true,
        template: function(el) {
          var itemTpl, template;
          itemTpl = el.html();
          return template = "<div class='fs-select fs-widget-root'>\n  <div ng-hide=\"active\" class=\"fs-select-sel\" ng-class=\"{'btn-group': item}\">\n      <a class=\"btn btn-default fs-select-active\"\n         ng-class='{\"btn-danger\": invalid}'\n         href=\"javascript:void(0)\"\n         ng-click=\"active = true\"\n         ng-disabled=\"disabled\">\n           <span ng-show='item'>" + itemTpl + "</span>\n           <span ng-hide='item'>none</span>\n      </a>\n      <button type=\"button\"\n              class=\"btn btn-default fs-select-clear-btn\"\n              aria-hidden=\"true\"\n              ng-show='item'\n              ng-disabled=\"disabled\"\n              ng-click='unselectItem()'>&times;</button>\n    </div>\n  <div class=\"open\" ng-show=\"active\">\n    <input class=\"form-control\"\n           fs-input\n           fs-focus-when='active'\n           fs-blur-when='!active'\n           fs-on-focus='active = true'\n           fs-on-blur='onBlur()'\n           fs-hold-focus\n           fs-down='move(1)'\n           fs-up='move(-1)'\n           fs-pg-up='move(-11)'\n           fs-pg-down='move(11)'\n           fs-enter='onEnter($event)'\n           fs-esc='active = false'\n           type=\"text\"\n           placeholder='Search'\n           ng-model=\"search\"\n           fs-null-form />\n\n    <div ng-if=\"active && dropdownItems.length > 0\">\n      <div fs-list items=\"dropdownItems\">\n       " + itemTpl + "\n      </div>\n    </div>\n  </div>\n</div>";
        },
        controller: function($scope, $element, $attrs, $filter, $timeout) {
          var updateDropdown;
          $scope.active = false;
          if ($attrs.freetext != null) {
            $scope.dynamicItems = function() {
              if ($scope.search) {
                return [$scope.search];
              } else {
                return [];
              }
            };
          } else {
            $scope.dynamicItems = function() {
              return [];
            };
          }
          updateDropdown = function() {
            return $scope.dropdownItems = $filter('filter')($scope.items, $scope.search).concat($scope.dynamicItems());
          };
          $scope.$watch('active', function(q) {
            return updateDropdown();
          });
          $scope.$watch('search', function(q) {
            return updateDropdown();
          });
          $scope.selectItem = function(item) {
            $scope.item = item;
            $scope.search = "";
            return $scope.active = false;
          };
          $scope.unselectItem = function(item) {
            return $scope.item = null;
          };
          $scope.onBlur = function() {
            return $timeout(function() {
              $scope.active = false;
              return $scope.search = '';
            }, 0, true);
          };
          $scope.move = function(d) {
            return $scope.listInterface.move && $scope.listInterface.move(d);
          };
          $scope.onEnter = function(event) {
            if ($scope.dropdownItems.length > 0) {
              return $scope.selectItem($scope.listInterface.selectedItem);
            } else {
              return $scope.selectItem(null);
            }
          };
          return $scope.listInterface = {
            onSelect: function(selectedItem) {
              return $scope.selectItem(selectedItem);
            },
            move: function() {
              return console.log("not-implemented listInterface.move() function");
            }
          };
        },
        link: function(scope, element, attrs, ngModelCtrl, transcludeFn) {
          if (ngModelCtrl) {
            scope.$watch('item', function(newValue, oldValue) {
              if (newValue !== oldValue) {
                return ngModelCtrl.$setViewValue(scope.item);
              }
            });
            return ngModelCtrl.$render = function() {
              return scope.item = ngModelCtrl.$viewValue;
            };
          }
        }
      };
    }
  ]);

}).call(this);

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
