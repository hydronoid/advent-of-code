# Advent of Code 2023

My attempt at the [Advent of Code 2023](https://adventofcode.com/2023) challenges, while learning C++ for the first time.

Total stars earned: 50/50⭐ (with a lot of help from the subreddit)

## What I learned on each day
### Day 1 
- file parsing, C++ I/O, compilation and execution
- `stoi()`, `str.find()` and `str.rfind()`
- alternative solutions (courtesy of Reddit, much better than mine):
    - add every digit to a vector as you go, so the number for one line is given by the first and last results
    - replacing the "digit words" to contain the actual digit in the middle of the word, which allows reusing part 1 code
### Day 2
- string parsing is kind of annoying in C++
- additional params for `str.find()` and `str.substr`
- infinity `std::numeric_limits<int>::max()` and negative infinity `std::numeric_limits<int>::min()`
- remembering I can initialise values of the fields in `struct`s
### Day 3
- putting my file reading function in a header file
- needing to account for carriage return characters `\r` at the end of a line
### Day 4
- needing to inspect both the sample input and given input (I hard-coded the number of cards for the sample using `sscanf()` before I realised there were more cards in the actual data)
    <details>
        <summary>
        old code with sscanf()
        </summary>

        sscanf(line.c_str(), "Card %d: %ms %ms %ms %ms %ms | %ms %ms %ms %ms %ms %ms %ms %ms",
                            &card_num,
                            &winning_nums[0], &winning_nums[1], &winning_nums[2], &winning_nums[3], &winning_nums[4],
                            &drawn_nums[0], &drawn_nums[1], &drawn_nums[2], &drawn_nums[3],
                            &drawn_nums[4], &drawn_nums[5], &drawn_nums[6], &drawn_nums[7])

        // only works with sample data, there's too many for the actual data
    </details>
- basics about streams, for the purpose of parsing input lines (i.e. `split()`)
- my initial recursive solution for part 2 was pretty inefficient, which led to me to refactor it using an iterative approach 
- `std::accumulate(v.begin(), v.end(), 0);` for summing a vector `v` from the `<numeric>` library
### Day 5
- using `long long`s
- iterating through a vector `v` in reverse: `for (auto item = v.rbegin(); item != v.rend(); item++)`
- sometimes brute force does work, but it only runs in a reasonable amount of time if you work backwards from the answers
- null terminator sometimes appeared while parsing lines
### Day 6
- using `int64_t` instead of `long long`, and that `long long` may be larger than 64 bits but `int64_t` will always be 64 bits
- a way to remove spaces from a string in C++: `str.erase(std::remove_if(str.begin(), str.end(), ::isspace), str.end())`
- remembering from other languages that you can also treat a boolean value as 1 or 0 to use for arithmetic, and learning that it's the same in C++
- brute force still can run quite quickly, even when there is a constant time alternative using maths
### Day 7
- unordered maps in C++, and using them for counting
- using comparators for sorting in C++
- remembering I have to use references via `&` when I am iterating through vectors with a for loop if I want to modify it
### Day 8
- function pointers, and passing functions as parameters in C++, such as lambda expressions
- using `pair`s in C++, which I used as values in an unordered map
- iterating through maps also returns a `pair` of the key and its value
- (spoiler for part 2) realising that, after reading discussion on Reddit, LCM does not guarantee a correct solution, but the input here was rigged for it to work. It should only give a correct solution after verifying that the cycle actually repeats correctly.
### Day 9
- `std::adjacent_find()` for checking if all elements in a vector are equal
    - i.e. `bool all_same = std::adjacent_find(v.begin(), v.end(), std::not_equal_to<int>()) == v.end()`
- alternative solution for part 2 is just reversing the order of the numbers
### Day 10
- remembering that Dijkstra's degenerates to BFS when the distances are all 1
- a property about enclosed shapes
    <details>
        <summary>
        part 2 spoiler
        </summary>
        To find if a given pixel is inside a shape or not: you shoot a ray in any direction from the pixel and if it crosses the boundary an odd number of times, it's inside.
        However you need to look out for collinear edges.
    </details>

### Day 11
- I massively overcomplicated the problem as a graph problem and realised it was just the Manhattan distance
- `.emplace_back()` method for vectors and other data structures, and how it accepts arguments for the constructor of the data type being stored
    - it additionally constructs the object directly in the memory location managed by the vector, and thus can be more efficient as temporary objects don't need to be created.
- a grid is not necessarily needed when the given input is a grid
### Day 12
- C++ vectors do not throw an error when you go out of bounds
- checking map membership: `m.find(key) != m.end()`
- I need to be careful when calling recursive functions multiple times with identical state (memo key) parameters, as the subsequent calls will use the memoised solutions. So if using the same memo key parameters, I should update them where possible (this stumped me on line 66 of my solution)
### Day 13
- a way to find if all elements of a boolean vector are true: `std::accumulate(v.begin(), v.end(), 0) == v.size()`
### Day 14
- realising that cycles have a length, and that that length is not just from 0 to the second occurrence, but from the first occurrence to the second  occurrence.
### Day 15
- `str.find_first_of()` to find the first index of multiple characters you want to search
- removing last character at the end of a string: `str.erase(str.length() - 1, 1)`
### Day 16
- segmentation faults can occur when you cause a stack overflow from recursion
- passing by reference is a LOT faster during recursion (surprised I learnt this this late, cut down my solution from 13 seconds to 1)
- brute force strikes again
- an alternative solution uses complex numbers
### Day 17
- `INT_MAX` constant (in the `climits` header) - that I didn't end up using in my final implementation
- `unordered_set`s in C++ (and element membership is the same as maps: `my_set.find(key) != my_set.end()`)
- defining constructors and operators in `struct`s, e.g. `operator<`
### Day 18
- converting from hexadecimal string to decimal (`int`) in C++ `std::stoi(hex_string, nullptr, 16);`
    - `nullptr` - which I used for the `pos` parameter (a pointer) in `std::stoi()` that I didn't have a use for
- remembering that the result of an operation on two `int`s will also be an `int`, even if I am assigning it to an `int64_t`, so it'll still overflow
    - e.g. given `int a, b;`, I need to do `int64_t c = static_cast<int64_t>(a) * b;` for the multiplication to not overflow

<details>
<summary>some formulae for polygons (spoiler)</summary>
<!---->

essentially, Pick's theorem and the shoelace formula.
- $A = i + \frac{b}{2} - 1$ (Pick's theorem)
- $A$ is not actually the answer we care about, but $i + b$ (internal points + boundary points)
    - this is because $A$ goes from the "centre" of the points, and doesn't consider the blocks around it 
        - [image demonstration](http://jwezorek.com/wp-content/uploads/2023/12/aoc_day18_diagram.png)
        - $A$ gives 4 while $i + b$ is 9
- rearranging Pick's theorem for $i$, we get $i = A - \frac{b}{2} + 1$
- so $i + b = A + \frac{b}{2} + 1$
    - $b$ is the shape's perimeter
    - $A$ can be calculated through the shoelace formula
</details>

### Day 19
- list initialisation of maps
    ```c++
    std::unordered_map<char, std::pair<int, int>> rating_ranges{
        {'x', {1, 4000}},
        {'m', {1, 4000}},
        {'a', {1, 4000}},
        {'s', {1, 4000}}
    };
    ```
- sometimes it may be good to initially write code with simplified logic first 
    - I initially had trouble coming up with the logic for splitting the ranges as I overcomplicated it, turns out the value for the conditions are always within the ranges, so there is always a split.
    - Had I simplified my logic and just assumed there was always a split, I would have come to the answer much sooner. If it was not the case that there wasn't always a split, then at least I learned something about the input that will inform me about how to account for it.
### Day 20
- structured bindings, e.g. `auto [num1, num2] = pair_of_numbers;`, which work for arrays, pairs, and tuples
- I can write `return {};` at the end of a function that returns an object while I'm working on filling it out (sort of like `pass` in python)
    - additionally, making optional parameters which are objects in functions, e.g. `int my_func(int a, std::vector<int>& nums = {})`
- even though the question is asking for how many iterations (button presses), I need to be aware of the nested iterations as well (individual pulses) when examining the state (modules).
    - I initially tried to observe & reason with the state *after* every main iteration (button press), rather than inside the nested loop (individual pulses)
- removing all of a specific character from a string (using the `<algorithm>` header) - `str.erase(std::remove(str.begin(), str.end(), ','), str.end());`
### Day 21
- `-1 / 10` is 0 in C++, but `-1 // 10` is 1 in Python
- using `valgrind` to debug memory errors
- determining a quadratic function's coefficients given 3 points (somehow I never learned this in school)
### Day 22
- remembering how to use `sscanf()` to parse the input
- `std::tie()` for use in the `operator<` of a `struct`
### Day 23
- structured bindings can be used in for loops
- I need to be careful when iterating through something I'm deleting from
- remembering that DAGs don't need a `visited` / `seen` set when doing a BFS
### Day 24
- format specifiers for `int64` and `double`, which are `%ld` and `%lf` respectively
- remembering how to do algebra with straight line equations
- a few things here and there regarding systems of linear equations, such as using Gaussian elimination to solve them
- `round()` in `<cmath>` and `std::setprecision()` in `<iomanip>` for printing out floats
### Day 25
- being able to use `std::min()` and `std::max()` on strings, in order to label undirected edges
- the existence of Graphviz, and other graph visualisation tools
