#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <tuple>
#include <unordered_map>

std::pair<std::string, std::vector<int>> parse_line(const std::string line, int folds) {
    std::vector<std::string> terms = split(line);
    std::vector<std::string> nums = split(terms[1], ',');
    
    std::string row = "";
    std::vector<int> groups;

    for (int i = 0; i < folds; i++) {
        if (i<1) row += terms[0];
        else row += "?" + terms[0];

        for (auto& n : nums)
            groups.push_back(std::stoi(n));
    }

    return std::make_pair(row, groups);
}

int64_t find_arrangements(std::string row, std::vector<int> groups, int i, int group_idx, int curr_spring_count,
                      std::unordered_map<std::string, int64_t>& dp) {

    std::string key = std::to_string(i) + "," + std::to_string(group_idx) + "," + std::to_string(curr_spring_count);
    if (dp.find(key) != dp.end()) {
        return dp[key];
    }

    // base case - reached end of string
    if (i == row.length()) {
        // last character was '.'
        if (curr_spring_count == 0 && group_idx == groups.size())
            return 1;

        // last character was '#'
        else if (curr_spring_count == groups[group_idx] && group_idx == groups.size()-1)
            return 1;

        return 0;
    }

    int64_t arrangements = 0;
    
    char c = row[i];
    if (c == '.') {
        if (curr_spring_count == groups[group_idx] && group_idx < groups.size()) {
            // currently processing a valid spring group -> reset spring count and increment group index
            arrangements += find_arrangements(row, groups, i+1, group_idx+1, 0, dp);
        } else if (curr_spring_count == 0) {
            // not processing a spring group
            arrangements += find_arrangements(row, groups, i+1, group_idx, curr_spring_count, dp);
        }
    } else if (c == '#') {
        arrangements += find_arrangements(row, groups, i+1, group_idx, curr_spring_count+1, dp);
    } else if (c == '?') {
        // replace the '?' with '.'
        row[i] = '.';
        arrangements += find_arrangements(row, groups, i, group_idx, curr_spring_count, dp);
        // replace the '?' with '#'
        arrangements += find_arrangements(row, groups, i+1, group_idx, curr_spring_count+1, dp);
    }

    dp[key] = arrangements;

    return arrangements;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int64_t part1 = 0, part2 = 0;
    std::unordered_map<std::string, int64_t> dp;

    for (const std::string& line : input) {
        std::pair<std::string, std::vector<int>> record = parse_line(line, 1);
        part1 += find_arrangements(record.first, record.second, 0, 0, 0, dp);
        dp.clear();

        record = parse_line(line, 5);
        part2 += find_arrangements(record.first, record.second, 0, 0, 0, dp);
        dp.clear();
    }
    
    // Relied heavily on the subreddit for today's puzzle, got very stuck

    std::cout << part1 << std::endl; // 7490
    std::cout << part2 << std::endl; // 65607131946466

    return 0;
}
