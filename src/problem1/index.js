// Sum to n using reduce
var sum_to_n_a = function (n) {
  return Array.from({ length: n }).reduce((acc, _, index) => acc + (index + 1), 0);
};

// Sum to n using formula
var sum_to_n_b = function (n) {
  return ((n + 1) * n) / 2;
};

// Sum to n using recursion
var sum_to_n_c = function (n) {
  if (n === 1) {
    return 1;
  }
  return n + sum_to_n_c(n - 1);
};
