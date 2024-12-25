#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>

struct block {
    int row;
    int col;
    int heat_loss; // priority / weight
    int row_delta; 
    int col_delta; 

    block(int row, int col, int heat_loss, int row_delta, int col_delta) : 
        row(row), col(col), 
        heat_loss(heat_loss), 
        row_delta(row_delta), col_delta(col_delta) {}

    bool operator<(const block& other) const {
        return heat_loss > other.heat_loss; // > for min heap use in PQ
    }
};

std::vector<std::vector<int>> convert_input_to_ints(const std::vector<std::string>& input) {
    std::vector<std::vector<int>> grid;

    for (int i = 0; i < input.size(); i++) {
        grid.push_back(std::vector<int>());
        for (char c : input[i]) {
            if (std::isdigit(c))
                grid[i].push_back(c - '0');
        }
    }

    return grid;
}

std::string construct_key(block b) {
    return std::to_string(b.row) + "," + std::to_string(b.col) + "," + std::to_string(b.row_delta) + "," + std::to_string(b.col_delta);
}

int least_heat(const std::vector<std::vector<int>>& grid, int min_moves, int max_moves) {
    const int rows = grid.size();
    const int cols = grid[0].size();

    std::unordered_set<std::string> visited;

    int directions[4][2] = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};

    std::priority_queue<block> pq;
    pq.emplace(0, 0, 0, 0, 0);

    while (!pq.empty()) {
        block b1 = pq.top();
        pq.pop();
        
        std::string b1_key = construct_key(b1);

        // location & direction has already been visited in a cheaper manner, due to min heap
        if (visited.find(b1_key) != visited.end())
            continue;

        // end location
        if (b1.row == rows-1 && b1.col == cols-1)
            return b1.heat_loss;
        
        visited.insert(b1_key);

        for (auto& d : directions) {
            // only consider orthogonal directions
            if ((d[0] == b1.row_delta && d[1] == b1.col_delta) || (d[0] == -b1.row_delta && d[1] == -b1.col_delta))
                continue;

            int heat_loss_accumulated = b1.heat_loss;

            int r = b1.row;
            int c = b1.col;

            // head from b1 in direction d, whilst accumulating the heat loss
            for (int i = 1; i <= max_moves; i++) {
                r += d[0];
                c += d[1];
                
                // if it's within grid bounds, add heat loss of the new cell
                // and for part 2 - put it in the PQ if it meets the minimum length 
                if (0 <= r && r < rows && 0 <= c && c < cols) {
                    heat_loss_accumulated += grid[r][c];
                    if (i >= min_moves)
                        pq.emplace(r, c, heat_loss_accumulated, d[0], d[1]);
                }
            }
        }
    }

    return 0;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");
    std::vector<std::vector<int>> grid = convert_input_to_ints(input);

    int part1 = 0, part2 = 0;

    part1 = least_heat(grid, 1, 3);
    part2 = least_heat(grid, 4, 10);

    /*
    Got quite stuck on this puzzle again, and had to rely on the subreddit again.
    I knew it was a pathfinding problem with a PQ / Dijkstra's,
    but I couldn't figure out how to properly account for the "max 3 steps" part
    */

    std::cout << part1 << std::endl; // 755
    std::cout << part2 << std::endl; // 881

    return 0;
}
