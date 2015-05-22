function NewComplexParser() {

}

NewComplexParser.parse = function(toParse) {
    var Complex  = require('./Complex');

    var parsing = NewComplexParser._removeWhitespaces(toParse);
    var signPosition = NewComplexParser._locateSign(parsing);
    var realPart = parsing.substring(0, signPosition);
    var imaginaryPart = parsing.substring(signPosition, parsing.length);
    var imaginaryNumber = imaginaryPart.slice(0, -1);

    if (imaginaryNumber.length == 1) {
        imaginaryNumber = imaginaryNumber + "1";
    };

    return new Complex(Number(realPart), Number(imaginaryNumber));
};

NewComplexParser._removeWhitespaces = function(toStrip) {
    return toStrip.replace(/ /g,'');
};

NewComplexParser._locateSign = function(toLocate) {
    var position = toLocate.indexOf('+');
    if(position < 0) {
        position = toLocate.indexOf('-');
    }

    if (position == 0) {
        var slicedString = toLocate.substring(1);
        position = NewComplexParser._locateSign(slicedString);
        return position + 1;
    };

    return position; 
}

module.exports = NewComplexParser;