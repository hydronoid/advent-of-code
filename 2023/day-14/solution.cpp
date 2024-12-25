#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <unordered_map>

void slide_rock(std::vector<std::string>& input, int i, int j, int di, int dj) {
    int a = i + di;
    int b = j + dj;

    while (0 <= a && a < input.size() && 0 <= b && b < input[0].length() && input[a][b] == '.') {
        a += di;
        b += dj;
    }

    // swap the rock with the landing place
    input[i][j] = '.';
    input[a-di][b-dj] = 'O';
}

void shift_grid(std::vector<std::string>& grid, int di, int dj) {
    for (int i = 0; i < grid.size(); i++) {
        // if shifting south, start from the bottom
        int a = (di > 0) ? grid.size()-i-1 : i;

        for (int j = 0; j < grid[0].length(); j++) {
            // if shifting east, start from the right
            int b = (dj > 0) ? grid[0].length()-j-1 : j;

            if (grid[a][b] == 'O') {
                slide_rock(grid, a, b, di, dj);
            }
        }
    }
}

int calculate_load(std::vector<std::string> grid) {
    int load = 0;

    for (int i = 0; i < grid.size(); i++)
        for (int j = 0; j < grid[0].size(); j++)
            if (grid[i][j] == 'O')
                load += grid.size() - i;

    return load;
}

std::string construct_key(std::vector<std::string> grid) {
    std::string key = "";

    // construct a key of a grid based on the positions of the O's, separated by a '/' char
    for (int i = 0; i < grid.size(); i++) {
        for (int j = 0; j < grid[0].length(); j++) {
            if (grid[i][j] == 'O') {
                key += std::to_string(i) + "," + std::to_string(j) + "/";
            }
        }
    }
    return key;
}

void shift_grid_with_cycles(std::vector<std::string>& grid) {
    std::unordered_map<std::string, int> grids;

    // First find after how many cycles the grid repeats itself
    bool finding_repeat = true;
    int start_of_repeat;
    int repeat_length;

    int i = 0;

    while (++i > 0) {
        shift_grid(grid, -1, 0); // north
        shift_grid(grid, 0, -1); // west
        shift_grid(grid, 1,  0); // south
        shift_grid(grid, 0,  1); // east

        if (finding_repeat) {
            std::string key = construct_key(grid);
            if (grids.find(key) != grids.end()) {
                // repeat found
                start_of_repeat = i;
                repeat_length = i - grids[key];
                finding_repeat = false;
            }
            grids[key] = i; // value is the number of cycles when it first appears
        } else if ((i - start_of_repeat) % repeat_length == (1000000000 - start_of_repeat) % repeat_length) {
            // continue cycling until the 1 billionth cycle's position
            break;
        }
    }
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    std::vector<std::string> part1_grid = input;
    std::vector<std::string> part2_grid = input;

    int part1 = 0, part2 = 0;

    shift_grid(part1_grid, -1, 0);
    part1 = calculate_load(part1_grid);

    shift_grid_with_cycles(part2_grid);
    part2 = calculate_load(part2_grid);

    std::cout << part1 << std::endl; // 112048
    std::cout << part2 << std::endl; // 105606

    return 0;
}
