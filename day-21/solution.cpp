#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <queue>
#include <map>

std::vector<std::pair<int, int>> get_neighbours(std::vector<std::string>& grid, std::pair<int, int> location) {
    int directions[4][2] = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};

    std::vector<std::pair<int, int>> neighbours;

    for (auto& dir : directions) {
        int a = location.first + dir[0];
        int b = location.second + dir[1];

        if (0 <= a && a < grid.size() && 0 <= b && b < grid[0].length() && grid[a][b] != '#')
            neighbours.emplace_back(a, b);
    }
    return neighbours;
}

std::pair<int, int> find_start(std::vector<std::string>& grid) {
    for (int i = 0; i < grid.size(); i++)
        for(int j = 0; j < grid[0].length(); j++)
            if (grid[i][j] == 'S')
                return std::make_pair(i, j);
    return std::make_pair(-1, -1);
}

int bfs(std::vector<std::string>& grid, int steps) {
    std::pair<int, int> start = find_start(grid);
    std::map<std::pair<int, int>, int> dists;
    std::vector<int> reachable = std::vector<int>(steps + 1, 0);
    std::queue<std::pair<int, int>> q;

    dists[start] = 0;
    q.push(start);

    while (!q.empty()) {
        std::pair<int, int> loc = q.front();
        q.pop();

        reachable[dists[loc]] += 1;

        if (dists[loc] == steps + 1) 
            break;

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

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int part1 = 0, part2 = 0;

    part1 = bfs(input, 64);


    std::cout << part1 << std::endl; // 3639
    std::cout << part2 << std::endl; //

    return 0;
}
