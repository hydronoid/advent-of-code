#include "../input_utils.h"

#include <iostream>
#include <vector>

std::vector<std::pair<int, int>> parse_input(const std::vector<std::string>& input, bool convert_hex) {
    std::vector<std::pair<int, int>> vertices;

    int x = 0;
    int y = 0;
    vertices.emplace_back(0, 0);

    for (const std::string& line : input) {
        std::vector<std::string> terms = split(line);
        char dir;
        int dist;

        if (convert_hex) {
            char last_digit = terms[2][terms[2].length()-2];
            if      (last_digit == '0') dir = 'R';
            else if (last_digit == '1') dir = 'D';
            else if (last_digit == '2') dir = 'L';
            else if (last_digit == '3') dir = 'U';

            std::string hex_string = terms[2].substr(2, 5);
            dist = std::stoi(hex_string, nullptr, 16);
        } else {
            dir = terms[0][0];
            dist = std::stoi(terms[1]);
        }

        if      (dir == 'R') x += dist;
        else if (dir == 'L') x -= dist;
        else if (dir == 'U') y += dist;
        else if (dir == 'D') y -= dist;
    
        vertices.emplace_back(x, y);
    }

    return vertices;
}

int64_t calculate_lava_volume(std::vector<std::pair<int, int>>& vertices) {
    int64_t sum1 = 0;
    int64_t sum2 = 0;

    int64_t perimeter = 0; // boundary points
    
    for (int i = 0; i < vertices.size() - 1; i++) {
        sum1 += static_cast<int64_t>(vertices[i].first) * vertices[i+1].second;
        sum2 += static_cast<int64_t>(vertices[i].second) * vertices[i+1].first;

        perimeter += std::abs(vertices[i].first - vertices[i+1].first);   // x diff
        perimeter += std::abs(vertices[i].second - vertices[i+1].second); // y diff (one diff will always be 0)
    }

    int64_t shoelace_area = 0.5 * std::abs(sum1 - sum2);

    return shoelace_area + perimeter/2 + 1;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");
    int64_t part1 = 0, part2 = 0;

    std::vector<std::pair<int, int>> vertices = parse_input(input, false);
    part1 = calculate_lava_volume(vertices);

    std::vector<std::pair<int, int>> updated_vertices = parse_input(input, true);
    part2 = calculate_lava_volume(updated_vertices);

    /*
    Got stuck again when the shoelace formula directly didn't work,
    so I relied on the subreddit again. Turns out the puzzle answer was not the area,
    but the number of boundary points + interior points (as demonstrated by the question)
    */

    std::cout << part1 << std::endl; // 46334
    std::cout << part2 << std::endl; // 102000662718092

    return 0;
}
