'use strict'

var util = require('../util/index'),
    Unit = require('./Unit'),
    
    isNumber = util.number.isNumber,
    isUnit =  Unit.isUnit;

function ComplexBuilder() {

}

ComplexBuilder.construct = function(theArguments) {
    var result = {};

    switch (theArguments.length) {
      case 0:
        result = ComplexBuilder._contructZero();
        break;
      case 1:
        result = ComplexBuilder._constructFromObject(theArguments);
        break;
      case 2:
        result = ComplexBuilder._constructFromNumbers(theArguments[0], theArguments[1]);
        break;

      default:
        throw new SyntaxError('One, two or three arguments expected in Complex constructor');
    }

    return result;
};

ComplexBuilder._checkBothNumbers = function(aNumber, anotherNumber) {
  if (!isNumber(aNumber) || !isNumber(anotherNumber)) {
      throw new TypeError('Two numbers expected in Complex constructor');
    }
}

ComplexBuilder._contructZero = function() {

  return { re: 0, im: 0 };
};

ComplexBuilder._constructFromNumbers = function(real, imaginary) {
  ComplexBuilder._checkBothNumbers(real, imaginary);

  return {re: real, im: imaginary};
}

ComplexBuilder._constructFromObject = function(theArguments) {
    var arg = theArguments[0];
    ComplexBuilder._checkIsObject(arg);
    var construct;

    if(ComplexBuilder._hasBinomialParameters(arg)) {
      construct = {re: arg.re, im: arg.im}; // pass on input validation

    } else {
      construct = ComplexBuilder.fromPolar(arg.r, arg.phi);
    }

    return construct;
};

ComplexBuilder._constructFromBinomial = function(arg) {
  return { re: arg.re, im: arg.im } ;
};

ComplexBuilder._hasBinomialParameters = function(subject) {
  return ('re' in subject && 'im' in subject);
};

ComplexBuilder._hasPolarParameters = function(subject) {
  return ('r' in subject && 'phi' in subject);
}

ComplexBuilder._checkIsObject = function(subject) {
  var isRightType = (typeof subject === 'object');
  var hasBinomialParameters = ComplexBuilder._hasBinomialParameters(subject);
  var hasPolarParameters = ComplexBuilder._hasPolarParameters(subject);

  if((!isRightType || !(hasBinomialParameters || hasPolarParameters))) {
    throw new SyntaxError('Object with the re and im or r and phi properties expected.');
  }
}

ComplexBuilder.fromPolar = function (args) {
  switch (arguments.length) {
    case 1:
      var arg = arguments[0];
      if(typeof arg === 'object') {
        return ComplexBuilder.fromPolar(arg.r, arg.phi);
      }
      throw new TypeError('Input has to be an object with r and phi keys.');

    case 2:
      var r = arguments[0],
        phi = arguments[1];
      if(isNumber(r)) {
        if (isUnit(phi) && phi.hasBase(Unit.BASE_UNITS.ANGLE)) {
          // convert unit to a number in radians
          phi = phi.toNumber('rad');
        }

        if(isNumber(phi)) {
            return {re: r * Math.cos(phi), im: r * Math.sin(phi)};

        }

        throw new TypeError('Phi is not a number nor an angle unit.');
      } else {
        throw new TypeError('Radius r is not a number.');
      }

    default:
      throw new SyntaxError('Wrong number of arguments in function fromPolar');
  }
};


module.exports = ComplexBuilder;