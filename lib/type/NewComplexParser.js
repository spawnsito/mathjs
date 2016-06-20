"use strict";

const INDEX_NOT_FOUND = -1;

var complexValidator = require('./ValidatorComplexParser');

function NewComplexParser() {

}

NewComplexParser._resolverRealPart = function (realPart) {
    return NewComplexParser._resolvePow(realPart);
};


NewComplexParser._resolverImaginaryPart = function (imaginaryNumber) {
    imaginaryNumber = NewComplexParser._removeDoubleSign(imaginaryNumber);
    imaginaryNumber = NewComplexParser._resolvePow(imaginaryNumber);
    imaginaryNumber = NewComplexParser.transformComplexSymbolInNumber(imaginaryNumber);

    return imaginaryNumber;
};

NewComplexParser._isValidString = function (toValidate) {
    return complexValidator.validate(toValidate);
};

NewComplexParser.parse = function(toParse) {
    var Complex  = require('./Complex');

    if (!NewComplexParser._isValidString(toParse)) {
        return null;
    }

    var parsing = NewComplexParser._removeWhitespaces(toParse);
    parsing = NewComplexParser._toLowerCase(parsing);

    if (!NewComplexParser._isComplexNumber(parsing)) {
        return new Complex(Number(parsing), 0);
    }

    var complexNumber = NewComplexParser._separateParts(parsing);

    if (!complexValidator.validateRealPart(complexNumber.realPart) ||
        !complexValidator.validateImaginaryPart(complexNumber.imaginaryNumber)) {
        return null;
    }

    var realPart = NewComplexParser._resolverRealPart(complexNumber.realPart);
    var imaginaryNumber = NewComplexParser._resolverImaginaryPart(complexNumber.imaginaryNumber);


    if (NewComplexParser._isValidNumber(imaginaryNumber)) {
        return null;
    }

    return new Complex(Number(realPart), Number(imaginaryNumber));
};


NewComplexParser._separateParts = function(parsing) {

    var iPosition = NewComplexParser._locateI(parsing);
    if (iPosition === 0) {
        return {realPart: '0', imaginaryNumber: '1'};
    }

    var signPosition = NewComplexParser._locateSign(parsing);
    var realPart = parsing.substring(0, signPosition);
    var imaginaryPart = parsing.substring(signPosition, parsing.length);
    var imaginaryNumber = NewComplexParser._removeImaginarySymbol(imaginaryPart);

    return {realPart: realPart, imaginaryNumber: imaginaryNumber};
};

NewComplexParser._removeWhitespaces = function(toStrip) {
    return toStrip.replace(/ /g,'');
};

NewComplexParser._toLowerCase = function(toStrip) {
    return toStrip.toLowerCase();
};

NewComplexParser._removeImaginarySymbol = function(imaginaryPart) {
    return imaginaryPart.slice(0, -1);
};

NewComplexParser.transformComplexSymbolInNumber = function(imaginaryNumber) {

    var toNumber = Number(imaginaryNumber);
    if (imaginaryNumber.length == 1 && isNaN(toNumber)) {
        imaginaryNumber = imaginaryNumber + "1";
    }

    return imaginaryNumber;
};

NewComplexParser._isComplexNumber = function (complexNumber) {
    return complexNumber.indexOf('i') > -1;
};

NewComplexParser._locateI = function(complexNumber) {
    return complexNumber.indexOf('i');
};

NewComplexParser._locateSign = function(toLocate) {
    var plusPosition = toLocate.indexOf('+');
    var minusPosition = toLocate.indexOf('-');
    var position;

    if (plusPosition === INDEX_NOT_FOUND) {
        position = minusPosition;
    } else if (minusPosition !== INDEX_NOT_FOUND && minusPosition < plusPosition) {
        position = minusPosition
    } else {
        position = plusPosition;
    }

    var slicedString;
    if (position == 0) {
        slicedString = toLocate.substring(1);
        position = NewComplexParser._locateSign(slicedString);
        return position + 1;
    }

    if (toLocate.charAt(position - 1) === 'e') {
        position += 1;
        slicedString = toLocate.substring(position);
        var newPosition = NewComplexParser._locateSign(slicedString);

        return position + newPosition;
    }

    return position; 
};

NewComplexParser._removeDoubleSign = function(imaginaryNumber) {
    
    if (!NewComplexParser._haveDoubleSign(imaginaryNumber)) {
        return imaginaryNumber;
    }

    var result = imaginaryNumber.substring(2);
    if (imaginaryNumber.indexOf('-') !== -1 && imaginaryNumber.indexOf('+') === -1) {
        result = '+' + result;
    } else

    if (imaginaryNumber.indexOf('+') !== -1 && imaginaryNumber.indexOf('-') === -1) {
        result = '+' + result;
    } else

    if (imaginaryNumber.indexOf('+') !== -1 && imaginaryNumber.indexOf('-') !== -1) {
        result = '-' + result;
    }

    return result;
};

NewComplexParser._haveDoubleSign = function(number) {
    return (number.charAt(0) === '-' || number.charAt(0) === '+') && (number.charAt(1) === '-' || number.charAt(1) === '+'  );
};

NewComplexParser._isValidNumber = function(number) {
    return isNaN(number);
};

NewComplexParser._resolvePow = function(number) {

    var splitNumber = number.split('e');
    if (splitNumber.length === 1) {
        return number;
    }

    var resultNumber = Number(splitNumber[0]);
    var powerNumber = Number(splitNumber[1]);

    return (resultNumber * Math.pow(10, powerNumber)).toFixed(2);
};

module.exports = NewComplexParser;