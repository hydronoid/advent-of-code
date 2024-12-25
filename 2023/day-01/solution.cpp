#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cctype>
#include <string>
#include <algorithm>

// This marks my first C++ program!

int get_calibration_value(std::string s) {
    int v1, v2 = 0;

    // searching for first value -> loop forwards
    for (int i = 0; i < s.length(); i++) {
        if (std::isdigit(s[i])) {
            v1 = s[i] - '0';
            break;
        }
    }
    // searching for last value -> loop backwards
    for (int i = s.length() - 1; i >= 0; i--) {
        if (std::isdigit(s[i])) {
            v2 = s[i] - '0';
            break;
        }
    }

    // convert 2 values into a string
    std::string calibration_value_string = std::to_string(v1) + std::to_string(v2);

    // return the integer equivalent
    return std::stoi(calibration_value_string);
}

int get_calibration_value_from_letters(std::string s) {
    std::string digit_words[10] = {"zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"};

    // positions of the first and last digits in the string
    size_t first_pos = 99;
    size_t last_pos = 0;

    int v1, v2 = 0;

    // search for "digit words"
    for (int i = 0; i < 10; i++) {
        std::string word = digit_words[i];
        size_t current_first_pos = s.find(word);
        size_t current_last_pos = s.rfind(word);

        if (current_first_pos != std::string::npos)  {
            if (current_first_pos < first_pos) {
                first_pos = current_first_pos;
                v1 = i;
            }
            if (current_last_pos > last_pos) {
                last_pos = current_last_pos;
                v2 = i;
            }
        }
    }

    // search for actual digits
    for (int i = 0; i < s.length(); i++) {
        if (std::isdigit(s[i])) {
            // digit found earlier than word -> set v1 to that digit
            if (i <= first_pos) 
                v1 = s[i] - '0'; 
            break;
        }
    }
    for (int i = s.length() - 1; i >= 0; i--) {
        if (std::isdigit(s[i])) {
            // digit found later than word -> set v2 to that digit
            if (i >= last_pos)
                v2 = s[i] - '0';
            break;
        }
    }
    
    // concatenate the two values, then convert to int
    std::string calibration_value_string = std::to_string(v1) + std::to_string(v2);
    return std::stoi(calibration_value_string);
}


int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");
    
    int part1, part2 = 0;
    for (const std::string& line : input) {
        part1 += get_calibration_value(line);
        part2 += get_calibration_value_from_letters(line);
    }

    std::cout << part1 << std::endl; // 55002
    std::cout << part2 << std::endl; // 55093

    return 0;
}
