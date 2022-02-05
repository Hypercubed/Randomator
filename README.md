# Randomator

Composable, Iterable, and transformable random value generators.

## Intro

A `Randomator` is a random value generator.  A `Randomator` may be constructed using the `new Randomator` constructor but more often they are constructed using the supplied generators and operators described below.  Every `Randomator` is a function and an iterable that returns a new value each time.  Some interesting things about  `Randomator`s are:

* A `Randomator` is a function that returns a new random value each time it is called.
* A `Randomator` is an iterable and can be used in a for-of loop.
* A `Randomator` can be transformed using the `.map` and `.filter` operators.

As an base example we will create a `Randomator` that returns a random integer between 0 and 1:

```js
const number$ = new Randomator(() => Math.random());
```

> Note: in this readme I'll use [Finnish Notation](https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b) to signify a `Randomator` instance.  This is simply for clarity.

The `Randomator` constructor takes a function that returns a new value each time it is called.  Since a `Randomator` is a function it can be called to return a value:

```js
console.log(number$());  // prints a random number between 0 and 1 (same as Math.random())
```

A `Randomator` is also an iterable and can be used in a for-of loop:

```js
let count = 0;
for (const number of number$) {
  if (count++ > 10) break;
  console.log(number);
}
```

> Warning: Use caution when using a `Randomator` in a for-of loop... it is an infinite stream of values!

A `Randomator` can be transformed using the `.map` and `.filter` operators:

```js
const numbers$ = new Randomator(() => Math.random());
const integers$ = numbers$.map(number => Math.floor(number * 100));
const evenIntegers$ = integers$.filter(number => number % 2 === 0);
```

> Warning: Use caution when using `filter`, a strict predicate may cause an infinite loop.

These derived `Randomator`s are lazy; meaning that no generation takes place until the `Randomator` is called.

While `Randomator`s can be created using the `new Randomator` constructor, they are more often created using the built-in operators:

```js
const number$ = numbers();
console.log(number$());  // Prints an random number (same as Math.random())
```

A more involved example is the `string` function which take several options and returns a `Randomator` of strings:

```js
const chars$ = chars({ pool: 'abc' });
const length$ = integers({ min: 3, max: 13 });
const string$ = strings({ chars: chars$, length: length$ });
console.log(string$());  // Prints a string between three (3) and 13 characters (inclusive) of 'a', 'b' or 'c'.
```

And operators:

```js
const number$ = numbers();
const evenNumber$ = number$.filter(number => number % 2 === 0);
const oddNumber$ = number$.filter(number => number % 2 !== 0);
const oddEven$ = tuple(oddNumber$, evenNumber$);  // A randomator that generates odd/even pairs
```

## Built-in Generators

### Numbers

#### `numbers`

Generates a number between 0 and 1 (inclusive of 0, but excluding 1).  This `Randomator` is basically a wrapper around `Math.random`.

```js
const number$ = numbers();
number$();  // [0, 1) same as `Math.Random`
```

#### `floats`

Generates a number between `min` and `max` rounded to `fixed` decimal places (default: `{ min: 0, max: 1, fixed: 4 }`) inclusive of `min`, but not `max`.

```js
const float$ = floats();
float$();  // [0, 1)

const otherFloat$ = floats({ min: -1e10, max: 1e10, fixed: 0 });
otherFloat$();  // [-1e10, 1e10)
```

#### `integers`

Generates a integer between min and max (default: `{ min: 0, max: 9 }`) inclusive of `min` and `max`.

```js
integers()();  // [0, 9] (aka a single digit)
integers({ min: 5, max: 12 })();  // [5,12]
```

### Strings

#### `chars`

```js
chars()();  // returns a random character (one of `abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()`).
chars({ pool: '!@#$' })();  // returns a random character from the set '!@#$'
```

#### `strings`

```js
strings()();  // returns a random string with between 5 and 20 lowercase characters.
strings({ length: 5 })();  // returns a string of five lowercase characters.

const chars$ = chars({ pool: 'abc' });
const length$ = integers({ min: 3, max: 13 });
const string$ = strings({ chars: chars$, length: length$ });
console.log(string$());  // Prints a string between three (3) and 13 characters (inclusive) of 'a', 'b' or 'c'.
```

### Dates

#### `dates`

```js
dates()();  // returns a date between Sep 14 1752 and Apr 18 2187
dates({ min: new Date('1/1/1970'), max: new Date('1/1/2020') })();  // returns a string between 1 Jan 1970 and 1 Jan 2020
```

#### `past`

```js
past()();  // returns a date between Sep 14 1752 and now
past({ min: new Date('1/1/1970') })();  // returns a string between 1 Jan 1970 and now
```

#### `future`

```js
future()();  // returns a date between now invoked and Apr 18 2187
future({ max: new Date('1/1/2020') })();  // returns a string between now and 1 Jan 2020
```

## Operators

Operators are functions which can be called to create a new `Randomator`s.

### `oneOf`

```js
const yesNoMaybe$ = oneOf(['yes', 'no', 'maybe']);
yesNoMaybe$(); // returns one random value from the input array
```

### `tuple`

```js
const integer$ = integers();
const string$ = strings();
const tuple$ = tuple([integer$, string$]);
tuple$();  // returns an array (equivalent to [integer$(), string$()])
```

### `array`

```js
const string$ = strings();
array(string$, 3)();  // returns an array of three (3) random strings
integer({ min: 0, max: 6 }).map(length => array(string$, length)();  // returns an array of between three (3) and six (6) random strings
```

### `seq`

```js
const name$ = string().map(capitalize);
const age$ = integer({ min: 0, max: 12 });
const phrase$ = seq([name$, ' is ', age$]);
phrase$();  // returns a random string like `{string} is {integer}`
```

## `randomator` Tag Function

A `randomator` tagged template function which is essentially a wrapper around the `seq` operator:

```js
const name$ = strings().map(capitalize);
const age$ = integers({ min: 0, max: 12 });
const phrase$ = randomator`${name$} is ${age$}`;
phrase$();  // same as seq([name$, ' is ', age$])();
```

## License

This project is licensed under the MIT License - see the LICENSE file for details
