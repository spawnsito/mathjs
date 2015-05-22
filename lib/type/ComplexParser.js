'use strict';

function ComplexParser() {

}

var text, index, c;

ComplexParser.parse = function (toParse) {
  var util = require('../util/index'),
      isString = util.string.isString,
      Complex = require('./Complex');

  if (!isString(toParse)) {
    return null;
  }
  
    
  text = toParse;
  index = -1;
  c = '';


  next();
  skipWhitespace();
  var first = parseNumber();
  if (first) {
    if (c == 'I' || c == 'i') {
      // pure imaginary number
      next();
      skipWhitespace();
      if (c) {
        // garbage at the end. not good.
        return null;
      }

      return new Complex(0, Number(first));
    }
    else {
      // complex and real part
      skipWhitespace();
      var separator = c;
      if (separator != '+' && separator != '-') {
        // pure real number
        skipWhitespace();
        if (c) {
          // garbage at the end. not good.
          return null;
        }

        return new Complex(Number(first), 0);
      }
      else {
        // complex and real part
        next();
        skipWhitespace();
        var second = parseNumber();
        if (second) {
          if (c != 'I' && c != 'i') {
            // 'i' missing at the end of the complex number
            return null;
          }
          next();
        }
        else {
          second = parseComplex();
          if (!second) {
            // imaginary number missing after separator
            return null;
          }
        }

        if (separator == '-') {
          if (second[0] == '-') {
            second =  '+' + second.substring(1);
          }
          else {
            second = '-' + second;
          }
        }

        next();
        skipWhitespace();
        if (c) {
          // garbage at the end. not good.
          return null;
        }

        return new Complex(Number(first), Number(second));
      }
    }
  }
  else {
    // check for 'i', '-i', '+i'
    first = parseComplex();
    if (first) {
      skipWhitespace();
      if (c) {
        // garbage at the end. not good.
        return null;
      }

      return new Complex(0, Number(first));
    }
  }

  return null;
};

function next() {
  index++;
  c = text.charAt(index);
}

function skipWhitespace() {
  while (c == ' ' || c == '\t') {
    next();
  }
}

function parseNumber () {
  var number = '';
  var oldIndex;
  oldIndex = index;

  if (c == '+') {
    next();
  }
  else if (c == '-') {
    number += c;
    next();
  }

  if (!isDigitDot(c)) {
    // a + or - must be followed by a digit
    revert(oldIndex);
    return null;
  }

  // get number, can have a single dot
  if (c == '.') {
    number += c;
    next();
    if (!isDigit(c)) {
      // this is no legal number, it is just a dot
      revert(oldIndex);
      return null;
    }
  }
  else {
    while (isDigit(c)) {
      number += c;
      next();
    }
    if (c == '.') {
      number += c;
      next();
    }
  }
  while (isDigit(c)) {
    number += c;
    next();
  }

  // check for exponential notation like "2.3e-4" or "1.23e50"
  if (c == 'E' || c == 'e') {
    number += c;
    next();

    if (c == '+' || c == '-') {
      number += c;
      next();
    }

    // Scientific notation MUST be followed by an exponent
    if (!isDigit(c)) {
      // this is no legal number, exponent is missing.
      revert(oldIndex);
      return null;
    }

    while (isDigit(c)) {
      number += c;
      next();
    }
  }

  return number;
}

function isDigitDot (c) {
  return ((c >= '0' && c <= '9') || c == '.');
}

function isDigit (c) {
  return ((c >= '0' && c <= '9'));
}

function revert(oldIndex) {
  index = oldIndex;
  c = text.charAt(index);
}

function parseComplex () {
  // check for 'i', '-i', '+i'
  var cnext = text.charAt(index + 1);
  if (c == 'I' || c == 'i') {
    next();
    return '1';
  }
  else if ((c == '+' || c == '-') && (cnext == 'I' || cnext == 'i')) {
    var number = (c == '+') ? '1' : '-1';
    next();
    next();
    return number;
  }

  return null;
}

module.exports = ComplexParser;
