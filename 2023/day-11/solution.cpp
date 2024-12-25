#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>

bool is_all_dots(std::vector<std::string> input, int number, bool row) {
    if (row) {
        for (char c : input[number])
            if (c != '.')
                return false;
        return true;
    } else {
        for (std::string row : input)
            if (row[number] != '.')
                return false;
        return true;
    }
}

std::vector<std::pair<int, int>> expand_universe(std::vector<std::string> input, int expansion_factor) {
    std::vector<int> cols_to_add;
    std::vector<int> rows_to_add;

    std::vector<std::pair<int, int>> galaxies;

    for (int i = 0; i < input.size(); i++)
        for (int j = 0; j < input[0].length(); j++)
            if (input[i][j] == '#')
                galaxies.emplace_back(i, j);

    for (int i = 0; i < input.size(); i++) {
        // current size of vector offsets the row/col number, since those will be added

        if (is_all_dots(input, i, true))
            rows_to_add.push_back(i + rows_to_add.size() * (expansion_factor-1));

        if (is_all_dots(input, i, false))
            cols_to_add.push_back(i + cols_to_add.size() * (expansion_factor-1));
    }

    // shift the locations of the galaxies after expansion
    for (int row : rows_to_add)
        for (auto& loc : galaxies)
            if (loc.first > row)
                loc.first += expansion_factor - 1;

    for (int col : cols_to_add)
        for (auto& loc : galaxies)
            if (loc.second > col)
                loc.second += expansion_factor - 1;

    return galaxies;
}

int64_t sum_distances(std::vector<std::pair<int, int>> galaxies) {
    int64_t sum = 0;
    for (int i = 0; i < galaxies.size(); i++) {
        for (int j = i+1; j < galaxies.size(); j++) {
            // manhattan distance
            sum += std::abs(galaxies[i].first - galaxies[j].first) + std::abs(galaxies[i].second - galaxies[j].second);
        }
    }
    return sum;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int64_t part1 = 0;
    int64_t part2 = 0;

    std::vector<std::pair<int, int>> galaxies       = expand_universe(input, 2);
    std::vector<std::pair<int, int>> older_galaxies = expand_universe(input, 1000000);

    part1 = sum_distances(galaxies);
    part2 = sum_distances(older_galaxies);

    std::cout << part1 << std::endl; // 9693756
    std::cout << part2 << std::endl; // 717878258016

    return 0;
}
