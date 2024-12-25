#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>

struct location {
    int i; // row
    int j; // col
};

struct part_number {
    int number;
    location loc; // location of the rightmost digit
};

void parse_line(int i, std::string s, std::vector<location>& symbol_locs, std::vector<part_number>& parts) {
    std::string current_num = "";

    // j <= s.length() to ensure numbers at the end of a line are added
    for (int j = 0; j <= s.length(); j++) {
        // parse number
        if (std::isdigit(s[j])) {
            current_num += s[j];
        } 
        
        else {
            // end of number
            if (current_num.length() > 0) {
                part_number p;
                p.number = std::stoi(current_num);
                p.loc = {i, j-1};
                parts.push_back(p);
                current_num = "";
            }   

            // dot
            if (s[j] == '.') {
                continue;
            } 
            
            // symbol
            if (s[j] != '\r' && s[j] != '\0') {
                location l{i, j};
                symbol_locs.push_back(l);
            }
        }           
    }
}

bool number_is_adjacent(part_number p, location symbol_loc) {
    // calculate length to account for the leftmost digit as well
    int len = std::to_string(p.number).length();

    return std::abs(p.loc.i - symbol_loc.i) <= 1 && 
        (std::abs(p.loc.j-len+1 - symbol_loc.j) <= 1 || 
         std::abs(p.loc.j - symbol_loc.j) <= 1);
}

int calculate_part_number_sum(std::vector<location>& symbol_locs, std::vector<part_number>& parts) {
    int part_number_sum = 0;
    for (part_number p : parts) {
        for (location l : symbol_locs) {
            if (number_is_adjacent(p, l)) {
                part_number_sum += p.number;
            }
        }
    }
    return part_number_sum;
}

int calculate_gear_ratio_sum(std::vector<std::string> schematic, std::vector<location>& symbol_locs, std::vector<part_number>& parts) {
    int gear_ratio_sum = 0;
    for (location l : symbol_locs) {
        if (schematic[l.i][l.j] == '*') {
            int n1 = 0, n2 = 0;
            for (part_number p : parts) {
                if (number_is_adjacent(p, l)) {
                    if (n1 == 0) n1 = p.number;
                    else n2 = p.number;
                }
            }
            gear_ratio_sum += n1 * n2;
        }
    }
    return gear_ratio_sum;
}


int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    std::vector<location> symbol_locs;
    std::vector<part_number> parts;

    int i = 0;
    for (const std::string& line : input) {
        parse_line(i, line, symbol_locs, parts);
        i++;
    }
    int part1 = calculate_part_number_sum(symbol_locs, parts);
    int part2 = calculate_gear_ratio_sum(input, symbol_locs, parts);

    std::cout << part1 << std::endl; // 557705
    std::cout << part2 << std::endl; // 84266818

    return 0;
}
