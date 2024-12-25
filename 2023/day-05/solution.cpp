#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <limits>

struct map {
    long long dest_start;
    long long src_start;
    long long range_length;
};

std::vector<std::vector<map>> parse_input(std::vector<std::string> input, std::vector<long long>& seeds) {
    std::vector<std::vector<map>> maps;

    int map_no = -1;

    for (const std::string& line : input) {
        // empty line indicates the start of a new map to parse
        if (line == "\r" || line == "\0") {
            map_no++;
            maps.push_back(std::vector<map>());
            continue;
        }

        std::vector<std::string> terms = split(line);

        // initial seeds
        if (terms[0] == "seeds:") {
            for (int i=1; i<terms.size(); i++) {
                seeds.push_back(std::stoll(terms[i]));
            }
        } 
        // map info (dest start, src start, range length)
        else if (std::isdigit(line[0])) {
            map m{
                std::stoll(terms[0]), 
                std::stoll(terms[1]), 
                std::stoll(terms[2])
            };
            maps[map_no].push_back(m);
        } 
    }
    return maps;
}

long long get_location_number(long long seed, std::vector<std::vector<map>>& maps) {
    long long curr_num = seed;

    for (std::vector<map>& category : maps) {
        for (map& m : category) {
            if (m.src_start <= curr_num && curr_num < m.src_start+m.range_length) {
                curr_num = m.dest_start + (curr_num - m.src_start);
                break;
            }
        }
    }
    return curr_num;
}

long long get_seed_from_location(long long location, std::vector<std::vector<map>>& maps) {
    // just the reverse of the above function
    long long curr_num = location;
    for (auto category = maps.rbegin(); category != maps.rend(); category++) {
        for (map m : *category) {
            if (m.dest_start <= curr_num && curr_num < m.dest_start + m.range_length) {
                curr_num = m.src_start + (curr_num - m.dest_start);
                break;
            }
        }
    }
    return curr_num;
}

bool is_initial_seed(long long seed_number, std::vector<long long>& seeds) {
    for (int i = 0; i < seeds.size() - 1; i += 2) {
        long long seed_start = seeds[i];
        long long seed_end = seed_start + seeds[i+1];
        if (seed_start <= seed_number && seed_number < seed_end)
            return true;
    }
    return false;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");
    std::vector<long long> seeds;
    std::vector<std::vector<map>> maps = parse_input(input, seeds);

    long long part1 = std::numeric_limits<long long>::max();

    for (long long s : seeds) {
        long long location = get_location_number(s, maps);
        part1 = std::min<long long>(location, part1);
    }
    
    // takes about 35 seconds to run, brute force
    long long part2 = 0;
    while (++part2 > 0) {
        long long s = get_seed_from_location(part2, maps);
        if (is_initial_seed(s, seeds))
            break;
    }

    // Today was the first day I looked on the subreddit for hints (specifically, for part 2)
    std::cout << part1 << std::endl; // 484023871
    std::cout << part2 << std::endl; // 46294175

    return 0;
}
