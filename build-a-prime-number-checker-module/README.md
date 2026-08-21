# Prime Number Checker Module

A small npm module that checks whether a given number is prime.

A prime number is a whole number greater than 1 that has no divisors other than 1 and itself (e.g. 2, 3, 5, 7, 11).

## Usage

```js
const { isPrime } = require('./index.js');

isPrime(7);  // true
isPrime(8);  // false
```

## API

### `isPrime(num)`

Returns `true` if `num` is a prime number, `false` otherwise.
