#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <numeric>
#include <algorithm>

std::vector<std::vector<std::string>> parse_input(const std::vector<std::string> input) {
    std::vector<std::vector<std::string>> patterns;
    std::vector<std::string> curr_pattern;

    for (const std::string& line : input) {
        if (line.length() == 0) {
            patterns.push_back(curr_pattern);
            curr_pattern.clear();
        } else {
            curr_pattern.push_back(line);
        }
    }
    patterns.push_back(curr_pattern);

    return patterns;
}

std::vector<std::string> transpose_vector(const std::vector<std::string> pattern) {
    std::vector<std::string> transposed(pattern[0].size(), std::string(pattern.size(), ' '));

    for (int i = 0; i < pattern.size(); i++) {
        for (int j = 0; j < pattern[0].size(); j++) {
            transposed[j][i] = pattern[i][j];
        }
    }

    return transposed;
}

bool line_is_vertically_symmetrical(std::string line, int j, bool exclude_left) {
    if (exclude_left) {
        std::string rev = line.substr(line.length()-j, j);
        std::reverse(rev.begin(), rev.end());

        return line.substr(line.length()-j*2, j) == rev;
    } else {
        std::string rev = line.substr(j, j);
        std::reverse(rev.begin(), rev.end());

        return line.substr(0, j) == rev;
    }
}

int find_line_of_reflection(std::vector<std::string> pattern, int orig_line=0) {
    // checks vertically
    for (int j = 1; j <= pattern[0].length()/2; j++) {
        std::vector<bool> left;  // elements = row is symmetrical, excluding right columns
        std::vector<bool> right; // elements = row is symmetrical, excluding left columns
        for (int i = 0; i < pattern.size(); i++) {
            left.push_back(line_is_vertically_symmetrical(pattern[i], j, false));
            right.push_back(line_is_vertically_symmetrical(pattern[i], j, true));
        }
        
        if (std::accumulate(left.begin(), left.end(), 0) == left.size() && j != orig_line)
            return j;

        if (std::accumulate(right.begin(), right.end(), 0) == right.size() && pattern[0].length()-j != orig_line)
            return pattern[0].length() - j;
    }

    return 0;
}

int find_line_of_reflection_with_smudge(std::vector<std::string> pattern, int orig_col, int orig_row) {
    // brute force change every character and test
    for (std::string& row : pattern) {
        for (int j = 0; j < pattern[0].length(); j++) {
            char original_char = row[j];
            row[j] = (original_char == '.') ? '#' : '.'; // swap to the other character

            int cols = find_line_of_reflection(pattern, orig_col);
            if (cols > 0) {
                return cols;
            }

            int rows = find_line_of_reflection(transpose_vector(pattern), orig_row);
            if (rows > 0) {
                return rows * 100;
            }

            row[j] = original_char; // swap back and test another character
        }
    }

    return 0;
}


int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int part1 = 0, part2 = 0;
    std::vector<std::vector<std::string>> patterns = parse_input(input);
    for (std::vector<std::string> p : patterns) {
        int cols = find_line_of_reflection(p);
        int rows = find_line_of_reflection(transpose_vector(p));

        part1 += cols + rows*100;
        part2 += find_line_of_reflection_with_smudge(p, cols, rows);
    }


    std::cout << part1 << std::endl; // 35521
    std::cout << part2 << std::endl; // 34795

    return 0;
}
