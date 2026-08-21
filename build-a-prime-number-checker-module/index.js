function isPrime(num) {
  // 1 and numbers below aren't prime by definition
  if (num <= 1) {
    return false;
  }

  // check every number from 2 up to num - 1
  for (let i = 2; i < num; i++) {
    if (num % i === 0) {
      // something divided evenly — not prime
      return false;
    }
  }

  // nothing divided evenly — it IS prime
  return true;
}


module.exports = {
  isPrime
}