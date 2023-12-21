#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <algorithm>
#include <tuple>
#include <unordered_map>
#include <queue>
#include <numeric>

enum Pulse {
    low,
    high
};

struct module_info {
    std::vector<std::string> dest_modules;
    char prefix = ' ';
    bool state = false;                                 // off for flip-flip modules (%)
    std::unordered_map<std::string, Pulse> connections; // memory for conjunction modules (&)
};

std::unordered_map<std::string, module_info> parse_input(const std::vector<std::string>& input) {
    std::unordered_map<std::string, module_info> modules;

    for (const std::string& line : input) {
        int i = line.find('-');

        // remove the prefix when considering the name, unless it's the broadcaster module
        std::string module_name = (line[0] == 'b') ? line.substr(0, i-1) : line.substr(1, i-2);

        std::string dests_string = line.substr(i+3);
        // remove commas so we can split by spaces later
        dests_string.erase(std::remove(dests_string.begin(), dests_string.end(), ','), dests_string.end()); 

        modules[module_name] = {
            split(dests_string),
            line[0],
            false
        };
    }

    // initialise the memory for conjunction modules
    for (auto& pair : modules)
        for (std::string& dest : pair.second.dest_modules)
            if (modules[dest].prefix == '&')
                modules[dest].connections[pair.first] = low;

    return modules;
}

bool remembers_all_high(std::unordered_map<std::string, Pulse>& connections) {
    for (auto& pair : connections)
        if (pair.second != high)
            return false;
    return true;
}

std::unordered_map<std::string, int> simulate_button_press(std::unordered_map<std::string, module_info>& modules, 
                                                           std::string rx_parent="") {
                                                            
    std::queue<std::tuple<std::string, Pulse, std::string>> q;
    q.emplace("button", low, "broadcaster");

    // for part 1
    int low_pulses = 0;
    int high_pulses = 0;

    // for part 2
    std::unordered_map<std::string, int> observations; 

    while (!q.empty()) {
        auto [sender_module, incoming_pulse, curr_module] = q.front();
        q.pop();

        if (incoming_pulse == low) low_pulses++;
        else high_pulses++;

        Pulse outgoing_pulse = low;
        module_info m = modules[curr_module];
        
        if (m.prefix == '%') {
            if (incoming_pulse == low) {
                modules[curr_module].state = !modules[curr_module].state; // flip switch
                outgoing_pulse = (modules[curr_module].state) ? high : low;
            } else continue; // high pulse -> ignored, nothing happens
        } else if (m.prefix == '&') {
            std::unordered_map<std::string, Pulse> curr_connections = m.connections;
            curr_connections[sender_module] = incoming_pulse;
            outgoing_pulse = (remembers_all_high(curr_connections)) ? low : high;
            modules[curr_module].connections = curr_connections;

            // Additional logic for part 2
            if (curr_module == rx_parent && incoming_pulse == high) {
                observations[sender_module] = high;
            }
        }

        // send the outgoing pulse to the destination modules, by adding them to the queue
        for (std::string& dest : m.dest_modules)
            q.emplace(curr_module, outgoing_pulse, dest);
    }

    // low/high pulses for part 1, rx_parent memory for part 2
    if (rx_parent == "")
        return std::unordered_map<std::string, int>{{"low", low_pulses}, {"high", high_pulses}};
    else
        return observations;
}

bool all_cyles_found(std::unordered_map<std::string, std::vector<int64_t>>& seen_high) {
    for (auto& pair : seen_high)
        if (pair.second.size() < 3)
            return false;
    return true;
}

int64_t fewest_presses_for_low_rx(std::unordered_map<std::string, module_info>& modules) {
    // first find the parent of rx
    std::string rx_parent;
    for (auto& pair : modules)
        for (std::string& dest : pair.second.dest_modules)
            if (dest == "rx")
                rx_parent = pair.first;


    // then find the parents of the parent of rx
    std::vector<std::string> rx_grandparents;
    for (auto& pair : modules)
        for (std::string& dest : pair.second.dest_modules)
            if (dest == rx_parent)
                rx_grandparents.push_back(pair.first);

    // run simulations until cycles for the grandparents (initialised here) are found for high pulses
    std::unordered_map<std::string, std::vector<int64_t>> seen_high;
    for (std::string& gp : rx_grandparents) {
        seen_high[gp] = std::vector<int64_t>();
    }

    int64_t i = 0;
    while (++i < 100000) {
        // take note of the rx parent's connections during the simulation - i.e. if any pulsed high
        std::unordered_map<std::string, int> rx_parent_observations = simulate_button_press(modules, rx_parent);

        // if we saw a grandparent pulse high, take note of the amount of button presses (i)
        for (std::string& gp : rx_grandparents)
            if (rx_parent_observations[gp] == high)
                seen_high[gp].push_back(i);

        // after three observations for each grandparent pulsing high, break out of the loop
        if (all_cyles_found(seen_high))
            break;
    }

    // upon inspecting the 'seen_high' vector, the period is regular starting from 0 (e.g. 3907, 7814, 11721)
    // so we only need to consider the amount of presses that it first pulsed high to calculate the LCM
    int64_t lcm = 1;

    for (std::string gp : rx_grandparents)
        lcm = std::lcm(lcm, seen_high[gp][0]);

    return lcm;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int part1 = 0;
    int64_t part2 = 0;
    std::unordered_map<std::string, module_info> modules = parse_input(input);

    // Part 1
    int low_pulses = 0;
    int high_pulses = 0;
    for (int i = 0; i < 1000; i++) {
        std::unordered_map<std::string, int> counts = simulate_button_press(modules);
        low_pulses += counts["low"];
        high_pulses += counts["high"];
    }
    part1 = low_pulses * high_pulses;

    // Part 2
    modules = parse_input(input); // reset modules to default states
    part2 = fewest_presses_for_low_rx(modules);

    // Subreddit helped me a lot for part 2 again ;)

    std::cout << part1 << std::endl; // 743871576
    std::cout << part2 << std::endl; // 244151741342687

    return 0;
}
