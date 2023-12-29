#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <queue>
#include <map>
#include <tuple>
#include <cmath>

std::vector<std::pair<int, int>> get_neighbours(std::vector<std::string>& grid, std::pair<int, int> location) {
    int directions[4][2] = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};

    std::vector<std::pair<int, int>> neighbours;

    for (auto& dir : directions) {
        int a = location.first + dir[0];
        int b = location.second + dir[1];

        if (0 <= a && a < grid.size() && 0 <= b && b < grid.size() && grid[a][b] != '#')
            neighbours.emplace_back(a, b);
    }
    return neighbours;
}

std::pair<int, int> find_start(const std::vector<std::string>& grid) {
    for (int i = 0; i < grid.size(); i++)
        for(int j = 0; j < grid.size(); j++)
            if (grid[i][j] == 'S')
                return std::make_pair(i, j);
    return std::make_pair(-1, -1);
}

int bfs(std::vector<std::string>& grid, int steps) {
    std::map<std::pair<int, int>, int> dists;
    std::vector<int> reachable = std::vector<int>(steps + 1, 0);
    std::queue<std::pair<int, int>> q;

    std::pair<int, int> start = find_start(grid);
    dists[start] = 0;
    q.push(start);

    while (!q.empty()) {
        std::pair<int, int> loc = q.front();
        q.pop();

        if (dists[loc] == steps + 1) 
            break;

        reachable[dists[loc]] += 1;

        for (auto& neighbour : get_neighbours(grid, loc)) {
            if (dists[neighbour] == 0) {
                q.push(neighbour);
                dists[neighbour] = dists[loc] + 1;
            }
        }
    }

    reachable[0] = 0;
    
    for (int i = 2; i <= steps; i++)
        reachable[i] += reachable[i-2];
    
    return reachable[steps];
}

int positive_remainder(int a, int b) {return (a % b + b) % b;}

std::vector<std::tuple<int, int, int, int>> get_multi_map_neighbours(const std::vector<std::string>& grid,
                                                                     std::tuple<int, int, int, int> location) {
    int directions[4][2] = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};
    std::vector<std::tuple<int, int, int, int>> neighbours;

    int len = grid.size(); // dimensions of the square grid
    auto& [row, col, tx, ty] = location;                                                             


    for (auto& dir : directions) {
        // unwrapped coordinates
        int r = row + dir[0];
        int c = col + dir[1];

        // wrapped around coordinates
        int a = positive_remainder(r, len);
        int b = positive_remainder(c, len);

        int new_tx = (r < 0) ? tx - 1 : tx + r / len;
        int new_ty = (c < 0) ? ty - 1 : ty + c / len;

        if (grid[a][b] != '#')
            neighbours.emplace_back(a, b, new_tx, new_ty);
    }

    return neighbours;
}

int multi_map_bfs(const std::vector<std::string>& grid, int steps) {
    std::map<std::tuple<int, int, int, int>, int> dists;
    std::vector<int> reachable = std::vector<int>(steps + 1, 0);
    std::queue<std::tuple<int, int, int, int>> q;

    std::pair<int, int> start = find_start(grid);
    dists[{start.first, start.second, 0, 0}] = 0;

    q.emplace(start.first, start.second, 0, 0); // store "map" coordinate (starts at 0,0), as well as tile coordinate 

    while (!q.empty()) {
        std::tuple<int, int, int, int> loc = q.front();
        q.pop();

        if (dists[loc] == steps + 1)
            break;

        reachable[dists[loc]] += 1;

        for (auto& neighbour : get_multi_map_neighbours(grid, loc)) {
            if (dists.find(neighbour) == dists.end()) {
                q.push(neighbour);
                dists[neighbour] = dists[loc] + 1;
            }
        }
    }

    for (int i = 2; i <= steps; i++)
        reachable[i] += reachable[i-2];

    return reachable[steps];
}

int64_t calculate_actual_reachable_plots(const std::vector<std::string>& grid, int64_t steps) {
    // from 3 points, we can work out the equation of the quadratic function
    int64_t f_0 = multi_map_bfs(grid, 65);
    int64_t f_1 = multi_map_bfs(grid, 65 + 131);
    int64_t f_2 = multi_map_bfs(grid, 65 + 131*2);

    // calculate coefficients a, b, c of the quadratic function f(x) = ax^2 + bx + c
    
    // f(0) = a*(0^2) + 0*b + c
    // f(0) = c
    int64_t c = f_0;
    
    // f(1) = a*(1^2) + 1*b + c 
    //      = a + b + c                                         (1)
    // f(2) = a*(2^2) + 2*b + c
    //      = 4a + 2b + c                                       (2)
    // 4f(1) = 4a + 4b + 4f(0)                                  (3)
    //
    // 4f(1) - f(2) = 4a - 4a + 4b - 2b + 4f(0) - f(0)          (3) - (2)
    //               = 2b + 3f(0)
    //             b = (4f(1) - f(2) - 3f(0)) / 2
    int64_t b = (4*f_1 - f_2 - 3*f_0) / 2;

    // f(1) = a + b + c                                         (1)
    // a = f(1) - b - c
    int64_t a = f_1 - b - c;

    int64_t x = (steps - 65) / 131;

    return a*std::pow(x, 2) + b*x + c;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int     part1 = 0;
    int64_t part2 = 0;

    part1 = bfs(input, 64);
    part2 = calculate_actual_reachable_plots(input, 26501365);

    // This (Part 2) was the last puzzle I completed in this year's Advent of Code, and was by far the hardest.
    // Relied heavily on this solution (which I found on the subreddit) to complete it.
    // https://github.com/derailed-dash/Advent-of-Code/blob/master/src/AoC_2023/Dazbo's_Advent_of_Code_2023.ipynb

    std::cout << part1 << std::endl; // 3639
    std::cout << part2 << std::endl; // 604592315958630

    return 0;
}
