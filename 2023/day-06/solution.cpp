#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>

int parse_input(const std::vector<std::string> input, std::vector<int>& times, std::vector<int>& dists) {
    std::vector<std::string> time_terms = split(input[0]);
    std::vector<std::string> dist_terms = split(input[1]);

    for (int i = 1; i < time_terms.size(); i++) {
        times.push_back(std::stoi(time_terms[i]));
        dists.push_back(std::stoi(dist_terms[i]));
    }

    // number of races
    return time_terms.size() - 1;
}

int64_t parse_longer_race(std::string line) {
    // from after the colon, remove the spaces, then convert the result to an int64
    std::string nums = line.substr(line.find(':') + 1); 
    nums.erase(std::remove_if(nums.begin(), nums.end(), ::isspace), nums.end());

    return std::stoll(nums);
}

int64_t calculate_distance_travelled(int64_t seconds_pressed, int64_t time_allowed) {
    return seconds_pressed * (time_allowed - seconds_pressed);
}

int calculate_ways_to_beat_record(int time, int64_t distance) {
    int ways = 0;
    for (int i = 0; i < time; i++)
        ways += (calculate_distance_travelled(i, time) > distance);

    return ways;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");
    
    // Part 1
    int part1 = 1;
    std::vector<int> times;
    std::vector<int> dists;

    int num_races = parse_input(input, times, dists);
    for (int i = 0; i < num_races; i++)
        part1 *= calculate_ways_to_beat_record(times[i], dists[i]);

    // Part 2
    int     actual_time = parse_longer_race(input[0]);
    int64_t actual_dist = parse_longer_race(input[1]);
    int part2 = calculate_ways_to_beat_record(actual_time, actual_dist);


    /*
    I did become aware that this problem could be solved using the quadratic formula while doing part 2,
    but I tried brute force first anyway to see how it fared, and it ran quite quickly anyway ¯\_(ツ)_/¯
    */

    std::cout << part1 << std::endl; // 2065338
    std::cout << part2 << std::endl; // 34934171

    return 0;
}
