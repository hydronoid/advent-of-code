#include <iostream>
#include <fstream>
#include <vector>

struct CubeSet {
    int red;
    int green;
    int blue;
};

struct Game {
    int id;
    std::vector<CubeSet> sets;
};

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

CubeSet parse_set(std::string set) {
    CubeSet cs{0, 0, 0};
    set += ","; // add colon to end to parse last cube (so str.find(",") will find it)

    size_t start = 0;
    size_t end = set.find(",");
    while (end != std::string::npos) {
        std::string current_cube = set.substr(start, end-start);

        // retrieve number of cubes & cube colour based on the position of the space
        size_t i = set.find(" ", start);
        int n_cubes = std::stoi(set.substr(start, i));
        std::string colour = set.substr(i+1, end-i-1);

        if (colour == "red") cs.red = n_cubes;
        else if (colour == "green") cs.green = n_cubes;
        else if (colour == "blue") cs.blue = n_cubes;

        start = end + 2;
        end = set.find(",", start);
    }

    return cs;
}


Game parse_game(std::string line) {
    Game g;
    
    sscanf(line.c_str(), "Game %d:", &g.id);
    size_t start = line.find(":") + 1;

    std::string sets = line.substr(start);
    size_t end = line.find(";");
    line += ";"; // add semicolon to end to parse last set

    while (end != std::string::npos) {
        std::string current_set = line.substr(start + 1, end-start-1);

        start = end + 1;
        end = line.find(";", start);

        CubeSet cs = parse_set(current_set);
        g.sets.push_back(cs);
    }

    return g;
}

int game_is_possible(Game g, int n_red, int n_green, int n_blue) {
    for (CubeSet s : g.sets) {
        if (s.red > n_red || s.green > n_green || s.blue > n_blue)
            return 0;
    }
    return g.id;
}

int calculate_power(Game g) {
    int max_red = 0, max_green = 0, max_blue = 0;

    for (CubeSet s : g.sets) {
        max_red = std::max(s.red, max_red);
        max_green = std::max(s.green, max_green);
        max_blue = std::max(s.blue, max_blue);
    }
    return max_red * max_green * max_blue;
}


int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");
    int part1 = 0, part2 = 0;
    for (const std::string& line : input) {
        Game g = parse_game(line);
        
        part1 += game_is_possible(g, 12, 13, 14);
        part2 += calculate_power(g);
        
    }

    std::cout << part1 << std::endl; // 2406
    std::cout << part2 << std::endl; // 78375

    return 0;
}