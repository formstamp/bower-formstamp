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
