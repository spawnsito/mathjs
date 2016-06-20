'use strict';

function ValidatorComplexParser() {

}

ValidatorComplexParser._validateNumbersOfI = function (toValidate) {
    var matching = toValidate.match(/i\b/g);

    if (matching !== null && matching.length > 1) {
        throw 'Not valid';
    }
};


ValidatorComplexParser._validateLetters = function (toValidate) {
    var regExpLetters = new RegExp(/[a-d*|f-h*|j-z*]/g);

    if (regExpLetters.test(toValidate)) {
        throw 'Not valid';
    }
};


ValidatorComplexParser._isNotEmpty = function (toValidate) {
    if (toValidate === '') {
        throw 'Not valid';
    }
};

ValidatorComplexParser._validateSymbols = function (toValidate) {
    var regExpLetters = new RegExp(/^[+|-] i$/);

    if (regExpLetters.test(toValidate) || toValidate === '.') {
        throw 'Not valid';
    }

};

ValidatorComplexParser._validateAdditionExpression = function (toValidate) {
    var regExpLetters = new RegExp(/^\d[+|-]\d$/);

    if (regExpLetters.test(toValidate)) {
        throw 'Not valid';
    }
};

ValidatorComplexParser.validate = function(toValidate)
{
    try {
        ValidatorComplexParser._isNotEmpty(toValidate);
        ValidatorComplexParser._validateLetters(toValidate);
        ValidatorComplexParser._validateNumbersOfI(toValidate);
        ValidatorComplexParser._validateSymbols(toValidate);
        ValidatorComplexParser._validateAdditionExpression(toValidate);
    } catch(err) {
        return false;
    }

    return true;
};

ValidatorComplexParser.realPartDontHaveSymbolI = function (realPart) {
    if (realPart.indexOf('i') !== -1) {
        throw 'Not valid';
    }
};

ValidatorComplexParser.validatePow = function (number) {

    if (number.indexOf('e') === -1) {
        return;
    }
    var regExp = new RegExp(/(\+|-){0,1}\d*e(\+|-){0,1}\d+/);
    if (!regExp.test(number)) {
        throw 'Not valid';
    }

    var split = number.split('e');
    if (split[1].indexOf('.') !== -1) {
        throw 'Not valid';
    }
};

ValidatorComplexParser.validateRealPart = function(realPart) {
    try {
        ValidatorComplexParser.realPartDontHaveSymbolI(realPart);
        ValidatorComplexParser.validatePow(realPart);
    } catch (err) {
        return false;
    }

    return true;
};

ValidatorComplexParser.validateImaginaryPart = function(imaginaryPart) {
    try {
        ValidatorComplexParser._validateNumbersOfI(imaginaryPart);
        ValidatorComplexParser.validatePow(imaginaryPart);
    } catch(err) {
        return false;
    }

    return true;
};

ValidatorComplexParser._isValidNumber = function(number) {
    return isNaN(number);
};

module.exports = ValidatorComplexParser;