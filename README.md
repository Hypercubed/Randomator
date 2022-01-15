# Randomator

Randomator is a library for composing generators of random values.  It provides one core type, the `Randomator`, and operators for composing `Randomator`s.

## Install

```
npm i randomator
```

## Intro

A `Randomator` is a, typically random, value generator.  A `Randomator` can be constructed using the `new Randomator` constructor but more often they are constructed using the built-in `Randomator` generators or operators described below.  Every `Randomator` has a `value()` method that returns a single value.

In the most basic example the function `number` returns a Randomator (generator). In this case `value` returns a random number between 0 and 1 (same as `Math.random`).

> Note: in this readme I'll use [Finnish Notation](https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b) to signify a `Randomator`.  This is simply for clarity.

```js
const myNumber$ = numbers();
myNumber$.value();  // Returns an random number (same as Math.random())
```

A more involved example is the `string` function which take several options and returns a `Randomator` of strings:

```js
const myString$ = strings({ chars: chars('abc'), length: integers({ min: 3, max: 13 }) });
myString$.value();  // returns a string between three (3) and 13 characters (inclusive) of 'a', 'b' or 'c'.
```

Randomators also include methods and operators for creating derived `Randomator`s:

```js
const ucaseString$ = string().map(s => s.toUpperCase());
const ucaseStringArray$ = array(ucaseString, 3);
ucaseString$.value();  // returns an array of three uppercase strings.
```

These derived `Randomator`s are lazy; meaning that no generation takes place until you invoke the `value` method.

## Built-in Randomators

### Numbers

#### `numbers`

Generates a number between 0 and 1 (inclusive of 0, but excluding 1).  This `Randomator` is basically a wrapper around `Math.random`

```js
const numbers$ = numbers();
numbers$.value();  // [0, 1) same as `Math.Random`
```

#### `floats`

Generates a number between `min` and `max` rounded to `fixed` decimal places (default: `{ min: 0, max: 1, fixed: 4 }`) inclusive of `min`, but not `max`.

```js
floats().value();  // [0, 1) (same as `Math.Random`)

const otherFloat$ = floats({ min: -1e10, max: 1e10, fixed: 0 });
otherFloat$.value();  // [-1e10, 1e10)
```

#### `integers`

Generates a integer between min and max (default: `{ min: 0, max: 10 }`) inclusive of `min` and `max`.

```js
integers().value();  // [0, 9] (aka a single digit)
integers({ min: 5, max: 12 }).value();  // [5,12)
```

### Strings

#### `chars`

```js
chars().value();  // returns a random character (one of `abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()`).
chars('!@#$').value();  // returns a random character from the set '!@#$'
```

#### `strings`

```js
strings().value();  // returns a random string with between 5 and 20 lowercase characters.
strings({ length: 5 }).value();  // returns a string of five lowercase characters.
strings({ length: integer({ min: 3, max: 13 }) }).value();  // returns a string between 3 and 13 lowercase characters.
```

### Dates

#### `dates`

```js
dates().value();  // returns a date between 20 Apr -271821 and 13 Sep 275760
dates({ min: new Date('1/1/1970'), max: new Date('1/1/2020') }).value();  // returns a string between 1 Jan 1970 and 1 Jan 2020
```

#### `past`

```js
pasts().value();  // returns a date between 20 Apr -271821 and the moment `value` is invoked
pasts({ min: new Date('1/1/1970') }).value();  // returns a string between 1 Jan 1970 and now
```

#### `future`

```js
future().value();  // returns a date between the moment `value` is invoked and 13 Sep 275760
future({ max: new Date('1/1/2020') }).value();  // returns a string between now and 1 Jan 2020
```

## Operators

Operators are functions which can be called to create a new `Randomator`s.

### `oneOf`

```js
oneOf(['yes', 'no', 'maybe']).value(); // returns one random value from input array
```

### `tuple`

```js
tuple([integer(), string()]).value();  // returns an array (equivalent to [integer().value(), string().value()])
```

### `array`

```js
array(string(), 3).value();  // returns an array of three (3) random strings
integer({ min: 0, max: 6 }.map(length => array(string(),length).value();  // returns an array of between three (3) and six (6) random strings
```

### `seq`

```js
const name$ = string().map(capitalize);
const age$ = integer({ min: 0, max: 12 });
seq([name$, ' is ', age$]).value();  // returns a random string like `{string} is {integer}`
```

## `randomator` Tag Function

Randomator provides a `randomator` tag function which is essentially a wrapper around the `seq` operator:

```js
const name$ = strings().map(capitalize);
const age$ = integers({ min: 0, max: 12 });
const phrases$ = randomator`${name$} is ${age$}`;
phrases$.value();  // same as seq([name, ' is ', age]).value();
```

## Custom Randomator

`Randomator` instance includes a `map` method for creating custom `Randomator` from existing ones.

### `Randomator#map`

```js
const myString$ = strings({ length: integer({ min: 3, max: 13 }) }).map(s => s.toUpperCase());
myString$.value();  // returns a strings between 3 and 13 uppercase characters.
```

## License

This project is licensed under the MIT License - see the LICENSE file for details
