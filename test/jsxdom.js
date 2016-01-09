'use strict';

let fs = require('fs');
let assert = require('chai').assert;
let jsxdom = require('../dist/jsxdom');

const compiled = [
  'var hello = function () {',
  "    var $$a = document.createElement('div');",
  '    return $$a;',
  '}();'
].join('\n')

describe('jsxdom', function() {
  beforeEach(function() {
    jsxdom.allocator.reset();
  });

  describe('transpile', function() {
    let source;

    beforeEach(function() {
      source = fs.readFileSync('./test/jsx/test.jsx');
    });

    it('returns a String', function() {
      assert.isString(
        jsxdom.transpile(source)
      );
    });

    it('returns a transpiled String', function() {
      assert.equal(
        jsxdom.transpile(source),
        compiled
      );
    });
  });

  describe('parse', function() {
    it('returns a Promise', function() {
      assert.instanceOf(jsxdom.parse('test.jsx'), Promise);
    });

    it('resolves the promise with a transpiled String', function(done) {
      jsxdom.parse('./test/jsx/test.jsx').then(function(javascript) {
        assert.equal(javascript, compiled);
        done();
      }, function() {
        done('Parsing failed. Are you missing a file?');
      }).catch(function(error) {
        done(error);
      });
    });

    describe('with options', function() {
      let options = {
        variablePrefix: '__',
        declarationType: 'var'
      };

      it('doesn\'t mutate the options passed in as an argument', function() {
        jsxdom.parse('./test/jsx/test.jsx', options);

        assert.deepEqual(options, {
          variablePrefix: '__',
          declarationType: 'var'
        });
      });

      it('outputs transpiled source with __ variable prefixes', function() {
        assert.match(
          jsxdom.parseSync('./test/jsx/test.jsx', options),
          /var __a/
        );
      });

      it('outputs transpiled source with `let` variable declarations', function() {
        options.declarationType = 'let';

        assert.match(
          jsxdom.parseSync('./test/jsx/test.jsx', options),
          /let __a/
        );
      });
    });
  });

  describe('parseSync', function() {
    it('returns a String', function() {
      assert.isString(jsxdom.parseSync('./test/jsx/test.jsx'));
    });

    it('returns a transpiled String', function() {
      assert.equal(
        jsxdom.parseSync('./test/jsx/test.jsx'),
        compiled
      );
    });
  });
});
