#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <unordered_map>
#include <numeric>

std::string parse_input(const std::vector<std::string> input, std::unordered_map<std::string, std::pair<std::string, std::string>>& network) {
    std::string moves = input[0];

    for (int i = 2; i < input.size(); i++) {
        std::vector<std::string> terms = split(input[i]);

        std::string start_node = terms[0];
        std::string left_child = terms[2].substr(1, 3);
        std::string right_child = terms[3].substr(0, 3);
        
        network[start_node] = std::make_pair(left_child, right_child);
    }   
    return moves;
}

int navigate_network(std::unordered_map<std::string, std::pair<std::string, std::string>> network, 
                   std::string moves,
                   std::string start_node,
                   bool (*end_condition) (std::string)) {
    
    std::string current_node = start_node;

    int num_moves = 0;
    while (++num_moves > 0) {
        int move_index = (num_moves - 1) % moves.length();
        char move = moves[move_index];

        if (move == 'L')    current_node = network[current_node].first;
        else                current_node = network[current_node].second;

        if (end_condition(current_node))
            break;
    }

    // return the number of moves it takes to satisfy the end condition
    return num_moves;
}

std::vector<std::string> find_start_nodes(std::unordered_map<std::string, std::pair<std::string, std::string>> network) {
    std::vector<std::string> start_nodes;

    for (const auto& pair : network) {
        const std::string& key = pair.first;
        if (key[2] == 'A'){
            start_nodes.push_back(key);
        }   
    }

    return start_nodes;
}

int64_t calculate_lcm(const std::vector<int>& numbers) {
    int64_t result = numbers[0];
    
    for (int i = 1; i < numbers.size(); ++i) {
        result = std::lcm(result, numbers[i]);
    }
    return result;
}

int64_t simultaneous_navigation(std::unordered_map<std::string, std::pair<std::string, std::string>> network, std::string moves) {
    std::vector<std::string> current_nodes = find_start_nodes(network); // nodes starting with 'A'
    std::vector<int> least_moves; // least amount of moves to reach ending node Z for each start node

    for (std::string start_node : current_nodes) {
        int num_moves = navigate_network(network, moves, start_node, [](std::string end_node) { return end_node[2] == 'Z'; });
        least_moves.push_back(num_moves);
    }

    int64_t lcm = calculate_lcm(least_moves);

    return lcm;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");
    std::unordered_map<std::string, std::pair<std::string, std::string>> network;
    std::string moves;

    int     part1 = 0;
    int64_t part2 = 0;

    moves = parse_input(input, network);
    part1 = navigate_network(network, moves, "AAA", [](std::string end_node) { return end_node == "ZZZ"; });
    part2 = simultaneous_navigation(network, moves);

    std::cout << part1 << std::endl; // 16697
    std::cout << part2 << std::endl; // 10668805667831

    return 0;
}
