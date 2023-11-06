# Advent of Code 2022

My attempt at the [Advent of Code 2022](https://adventofcode.com/2022) challenges, done in JavaScript

### What I learned on each day
Day 1 - reading from files in JS, sorting arrays in JS
Day 2 - using char codes(?)
Day 3 - exploiting the use of `null` as false for conditions
Day 4 - swapping parameters to a function, string formatting in JS
Day 5 - array shifting/unshifting/splicing, shallow copies of arrays, using regex in `str.replace()`
Day 6 - set objects
Day 7 - array sums (via `arr.reduce()`), filtering, refreshing my recursion knowledge
Day 8 - array methods: `.findIndex()` and `.every()`
Day 9 - sometimes brute force works...
Day 10 - using `.forEach()` for better clarity & succinctness
Day 11 - a modular arithmetic property: $\forall k.\  ((a \mod km) \mod m = a \mod m)$, plus improving my input parsing
Day 12 - BFS for undirected unweighted graphs, more succinct 2D array initialisation
Day 13 - multiple args in `.forEach(element, index, array)`, realising `indexOf()` doesn't work as intended for subarrays, `JSON.parse()` as an alternative to `eval()` for strings of arrays
Day 14 - creating a "range"-like array in one line, and an alternative solution is [memoizing the path of each previous grain of sand and then starting at the last position before it landed](https://www.reddit.com/r/adventofcode/comments/zljtev/2022_day_14_part_2_clever_alternative_solution/j05uo9i/) (although I didn't implement this)
Day 15 - `max = Math.max(max, x);` instead of `if (x > max) max = x;` (and likewise for min), `for ... of` loops (I should've known about this way earlier), and sometimes functions originally intended to return booleans don't always have only two outcomes

Day 20 - modulo vs. remainder (i.e. `function mod(a, b) {return ((a % b) + b) % b;}`)

Total stars: 36/50