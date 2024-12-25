#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <unordered_map>

void parse_input(const std::vector<std::string>& input, std::unordered_map<std::string, std::vector<std::string>>& workflows,
                 std::vector<std::unordered_map<char, int>>& ratings) {

    bool parsing_workflows = true;

    for (const std::string& line : input) {
        if (line == "\r") {
            parsing_workflows = false;
            continue;
        }

        if (parsing_workflows) {
            int i = line.find('{');
            std::string workflow_name = line.substr(0, i);
            std::string rules_string = line.substr(i+1, line.length()-i-3);
            workflows[workflow_name] = split(rules_string, ',');
        } else {
            std::string line_without_braces = line.substr(1, line.length()-2);
            std::vector<std::string> terms = split(line_without_braces, ',');

            std::unordered_map<char, int> part;
            int rating_total = 0;
            for (std::string& t : terms) {
                char category = t[0];
                int value = std::stoi(t.substr(2));

                rating_total += value;
                part[category] = value;
            }
            part['T'] = rating_total;
            
            ratings.push_back(part);   
        }
    }
}

bool is_accepted(std::unordered_map<char, int> part, std::unordered_map<std::string, std::vector<std::string>>& workflows) {
    std::string current_workflow = "in";

    while (true) {
        if (current_workflow == "R") return false;
        if (current_workflow == "A") return true;

        for (std::string& rule : workflows[current_workflow]) {
            int i = rule.find(":");
            
            if (i != std::string::npos) {
                // condition found
                char category = rule[0];
                char operation = rule[1];
                int value = std::stoi(rule.substr(2, i-2));

                std::string next_workflow = rule.substr(i+1);
                if (operation == '<' && part[category] < value || operation == '>' && part[category] > value) {
                    current_workflow = next_workflow;
                    break;
                }
            } else {
                // no condition -> workflow name
                current_workflow = rule;
            }
        }
    }

    return false;
}

int64_t calculate_accepted_combinations(std::string current_workflow,
                                    std::unordered_map<std::string, std::vector<std::string>>& workflows, 
                                    std::unordered_map<char, std::pair<int, int>> rating_ranges) {

    int64_t combinations = 0;

    if (current_workflow == "R")
        return 0;

    // base case -> take the product of the ranges to get the combinations
    if (current_workflow == "A") {
        combinations = 1;
        for (auto& pair : rating_ranges) {
            std::pair<int, int> range = pair.second;
            combinations *= range.second - range.first + 1;
        }
        return combinations;
    }

    for (std::string& rule : workflows[current_workflow]) {
        int i = rule.find(":");
        
        if (i != std::string::npos) {
            // condition found
            char category = rule[0];
            char operation = rule[1];
            int value = std::stoi(rule.substr(2, i-2));

            std::string next_workflow = rule.substr(i+1);
            std::unordered_map<char, std::pair<int, int>> next_ranges = rating_ranges;

            if (operation == '<') {
                // assume it's true -> update next ranges for the next recursive call
                next_ranges[category] = std::make_pair(rating_ranges[category].first, value - 1);

                // assume it's false -> update the current range for the next rule for the current workflow
                rating_ranges[category].first = value;
            } else if (operation == '>') {
                // similar logic as above for the 'greater than' operation
                next_ranges[category] = std::make_pair(value + 1, rating_ranges[category].second);
                rating_ranges[category].second = value;
            }
            // recurse with the next workflow and next ranges
            combinations += calculate_accepted_combinations(next_workflow, workflows, next_ranges);
        } else {
            // no condition -> recurse with the next workflow (given by the rule)
            combinations += calculate_accepted_combinations(rule, workflows, rating_ranges);
        }
    }
    
    return combinations;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    std::unordered_map<std::string, std::vector<std::string>> workflows;
    std::vector<std::unordered_map<char, int>> ratings;

    int part1 = 0;
    int64_t part2 = 0;

    // Part 1
    parse_input(input, workflows, ratings);
    for (auto& part : ratings)
        if (is_accepted(part, workflows))
            part1 += part['T'];

    // Part 2
    std::unordered_map<char, std::pair<int, int>> rating_ranges{
        {'x', {1, 4000}},
        {'m', {1, 4000}},
        {'a', {1, 4000}},
        {'s', {1, 4000}}
    };
    part2 = calculate_accepted_combinations("in", workflows, rating_ranges);

    // Looked on the subreddit again for hints for Part 2

    std::cout << part1 << std::endl; // 402185
    std::cout << part2 << std::endl; // 130291480568730

    return 0;
}
