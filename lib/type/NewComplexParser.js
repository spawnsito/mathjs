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
    var imaginaryNumber = NewComplexParser._removeImaginarySymbol(imaginaryPart);

    realPart = NewComplexParser._resolvePow(realPart);

    imaginaryNumber = NewComplexParser._removeDoubleSign(imaginaryNumber);
    imaginaryNumber = NewComplexParser._resolvePow(imaginaryNumber);



    if (imaginaryNumber.length == 1) {
        imaginaryNumber = imaginaryNumber + "1";
    }

    if (NewComplexParser._isValidNumber(imaginaryNumber)) {
        return null;
    }

    return new Complex(Number(realPart), Number(imaginaryNumber));
};

NewComplexParser._removeWhitespaces = function(toStrip) {
    return toStrip.replace(/ /g,'');
};

NewComplexParser._removeImaginarySymbol = function(imaginaryPart) {
    return imaginaryPart.slice(0, -1);
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
}

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
}

module.exports = NewComplexParser;