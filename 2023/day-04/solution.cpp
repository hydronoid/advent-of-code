#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <cmath>
#include <numeric> 

int parse_card(std::string line) {
    int card_num;

    std::vector<std::string> nums = split(line);
    std::vector<int> winning_nums;

    bool processing_winning_nums = true;
    int num_matches = 0;

    for (int i = 2; i < nums.size(); i++) {
        if (nums[i] == "|") {
            processing_winning_nums = false;
            continue;
        }

        if (processing_winning_nums) {
            winning_nums.push_back(std::stoi(nums[i]));
        } else {
            int drawn_num = std::stoi(nums[i]);
            for (int j = 0; j < winning_nums.size(); j++)
                if (winning_nums[j] == drawn_num)
                    num_matches++;
        }
    }

    return num_matches;
}

int calculate_scratchcards(int card_matches[], int size) {
    std::vector<int> card_instances = std::vector<int>(size, 1); // 1 for original

    for (int i = 0; i < size; i++) {
        int num_matches = card_matches[i];
        
        for (int j = i+1; j < i+1+num_matches; j++) {
            card_instances[j] += card_instances[i];
        }
    }
    return std::accumulate(card_instances.begin(), card_instances.end(), 0);
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");
    int n = input.size();

    int part1 = 0, part2 = 0;
    int card_matches[n];

    for (int i = 0; i < n; i++) {
        int num_matches = parse_card(input[i]);
        part1 += std::pow(2, num_matches-1);
        card_matches[i] = num_matches;
    }

    part2 = calculate_scratchcards(card_matches, n);

    std::cout << part1 << std::endl; // 27059
    std::cout << part2 << std::endl; // 5744979

    return 0;
}
