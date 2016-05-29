"use strict";

const INDEX_NOT_FOUND = -1;

function NewComplexParser() {

}

NewComplexParser.parse = function(toParse) {
    var Complex  = require('./Complex');

    var parsing = NewComplexParser._removeWhitespaces(toParse);
    var signPosition = NewComplexParser._locateSign(parsing);
    var realPart = parsing.substring(0, signPosition);
    var imaginaryPart = parsing.substring(signPosition, parsing.length);
    var imaginaryNumber = imaginaryPart.slice(0, -1);

    imaginaryNumber = NewComplexParser._removeDoubleSign(imaginaryNumber);
    
    if (imaginaryNumber.length == 1) {
        imaginaryNumber = imaginaryNumber + "1";
    };

    if (NewComplexParser._isValidNumber(imaginaryNumber)) {
        return null;
    }

    return new Complex(Number(realPart), Number(imaginaryNumber));
};

NewComplexParser._removeWhitespaces = function(toStrip) {
    return toStrip.replace(/ /g,'');
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
    
    if (position == 0) {
        var slicedString = toLocate.substring(1);
        position = NewComplexParser._locateSign(slicedString);
        return position + 1;
    };

    return position; 
}

NewComplexParser._removeDoubleSign = function(imaginaryNumber) {
    
    var otherSignPosition = NewComplexParser._locateSign(imaginaryNumber.substring(1));

    if (otherSignPosition === -1) {
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

NewComplexParser._isValidNumber = function(number) {
    return isNaN(number);
}

module.exports = NewComplexParser;