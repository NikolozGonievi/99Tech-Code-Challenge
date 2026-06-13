/* 
     I will assume that the input is a positive integer n.
*/

// Approach 1: Iterative
var sum_to_n_a = function (n) {
  if (n < 0) {
    return "Input must be a positive integer";
  }

  var sum = 0;
  while (n > 0) {
    sum += n;
    n--;
  }

  return sum;
};

// Approach 2: Mathematical formula
var sum_to_n_b = function (n) {
  if (n < 0) {
    return "Input must be a positive integer";
  }

  return (n * (n + 1)) / 2;
};

// Approach 3: Recursive
var sum_to_n_c = function (n) {
  if (n < 0) {
    return "Input must be a positive integer";
  }

  if (n === 0) {
    return 0;
  }

  return n + sum_to_n_c(n - 1);
};

console.log("Approach 1:", sum_to_n_a(5)); // 15
console.log("Approach 2:", sum_to_n_b(10)); // 55
console.log("Approach 3:", sum_to_n_c(100)); // 5050
