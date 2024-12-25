# Advent of Code 2024

My attempt at the [Advent of Code 2024](https://adventofcode.com/2024) challenges, while learning TypeScript for the first time.

Total stars earned: 50/50⭐

## What I learned on each day

### Day 1
- `Map` data structure, and accumulating via `(myMap.get(val) || 0) + 1`

### Day 2
- existence of `Math.sign()`

### Day 3
- refreshing my regex knowledge
- forgot that I can use `|` to combine two expressions with OR in regex

### Day 4
- we can use `[-1, 0, 1]` in a nested loop to explore 8 directions rather than hard coding every direction (like `[[1, 0], [0, 1], [-1, -1], ...]`)
- using regex to count occurrences

### Day 5
- array destructuring to swap values: `[a, b] = [b, a]`

### Day 6
- optional chaining `?.`

### Day 7
- refreshing my knowledge of recursive functions with Boolean return values
- concatenating numbers together with ``${foo}${bar}``

### Day 8
- nothing in particular today

### Day 9
- remembering `arr.splice()` and `arr.fill()`

### Day 10
- I can also do something like ``${i} ${j}`` instead of `JSON.stringify([i. j])`

### Day 11
- `.forEach()` on `Map`s are `.forEach((value, key) => {...});` and not `(key, value)`
- you can initialise key value pairs of a `Map` from an array `arr` with `new Map(arr.map(x => [key, val]))`
- puzzle in general reminded me a lot of 2021 Day 14

### Day 12
- TypeScript's non-null assertion operator `!`, (e.g. `queue.shift()!`), which tells TypeScript that the value returned by `queue.shift()` will never be null or undefined
- `JSON.stringify([[i2, j2], [di, dj]])` will not have any spaces in the string (spent too long debugging this)

### Day 13
- `mathjs` and `lusolve()`
- the "nullish coalescing operator": `value ?? []` evaluates to `[]` if `value` is `null` or `undefined`

### Day 14
- destructuring in `.map()` to extract properties from an array of objects, e.g. `objArr.map(({ property1, property2 }) => ...);`

### Day 15
- `arr.concat()` does not modify the array in place but returns a new one
- `arr.concat([])` does nothing

### Day 16
- you can specify more complex return types, e.g. `[{ [key: string]: number }, { [key: string]: string }]`
- array destructuring in multiple dimensions, e.g. `const [[i, j], [di, dj]] = foo();`

### Day 17
- `BigInt` and its literal syntax, e.g. `8n`
- `bigint`, in lowercase, is the type for TypeScript, whereas `BigInt` is the constructor

### Day 18
- recalling that Dijkstra's with no weights is just BFS, as in previous years of AoC
  
### Day 19
- refreshing my knowldge on dynamic programming

### Day 20
- sometimes properties of the input can help you solve the puzzle

### Day 21
- fixed length & multi-type array type declarations, AKA tuples 
  - e.g. `let foo: [number, string] = [1, 'a'];`
  - surprised I only found out about this now

### Day 22
- the existence of `console.assert()`
- casting to unsigned int `a >>> 0`, because XOR in JavaScript (`^`) converts to 32 bit integers (so we do `(a ^ b) >>> 0` to remedy this)

### Day 23
- clique problems and the Bron-Kerbosch algorithm

### Day 24
- what in tarnation a ripple-carry adder is

### Day 25
- Merry Christmas!