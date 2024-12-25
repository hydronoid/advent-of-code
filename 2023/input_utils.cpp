#include "input_utils.h"
#include <iostream>
#include <fstream>
#include <sstream>

std::vector<std::string> read_file_to_array(const std::string& file_name) {
    std::ifstream file(file_name);

    if (!file.is_open()) {
        std::cerr << "Error opening file: " << file_name << std::endl;
        return {};
    }

    std::vector<std::string> lines;
    std::string line;

    while (std::getline(file, line)) {
        lines.push_back(line);
    }

    file.close();

    return lines;
}

// split based on a delimiter
std::vector<std::string> split(const std::string& s, char delimiter) {
    std::vector<std::string> tokens;
    std::istringstream stream(s);
    std::string token;

    while (std::getline(stream, token, delimiter)) {
        tokens.push_back(token);
    }

    return tokens;
}

// split based on whitespace
std::vector<std::string> split(const std::string& s) {
    std::vector<std::string> tokens;
    std::istringstream stream(s);
    std::string token;

    while (stream >> token) {
        tokens.push_back(token);
    }

    return tokens;
}
