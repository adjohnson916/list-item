/*!
 * list-item <https://github.com/jonschlinkert/list-item>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var assert = require('assert');
require('should');
var romanize = require('romanize');
var listitem = require('./');
var li;

describe('listitem', function () {
  beforeEach(function () {
    li = listitem();
  })

  it('should not indent a list item when a level is not passed:', function () {
    li(0, 'a').should.equal('- a');
  });

  it('should use default indentation when not passed on options:', function () {
    li = listitem({indent: '    '});
    li(0, 'a').should.equal('- a');
    li(1, 'a').should.equal('    * a');
    li(2, 'a').should.equal('        + a');
    li(3, 'a').should.equal('            ~ a');
  });

  it('should use an `indent` string when passed on the options:', function () {
    li = listitem({indent: '      '});
    li(0, 'a').should.equal('- a');
    li(1, 'a').should.equal('      * a');
    li(2, 'a').should.equal('            + a');
    li(3, 'a').should.equal('                  ~ a');
  });

  it('should respect zero indentation if define with `indent`:', function () {
    li = listitem({indent: ''});
    li(0, 'a').should.equal('- a');
    li(1, 'a').should.equal('* a');
    li(2, 'a').should.equal('+ a');
    li(3, 'a').should.equal('~ a');
  });

  it('should rotate default bullets:', function () {
    li(0, 'a').should.equal('- a');
    li(1, 'a').should.equal('  * a');
    li(2, 'a').should.equal('    + a');
    li(3, 'a').should.equal('      ~ a');
    li(4, 'a').should.equal('        - a');
    li(5, 'a').should.equal('          * a');
    li(6, 'a').should.equal('            + a');
    li(7, 'a').should.equal('              ~ a');
    li(8, 'a').should.equal('                - a');
    li(7, 'a').should.not.equal(' ~ a');
  });
});

describe('custom characters', function () {
  beforeEach(function () {
    li = listitem();
  })

  it('should use no bullet when `nobullet` is passed:', function () {
    li = listitem({nobullet: true});

    li(0, 'a').should.equal('a');
    li(1, 'a').should.equal('  a');
    li(2, 'a').should.equal('    a');
    li(3, 'a').should.equal('      a');
    li(7, 'a').should.not.equal(' ~ a');
  });

  it('should use an array of custom characters:', function () {
    li = listitem({chars: ['A', 'B', 'C', 'D']});

    li(0, 'a').should.equal('A a');
    li(1, 'a').should.equal('  B a');
    li(2, 'a').should.equal('    C a');
    li(3, 'a').should.equal('      D a');
    li(7, 'a').should.not.equal(' ~ a');
  });

  it('should rotate custom characters:', function () {
    li = listitem({chars: ['A', 'B', 'C', 'D']});

    li(0, 'a').should.equal('A a');
    li(1, 'a').should.equal('  B a');
    li(2, 'a').should.equal('    C a');
    li(3, 'a').should.equal('      D a');
    li(4, 'a').should.equal('        A a');
    li(5, 'a').should.equal('          B a');
    li(6, 'a').should.equal('            C a');
    li(7, 'a').should.equal('              D a');
    li(8, 'a').should.equal('                A a');
    li(7, 'a').should.not.equal(' ~ a');
  });

  it('should expand a range of characters from a string:', function () {
    li = listitem({chars: '1..5'});

    li(0, 'a').should.equal('1 a');
    li(1, 'a').should.equal('  2 a');
    li(2, 'a').should.equal('    3 a');
    li(3, 'a').should.equal('      4 a');
    li(4, 'a').should.equal('        5 a');
    li(7, 'a').should.not.equal(' ~ a');
  });

  it('should allow a function to modify the default characters:', function () {
    li = listitem(function (ch) {
      return ch + ch + ch;
    });

    li(0, 'a').should.equal('--- a');
    li(1, 'a').should.equal('  *** a');
    li(2, 'a').should.equal('    +++ a');
    li(3, 'a').should.equal('      ~~~ a');
    li(7, 'a').should.not.equal(' ~ a');
  });

  it('should use a custom function when an array of chars is passed:', function () {
    li = listitem({chars: [1, 2, 3, 4, 5]}, function (ch) {
      return romanize(ch) + '.';
    });

    li(0, 'a').should.equal('I. a');
    li(1, 'a').should.equal('  II. a');
    li(2, 'a').should.equal('    III. a');
    li(3, 'a').should.equal('      IV. a');
    li(4, 'a').should.equal('        V. a');
    li(7, 'a').should.not.equal(' ~ a');
  });

  it('should use a custom function when characters are generated by expand-range:', function () {
    li = listitem({chars: '1..100..10'}, function (ch) {
      return romanize(ch) + '.';
    });

    li(0, 'a').should.equal('I. a');
    li(1, 'a').should.equal('  XI. a');
    li(2, 'a').should.equal('    XXI. a');
    li(3, 'a').should.equal('      XXXI. a');
    li(4, 'a').should.equal('        XLI. a');
    li(7, 'a').should.not.equal(' ~ a');
  });

  it('should throw an error:', function () {
    (function () {
      li();
    }).should.throw('[listitem]: invalid arguments.');
  });
});
