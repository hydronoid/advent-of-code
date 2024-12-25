#ifndef INPUT_UTILS_H
#define INPUT_UTILS_H

#include <vector>
#include <string>

std::vector<std::string> read_file_to_array(const std::string& file_name);


std::vector<std::string> split(const std::string& s, char delimiter);
std::vector<std::string> split(const std::string& s);

#endif