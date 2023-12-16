#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <unordered_map>

void energise_grid(const std::vector<std::string>& grid, int i, int j, int di, int dj, 
                 std::unordered_map<std::string, std::vector<std::pair<int, int>>>& visited) {

    std::string key = std::to_string(i) + "," + std::to_string(j);
    if (visited.find(key) != visited.end()) {
        for (std::pair<int, int> dirs : visited[key]) {
            // return when we encounter the same tile and the same velocity
            if (dirs.first == di && dirs.second == dj) {
                return;
            }
        }
    }
    
    visited[key].emplace_back(std::make_pair(di, dj));

    int a = i + di;
    int b = j + dj;

    // reached an edge
    if (a == -1 || b == -1 || a == grid.size() || b == grid[0].length()) {
        return;
    }

    char c = grid[a][b];

    if (c == '.') {
        energise_grid(grid, a, b, di, dj, visited);
    } else if (c == '-') {
        if (std::abs(di) > 0) {
            // beam splits if going up/down
            energise_grid(grid, a, b, 0,  1, visited);
            energise_grid(grid, a, b, 0, -1, visited);
        } else {
            energise_grid(grid, a, b, di, dj, visited);
        }
    } else if (c == '|') {
        if (std::abs(dj) > 0) {
            // beam splits if going left/right
            energise_grid(grid, a, b, 1, 0, visited);
            energise_grid(grid, a, b, -1, 0, visited);
        } else {
            energise_grid(grid, a, b, di, dj, visited);
        }
    } else if (c == '/') {
        // going upwards -> go right
        if (di == -1) 
            energise_grid(grid, a, b, 0, 1, visited); 
        // going downwards -> go left
        else if (di == 1)
            energise_grid(grid, a, b, 0, -1, visited);
        // going left -> go downwards
        else if (dj == -1)
            energise_grid(grid, a, b, 1, 0, visited);
        // going right -> go upwards
        else
            energise_grid(grid, a, b, -1, 0, visited);

    } else if (c == '\\') {
        // going upwards -> go left
        if (di == -1) 
            energise_grid(grid, a, b, 0, -1, visited); 
        // going downwards -> go right
        else if (di == 1)
            energise_grid(grid, a, b, 0, 1, visited);
        // going left -> go upwards
        else if (dj == -1)
            energise_grid(grid, a, b, -1, 0, visited);
        // going right -> go downwards
        else
            energise_grid(grid, a, b, 1, 0, visited);
    }
}

int calculate_max_tiles(const std::vector<std::string> grid) {
    int max_tiles = 0;
    std::unordered_map<std::string, std::vector<std::pair<int, int>>> visited;

    // brute force it :)

    for (int i = 0; i < grid.size(); i++) {
        visited.clear();
        energise_grid(grid, i, -1, 0, 1, visited); // from the left
        max_tiles = std::max<int>(visited.size() - 1, max_tiles);

        visited.clear();
        energise_grid(grid, i, grid[0].size(), 0, -1, visited); // from the right
        max_tiles = std::max<int>(visited.size() - 1, max_tiles);
    }

    for (int j = 0; j < grid[0].size(); j++) {
        visited.clear();
        energise_grid(grid, -1, j, 1, 0, visited); // from the top
        max_tiles = std::max<int>(visited.size() - 1, max_tiles);

        visited.clear();
        energise_grid(grid, grid.size(), j, -1, 0, visited); // from the bottom
        max_tiles = std::max<int>(visited.size() - 1, max_tiles);
    }

    return max_tiles;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int part1 = 0, part2 = 0;
    std::unordered_map<std::string, std::vector<std::pair<int, int>>> visited;

    energise_grid(input, 0, -1, 0, 1, visited);
    part1 = visited.size() - 1;
    part2 = calculate_max_tiles(input);

    std::cout << part1 << std::endl; // 8116
    std::cout << part2 << std::endl; // 8383

    return 0;
}
