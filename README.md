notmytype
===

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]

notmytype provides a type-asserting function that handles multiple arguments and uses the [type asserter](https://github.com/gcanti/flowcheck/blob/master/src/assert.js) from [flowcheck](https://github.com/gcanti/flowcheck).


Install
---

In your project, run:

```
npm install notmytype --save
```

or install from the GitHub repo:

```
npm install ludios/notmytype --save
```


Examples
---

notmytype requires io.js 2.0.0+ running with `--harmony-rest-parameters`.

```js
const T = require('notmytype');
```

All of these examples type-check without error:

```js
T(3, T.number);
T(3, T.number, "hello", T.string);
T(3, T.number, true, T.boolean);
T([true, false, true], T.list(T.boolean));
T([true, 3, true], T.list(T.union([T.boolean, T.number])));
T(undefined, T.optional(T.number));
T(3, T.optional(T.number));
T(null, T.maybe(T.number));
T(3, T.maybe(T.number));
T(new Buffer("hi"), Buffer);
T([3, "hi"], T.tuple([T.number, T.string]));
T({"hello": 3}, T.dict(T.string, T.number));
T(undefined, T.void);
T({"hello": 3}, T.shape({"hello": T.number}));
T({"hello": 3, "extra": "s"}, T.shape({"hello": T.number}));
```

`T()` raises `TypeError` if given an object of the wrong type:

```
> T([3, "s"], T.list(T.number))
TypeError: First object: Expected an instance of number; got "s", context: Array<number> / 1
```

See [assert.js](https://github.com/ludios/notmytype/blob/master/assert.js) and [test/assert.js](https://github.com/ludios/notmytype/blob/master/tests/assert.js) for details.


[npm-image]: https://img.shields.io/npm/v/notmytype.svg
[npm-url]: https://npmjs.org/package/notmytype
[travis-image]: https://img.shields.io/travis/ludios/notmytype.svg
[travis-url]: https://travis-ci.org/ludios/notmytype
