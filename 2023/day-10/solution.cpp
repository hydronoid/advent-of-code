#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <map>
#include <queue>

bool can_come_from(std::pair<int, int> a, std::pair<int, int> b, char b_pipe) {

    // returns true if you can move to b from a
    if (b_pipe == 'S') {
        return true;
    } else if (b_pipe == '|') {
        return std::abs(a.first - b.first) == 1;
    } else if (b_pipe == '-') {
        return std::abs(a.second - b.second) == 1;
    } else if (b_pipe == 'L') {
        return a.first == b.first - 1 || a.second == b.second + 1;
    } else if (b_pipe == 'J') {
        return a.first == b.first - 1 || a.second == b.second - 1;
    } else if (b_pipe == '7') {
        return a.first == b.first + 1 || a.second == b.second - 1;
    } else if (b_pipe == 'F') {
        return a.first == b.first + 1 || a.second == b.second + 1;
    }

    return false;
}


std::pair<int, int> parse_input(const std::vector<std::string> input, 
        std::map<std::pair<int, int>, std::vector<std::pair<int, int>>>& tiles) {

    std::pair<int, int> start; // location of S

    for (int i = 0; i < input.size(); i++) {
        for (int j = 0; j < input[0].length(); j++) {
            char pipe = input[i][j];
            std::pair<int, int> curr_pipe{i, j};

            std::vector<std::pair<int, int>> neighbours;

            std::pair<int, int> u{i-1, j};
            std::pair<int, int> d{i+1, j};
            std::pair<int, int> l{i, j-1};
            std::pair<int, int> r{i, j+1};

            // connects up
            if (pipe == '|' || pipe == 'L' || pipe == 'J' || pipe == 'S') {
                if (0 <= i-1 && i-1 < input.size() && can_come_from(curr_pipe, u, input[i-1][j])) {
                    neighbours.push_back(u);
                }
            }

            // connects down
            if (pipe == '|' || pipe == '7' || pipe == 'F' || pipe == 'S') {
                if (0 <= i+1 && i+1 < input.size() && can_come_from(curr_pipe, d, input[i+1][j])) {
                    neighbours.push_back(d);
                }
            }

            // connects left
            if (pipe == '-' || pipe == 'J' || pipe == '7' || pipe == 'S') {
                if (0 <= j-1 && j-1 < input[0].size() && can_come_from(curr_pipe, l, input[i][j-1])) {
                    neighbours.push_back(l);
                }
            }

            // connects right
            if (pipe == '-' || pipe == 'L' || pipe == 'F' || pipe == 'S') {
                if (0 <= j+1 && j+1 < input[0].size() && can_come_from(curr_pipe, r, input[i][j+1])) {
                    neighbours.push_back(r);
                }
            }

            if (pipe == 'S') {
                start.first = i;
                start.second = j; 
            }

            if (pipe == '.' || neighbours.empty()) 
                continue;


            tiles[curr_pipe] = neighbours;
        }
    }
    return start;
}

int bfs(std::pair<int, int> start, 
        std::map<std::pair<int, int>, std::vector<std::pair<int, int>>> tiles,
        std::map<std::pair<int, int>, int>& dists) {
    
    std::queue<std::pair<int, int>> q;

    int max_dist = 0;
    dists[start] = 0;
    q.push(start);

    while (!q.empty()) {
        std::pair<int, int> loc = q.front();
        q.pop();

        for (auto& neighbour : tiles[loc]) {
            if (dists[neighbour] == 0) {
                q.push(neighbour);
                dists[neighbour] = dists[loc] + 1;
                max_dist = std::max(max_dist, dists[neighbour]);
            }
        }
    }
    
    return max_dist;
}

int find_enclosed_tiles(std::pair<int, int> start, 
                        std::vector<std::string> input, 
                        std::map<std::pair<int, int>, int>& dists) {
    int enclosed = 0;
    int rows = input.size();
    int cols = input[0].length();

    // hard coded replacement of S with actual pipe
    input[start.first][start.second] = '|';

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            // Point is part of the loop -> skip
            if (dists[{i, j}] > 0)
                continue;
            
            int crosses = 0;
            int a = i, b = j;

            // Travel diagonally southeast, counting the number of times you cross the loop
            while (a < rows && b < cols) {
                char c = input[a][b];

                // If we hit part of the loop, and it's not L or 7 (as they are collinear with the travelled path)
                if (dists[{a, b}] > 0 && (c != 'L' && c != '7'))
                    crosses++;

                a++;
                b++;
            }
            
            // Odd number of crosses means you are inside the shape
            if (crosses % 2 == 1)
                enclosed++;
        }
    }

    return enclosed;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");
    std::map<std::pair<int, int>, std::vector<std::pair<int, int>>> tiles;
    std::map<std::pair<int, int>, int> dists; 

    int part1 = 0, part2 = 0;

    std::pair<int, int> start = parse_input(input, tiles);

    
    part1 = bfs(start, tiles, dists);
    part2 = find_enclosed_tiles(start, input, dists);

    // I got very stuck on part 2 for a while, so I went on the subreddit for hints again
    // In particular, this one: https://www.reddit.com/r/adventofcode/comments/18evyu9/2023_day_10_solutions/kcqtow6/

    std::cout << part1 << std::endl; // 6738
    std::cout << part2 << std::endl; // 579

    return 0;
}
