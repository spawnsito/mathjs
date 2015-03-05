// test ConstantNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    bigmath = require('../../../index').create({number: 'bignumber'}),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('ConstantNode', function() {

  it ('should create a ConstantNode with value type', function () {
    var a = new ConstantNode(math, '3', 'number');
    assert(a instanceof Node);
    assert.equal(a.type, 'ConstantNode');
  });

  it ('should create a ConstantNode without value type', function () {
    var a = new ConstantNode(math, 3);
    assert(a instanceof Node);
    assert.equal(a.type, 'ConstantNode');
    // TODO: extensively test each of the supported types

    assert.deepEqual(new ConstantNode(math, 3), new ConstantNode(math, '3', 'number'));
    assert.deepEqual(new ConstantNode(math, 'hello'), new ConstantNode(math, 'hello', 'string'));
    assert.deepEqual(new ConstantNode(math, true), new ConstantNode(math, 'true', 'boolean'));
    assert.deepEqual(new ConstantNode(math, false), new ConstantNode(math, 'false', 'boolean'));
    assert.deepEqual(new ConstantNode(math, null), new ConstantNode(math, 'null', 'null'));
    assert.deepEqual(new ConstantNode(math, undefined), new ConstantNode(math, 'undefined', 'undefined'));
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {ConstantNode(math, '3', 'number')}, SyntaxError);
  });

  it ('should throw an error in case of wrong construction arguments', function () {
    assert.throws(function () {new ConstantNode(math, 3, 'number');}, TypeError);
    assert.throws(function () {new ConstantNode(math, new Date());}, TypeError);
    assert.throws(function () {new ConstantNode(math, '3', Number);}, TypeError);
  });

  it ('should throw an error in case of unknown type of constant', function () {
    assert.throws(function () {new ConstantNode(math, '3', 'bla').compile();}, TypeError);
  });

  it ('should compile a ConstantNode', function () {
    var expr = new ConstantNode(math, '2.3', 'number').compile();
    assert.strictEqual(expr.eval(), 2.3);

    expr = new ConstantNode(math, '002.3', 'number').compile();
    assert.strictEqual(expr.eval(), 2.3);

    expr = new ConstantNode(math, 'hello', 'string').compile();
    assert.strictEqual(expr.eval(), 'hello');

    expr = new ConstantNode(math, 'true', 'boolean').compile();
    assert.strictEqual(expr.eval(), true);

    expr = new ConstantNode(math, 'undefined', 'undefined').compile();
    assert.strictEqual(expr.eval(), undefined);

    expr = new ConstantNode(math, 'null', 'null').compile();
    assert.strictEqual(expr.eval(), null);

  });

  it ('should compile a ConstantNode with bigmath', function () {
    var expr = new ConstantNode(bigmath, '2.3', 'number').compile();
    assert.deepEqual(expr.eval(), new bigmath.type.BigNumber(2.3));
  });

  it ('should find a ConstantNode', function () {
    var a = new ConstantNode(math, '2', 'number');
    assert.deepEqual(a.filter(function (node) {return node instanceof ConstantNode}),  [a]);
    assert.deepEqual(a.filter(function (node) {return node instanceof SymbolNode}), []);
  });

  it ('should run forEach on a ConstantNode', function () {
    var a = new ConstantNode(math, 2);
    a.forEach(function () {
      assert.ok(false, 'should not execute, constant has no childs')
    });
  });

  it ('should map a ConstantNode', function () {
    var a = new ConstantNode(math, 2);
    var b = a.map(function () {
      assert.ok(false, 'should not execute, constant has no childs')
    });

    assert.notStrictEqual(b, a);
    assert.deepEqual(b, a);
  });

  it ('should transform a ConstantNode', function () {
    var a = new ConstantNode(math, 2);
    var b = new ConstantNode(math, 3);
    var c = a.transform(function (node) {
      return node instanceof ConstantNode && node.value == '2' ? b : node;
    });
    assert.strictEqual(c,  b);

    // no match should leave the node as is
    var d = a.transform(function (node) {
      return node instanceof ConstantNode && node.value == '99' ? b : node;
    });
    assert.notStrictEqual(d,  a);
    assert.deepEqual(d,  a);
  });

  it ('should clone a ConstantNode', function () {
    var a = new ConstantNode(math, 2);
    var b = a.clone();

    assert(b instanceof ConstantNode);
    assert.deepEqual(a, b);
    assert.notStrictEqual(a, b);
    assert.equal(a.value, b.value);
    assert.equal(a.valueType, b.valueType);
  });

  it ('should stringify a ConstantNode', function () {
    assert.equal(new ConstantNode(math, '3', 'number').toString(), '3');
    assert.deepEqual(new ConstantNode(math, '3', 'number').toString(), '3');
    assert.equal(new ConstantNode(math, 'hi', 'string').toString(), '"hi"');
    assert.equal(new ConstantNode(math, 'true', 'boolean').toString(), 'true');
    assert.equal(new ConstantNode(math, 'false', 'boolean').toString(), 'false');
    assert.equal(new ConstantNode(math, 'undefined', 'undefined').toString(), 'undefined');
    assert.equal(new ConstantNode(math, 'null', 'null').toString(), 'null');
  });

  it ('should LaTeX a ConstantNode', function () {
    assert.equal(new ConstantNode(math, '3', 'number').toTex(), '3');
    assert.deepEqual(new ConstantNode(math, '3', 'number').toTex(), '3');
    assert.equal(new ConstantNode(math, 'hi', 'string').toTex(), '\\text{hi}');
    assert.equal(new ConstantNode(math, 'true', 'boolean').toTex(), 'true');
    assert.equal(new ConstantNode(math, 'false', 'boolean').toTex(), 'false');
    assert.equal(new ConstantNode(math, 'undefined', 'undefined').toTex(), 'undefined');
    assert.equal(new ConstantNode(math, 'null', 'null').toTex(), 'null');
  });

});
