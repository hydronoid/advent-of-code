#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <algorithm>
#include <map>
#include <unordered_set>
#include <queue>

struct brick {
    int x1, y1, z1;
    int x2, y2, z2;
    std::unordered_set<int> supported_by;

    bool operator<(const brick& other) const {
        return std::tie(z1, z2, y1, y2, x1, x2) < std::tie(other.z1, other.z2, other.y1, other.y2, other.x1, other.x2);
    };
};

brick parse_line(const std::string& line) {
    brick b;
    sscanf(line.c_str(), "%d,%d,%d~%d,%d,%d", &b.x1, &b.y1, &b.z1, &b.x2, &b.y2, &b.z2);
    return b;
}

void drop_bricks(std::vector<brick>& bricks) {
    std::map<std::pair<int, int>, std::pair<int, int>> highest_z; // maps (x, y) to (highest z seen, idx of corresponding brick)

    // sort bricks by ascending z
    std::sort(bricks.begin(), bricks.end());

    for (int i = 0; i < bricks.size(); i++) {
        brick& b = bricks[i];
        int max_occupied_z = 0;

        // find the max occupied z for the current brick's (x, y) coordinates
        for (int x = b.x1; x <= b.x2; x++) {
            for (int y = b.y1; y <= b.y2; y++) {
                // if the highest z isn't at ground level, update max_occupied_z and the supported_by set
                if (highest_z.find({x, y}) != highest_z.end()) {
                    auto& [z, below_brick_idx] = highest_z[{x, y}];

                    if (z > max_occupied_z) {
                        max_occupied_z = z;
                        b.supported_by = {below_brick_idx};
                    } else if (z == max_occupied_z) {
                        b.supported_by.insert(below_brick_idx);
                    }
                }
            }
        }

        // update the map, after finding the max z
        for (int x = b.x1; x <= b.x2; x++) {
            for (int y = b.y1; y <= b.y2; y++) {
                int z_diff = b.z2 - b.z1; // if the brick is a tall brick, take into account its height

                highest_z[{x, y}].first = max_occupied_z + z_diff + 1;
                highest_z[{x, y}].second = i;
            }
        }
    }
}

int fallen_bricks(const std::vector<brick>& bricks, int brick_to_remove_idx) {
    std::vector<int> num_supported_by(bricks.size(), 0);
    std::vector<std::vector<int>> supports(bricks.size()); // opposite of supported_by (if A is supported by B, then B supports A)

    for (int i = 0; i < bricks.size(); i++) {
        num_supported_by[i] = bricks[i].supported_by.size();
        for (int j : bricks[i].supported_by) {
            supports[j].push_back(i);
        }
    }

    int fallen = -1;
    
    std::queue<int> q;
    q.push(brick_to_remove_idx);

    while (!q.empty()) {
        int i = q.front();   
        q.pop();
        fallen++;
        
        // brick i has fallen, so decrement the the 'num_supported_by' values for each brick j it used to rest below
        for (int j : supports[i]) {
            num_supported_by[j]--;
            if (num_supported_by[j] == 0) 
                q.push(j); // brick j is going to fall, as it has no support -> check if it will affect others
        }
    }

    return fallen;
}

int num_bricks_safe_to_disintegrate(std::vector<brick>& bricks) {
    std::unordered_set<int> cannot_disintegrate;

    // if brick X is supported by only 1 brick, brick Y, then brick Y cannot be disintegrated
    for (brick& b : bricks)
        if (b.supported_by.size() == 1)
            cannot_disintegrate.insert(*b.supported_by.begin());

    // so the ones that are safe to disintegrate is just the complement
    return bricks.size() - cannot_disintegrate.size();
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int part1 = 0, part2 = 0;

    std::vector<brick> bricks;
    for (const std::string& line : input)
        bricks.push_back(parse_line(line));

    drop_bricks(bricks);

    part1 = num_bricks_safe_to_disintegrate(bricks);
    for (int i = 0; i < bricks.size(); i++)
        part2 += fallen_bricks(bricks, i);

    // Learned a lot again by taking inspiration from the subreddit today

    std::cout << part1 << std::endl; // 409
    std::cout << part2 << std::endl; // 61097

    return 0;
}
