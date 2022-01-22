# Randomator

Randomator is a library for composing generators of random values.  It provides one core type, the `Randomator` (a random generator), and operators for composing `Randomator`s.

## Install

```
npm i randomator
```

## Intro

A `Randomator` is a, typically random, value generator.  A `Randomator` can be constructed using the `new Randomator` constructor but more often they are constructed using the built-in operators described below.  Every `Randomator` has a `next()` method that returns a single value.

> A `Randomator` is a random generator that describes how to produce random values.

In the most basic example the function `numbers` returns a `Randomator`. In this case `next` returns a random number between 0 and 1 (same as `Math.random`).

> Note: in this readme I'll use [Finnish Notation](https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b) to signify a `Randomator`.  This is simply for clarity.

```js
const myNumber$ = numbers();
myNumber$.next();  // Returns an random number (same as Math.random())
```

A more involved example is the `string` function which take several options and returns a `Randomator` of strings:

```js
const myString$ = strings({ chars: chars('abc'), length: integers({ min: 3, max: 13 }) });
myString$.next();  // returns a string between three (3) and 13 characters (inclusive) of 'a', 'b' or 'c'.
```

Randomators also include a `map` for creating derived `Randomator`s:

```js
const ucaseString$ = string().map(s => s.toUpperCase());
ucaseString$.next();  // returns random uppercase strings.
```

These derived `Randomator`s are lazy; meaning that no generation takes place until you invoke the `value` method.

## Built-in Randomators

### Numbers

#### `numbers`

Generates a number between 0 and 1 (inclusive of 0, but excluding 1).  This `Randomator` is basically a wrapper around `Math.random`

```js
const numbers$ = numbers();
numbers$.next();  // [0, 1) same as `Math.Random`
```

#### `floats`

Generates a number between `min` and `max` rounded to `fixed` decimal places (default: `{ min: 0, max: 1, fixed: 4 }`) inclusive of `min`, but not `max`.

```js
floats().next();  // [0, 1) (same as `Math.Random`)

const otherFloat$ = floats({ min: -1e10, max: 1e10, fixed: 0 });
otherFloat$.next();  // [-1e10, 1e10)
```

#### `integers`

Generates a integer between min and max (default: `{ min: 0, max: 9 }`) inclusive of `min` and `max`.

```js
integers().next();  // [0, 9] (aka a single digit)
integers({ min: 5, max: 12 }).next();  // [5,12]
```

### Strings

#### `chars`

```js
chars().next();  // returns a random character (one of `abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()`).
chars('!@#$').next();  // returns a random character from the set '!@#$'
```

#### `strings`

```js
strings().next();  // returns a random string with between 5 and 20 lowercase characters.
strings({ length: 5 }).next();  // returns a string of five lowercase characters.
strings({ length: integer({ min: 3, max: 13 }) }).next();  // returns a string between 3 and 13 lowercase characters.
```

### Dates

#### `dates`

```js
dates().next();  // returns a date between Sep 14 1752 and Apr 18 2187
dates({ min: new Date('1/1/1970'), max: new Date('1/1/2020') }).next();  // returns a string between 1 Jan 1970 and 1 Jan 2020
```

#### `past`

```js
pasts().next();  // returns a date between Sep 14 1752 and the moment `next` is invoked
pasts({ min: new Date('1/1/1970') }).next();  // returns a string between 1 Jan 1970 and now
```

#### `future`

```js
future().next();  // returns a date between the moment `next` is invoked and Apr 18 2187
future({ max: new Date('1/1/2020') }).next();  // returns a string between now and 1 Jan 2020
```

## Operators

Operators are functions which can be called to create a new `Randomator`s.

### `oneOf`

```js
const yesNoMaybe$ = oneOf(['yes', 'no', 'maybe']);
yesNoMaybe$.next(); // returns one random value from input array
```

### `tuple`

```js
const tuple$ = tuple([integer(), string()]);
tuple$.next();  // returns an array (equivalent to [integer().next(), string().next()])
```

### `array`

```js
array(string(), 3).next();  // returns an array of three (3) random strings
integer({ min: 0, max: 6 }.map(length => array(string(), length).next();  // returns an array of between three (3) and six (6) random strings
```

### `seq`

```js
const name$ = string().map(capitalize);
const age$ = integer({ min: 0, max: 12 });
const phrase$ = seq([name$, ' is ', age$]);
phrase$.next();  // returns a random string like `{string} is {integer}`
```

## `randomator` Tag Function

A `randomator` tagged template function which is essentially a wrapper around the `seq` operator:

```js
const name$ = strings().map(capitalize);
const age$ = integers({ min: 0, max: 12 });
const phrase$ = randomator`${name$} is ${age$}`;
phrase$.next();  // same as seq([name, ' is ', age]).next();
```

## Custom Randomator

`Randomator` instance includes a `map` method for creating custom `Randomator`s from existing ones.

### `Randomator#map`

```js
const myString$ = strings({ length: integer({ min: 3, max: 13 }) }).map(s => s.toUpperCase());
myString$.next();  // returns a strings between 3 and 13 uppercase characters.
```

## License

This project is licensed under the MIT License - see the LICENSE file for details
