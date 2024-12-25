#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <string>

int hash(std::string s) {
    int hash = 0;
    for (char c : s) { 
        hash += int(c);
        hash *= 17;
        hash %= 256;
    }
    return hash;
}

int find_lens_slot(std::vector<std::pair<std::string, int>> box, std::string label) {
    for (int i = 0; i < box.size(); i++)
        if (box[i].first == label)
            return i;
    return -1;
}

void print_boxes(std::vector<std::vector<std::pair<std::string, int>>> boxes) {
    int i = 1;
    for (auto& box : boxes) {
        if (box.empty())
            continue;
        
        std::cout << "Box " << i << ":";

        for (auto& pair : box) {
            std::cout << " [" << pair.first << " " << pair.second << "] ";
        }
        std::cout << "\n";
        i++;
    }
}

int calculate_focusing_power(std::vector<std::string> steps) {
    std::vector<std::vector<std::pair<std::string, int>>> boxes(256);

    // commence initialisation sequence
    for (std::string& s : steps) {
        int i = s.find_first_of("-=");
        
        std::string label = s.substr(0, i);
        int box_number = hash(label);
        int slot = find_lens_slot(boxes[box_number], label);

        char operation = s[i];
        if (operation == '-') {
            // found -> remove it
            if (slot != -1) {
                boxes[box_number].erase(boxes[box_number].begin() + slot);
            }
        } else if (operation == '=') {
            int focal_length = std::stoi(s.substr(i+1));

            if (slot != -1) {
                // lens exists with same label -> replace focal length
                boxes[box_number][slot].second = focal_length;
            } else {
                // lens doesn't exist -> add it to the box
                boxes[box_number].emplace_back(label, focal_length);
            }
        }

        // --- For debugging ---
        // std::cout << "After \"" << s << "\":\n";
        // print_boxes(boxes);
        // std::cout << "\n";
    }

    int total_focusing_power = 0;

    for (int i = 0; i < boxes.size(); i++)
        for (int j = 0; j < boxes[i].size(); j++)
            total_focusing_power += (i + 1) * (j + 1) * boxes[i][j].second;

    return total_focusing_power;
}

int main() {
    std::string input = read_file_to_array("input.txt")[0];
    int part1 = 0, part2 = 0;

    input.erase(input.length() - 1, 1); // remove '\r' from the end
    std::vector<std::string> steps = split(input, ',');

    for (std::string& s : steps) {
        part1 += hash(s);
    }

    part2 = calculate_focusing_power(steps);

    std::cout << part1 << std::endl; // 517965
    std::cout << part2 << std::endl; // 267372

    return 0;
}
