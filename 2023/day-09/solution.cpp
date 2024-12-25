#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>

std::vector<int> parse_line(const std::string line) {
    std::vector<std::string> terms = split(line);
    std::vector<int> vals;

    for (std::string num : terms)
        vals.push_back(std::stoi(num));
    
    return vals;
}

int extrapolate_value(std::vector<int> vals, bool forward) {
    std::vector<int> diffs;

    for (int i = 1; i < vals.size(); i++) {
        int diff = vals[i] - vals[i-1];
        diffs.push_back(diff);
    }

    auto it = std::adjacent_find(diffs.begin(), diffs.end(), std::not_equal_to<int>());

    // All numbers are the same -> return the number (base case)
    if (it == diffs.end())
        return diffs[0];

    // Part 1
    if (forward)
        return diffs[diffs.size() - 1] + extrapolate_value(diffs, forward);
    
    // Part 2
    return diffs[0] - extrapolate_value(diffs, forward);
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int part1 = 0, part2 = 0;

    for (const std::string& line : input) {
        std::vector<int> vals = parse_line(line);

        part1 += vals[vals.size() - 1] + extrapolate_value(vals, true);
        part2 += vals[0] - extrapolate_value(vals, false);
    }

    std::cout << part1 << std::endl; // 1708206096
    std::cout << part2 << std::endl; // 1050

    return 0;
}
