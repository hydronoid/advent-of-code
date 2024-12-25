#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <map>

std::vector<std::pair<int, int>> get_neighbours(std::vector<std::string>& grid, std::pair<int, int> location, bool slope) {
    int row = location.first;
    int col = location.second;
    char c = grid[row][col];

    if (slope) {
        if      (c == '>') return {{row, col+1}};
        else if (c == 'v') return {{row+1, col}};
        else if (c == '<') return {{row, col-1}};
        else if (c == '^') return {{row-1, col}};
    }

    int directions[4][2] = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};

    std::vector<std::pair<int, int>> neighbours;

    for (auto& dir : directions) {
        int a = row + dir[0];
        int b = col + dir[1];

        if (0 <= a && a < grid.size() && 0 <= b && b < grid[0].length() && grid[a][b] != '#')
            neighbours.emplace_back(a, b);
    }

    return neighbours;
}

void dfs(std::vector<std::string>& grid,
         std::map<std::pair<int, int>, std::map<std::pair<int, int>, int>>& dists,
         std::pair<int, int> loc, 
         std::vector<std::vector<bool>>& visited, 
         int length,
         int& longest_path) {
                    
    if (visited[loc.first][loc.second])
        return;

    if (loc.first == grid.size()-1 && loc.second == grid[0].length()-3)
        longest_path = std::max(longest_path, length);
    

    visited[loc.first][loc.second] = true;

    if (dists.empty()) {
        // Part 1
        for (auto& neighbour : get_neighbours(grid, loc, true))
            dfs(grid, dists, neighbour, visited, length + 1, longest_path);
    } else {

        // Part 2
        for (auto& [neighbour, dist] : dists[loc])
            dfs(grid, dists, neighbour, visited, length + dist, longest_path);
    }
    
    visited[loc.first][loc.second] = false;
}

std::map<std::pair<int, int>, std::map<std::pair<int, int>, int>> condense_grid(std::vector<std::string>& grid) {
    std::map<std::pair<int, int>, std::map<std::pair<int, int>, int>> dists;
    for (int i = 0; i < grid.size(); i++) {
        for (int j = 0; j < grid[0].length(); j++) {
            if (grid[i][j] != '#') {
                std::vector<std::pair<int, int>> neighbours = get_neighbours(grid, {i, j}, false);
                for (auto& loc : neighbours)
                    dists[{i, j}][loc] = 1; // set dists to 1
            }
        }
    }

    // condense the graph by combining nodes that have only 2 edges
    // (resulting nodes are only junctions, or the start/end)
    for (auto it = dists.begin(); it != dists.end();) {
        auto& [b, neighbours] = *it;

        if (neighbours.size() == 2) {
            // a-b-c (b is between a and c)
            std::pair<int, int> a = neighbours.begin()->first;  // neighbour 1 
            std::pair<int, int> c = neighbours.rbegin()->first; // neighbour 2

            // combine a->b and b->c into one distance, from a->c / c->a
            int new_dist = dists[a][b] + dists[b][c];

            // add new edges from c->a and a->c
            dists[a][c] = new_dist;
            dists[c][a] = new_dist;

            dists[a].erase(dists[a].find(b)); // remove edge from a to b
            dists[c].erase(dists[c].find(b)); // remove edge from c to b


            
            // finally remove node b from the graph
            it = dists.erase(it);
        } else {
            ++it;
        }
    }

    return dists;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    std::vector<std::vector<bool>> visited(input.size(), std::vector<bool>(input[0].size(), false));

    int part1 = 0, part2 = 0;
    
    std::map<std::pair<int, int>, std::map<std::pair<int, int>, int>> dists;

    dfs(input, dists, {0, 1}, visited, 0, part1);

    dists = condense_grid(input);
    dfs(input, dists, {0, 1}, visited, 0, part2);

    std::cout << part1 << std::endl; // 2306
    std::cout << part2 << std::endl; // 6718

    return 0;
}
