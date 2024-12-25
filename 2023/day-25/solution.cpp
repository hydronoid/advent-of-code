#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <string>
#include <cstdlib>
#include <algorithm>
#include <queue>
// #include <ctime>

std::unordered_map<std::string, std::vector<std::string>> parse_input(std::vector<std::string>& input) {
    std::unordered_map<std::string, std::vector<std::string>> graph;
    for (std::string& line : input) {
        line.erase(line.length() - 1, 1); // remove '\r' from the end
        int i = line.find(':');

        std::string a = line.substr(0, i);
        std::vector<std::string> neighbours = split(line.substr(i+1));

        for (auto& b : neighbours) {
            graph[a].push_back(b);
            graph[b].push_back(a);
        }
    }

    return graph;
}

int bfs(const std::string& start, 
         std::unordered_map<std::string, std::vector<std::string>>& graph,
         std::unordered_map<std::string, int>& edge_counts) {

    std::unordered_set<std::string> visited;
    std::queue<std::string> q;
    q.push(start);

    while (!q.empty()) {
        std::string node = q.front();
        q.pop();
        visited.insert(node);

        for (std::string& neighbour : graph[node]) {
            if (visited.find(neighbour) == visited.end()) {
                q.push(neighbour);

                // count the times an edge has been used
                std::string a = std::min(node, neighbour);
                std::string b = std::max(node, neighbour);
                edge_counts[a + '-' + b]++;
            }
        }
    }
    return visited.size();
}

void remove_edges(std::unordered_map<std::string, std::vector<std::string>>& graph, 
                      std::unordered_map<std::string, int>& edge_counts) {
    
    // convert the edge count map to a vector of pairs, then sort edges based on their count
    std::vector<std::pair<std::string, int>> edge_counts_vec(edge_counts.begin(), edge_counts.end());
    std::sort(edge_counts_vec.begin(), edge_counts_vec.end(), [](const auto& a, const auto& b) {
        return a.second > b.second;
    });

    int i = 0;
    while (i++ < edge_counts.size()) {
        // split the string "abc-def" to get the nodes the edge is between (assuming nodes are strings of length 3) 
        std::string a = edge_counts_vec[i].first.substr(0, 3);
        std::string b = edge_counts_vec[i].first.substr(4);

        // remove the most commonly visited edges, until the amount of reachable nodes is smaller than the total nodes
        graph[a].erase(std::remove(graph[a].begin(), graph[a].end(), b), graph[a].end());
        graph[b].erase(std::remove(graph[b].begin(), graph[b].end(), a), graph[b].end());

        if (bfs(graph.begin()->first, graph, edge_counts) < graph.size()) {
            return;
        }
    }
}



int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int part1 = 0;

    std::unordered_map<std::string, std::vector<std::string>> graph = parse_input(input);
    std::unordered_map<std::string, int> edge_counts;

    // Conduct a BFS starting from every node, counting each time an edge is used
    for (auto it = graph.begin(); it != graph.end(); ++it) {
        std::string random_node = it->first;
        bfs(random_node, graph, edge_counts);
    }

    remove_edges(graph, edge_counts);
    int group1_size = bfs(graph.begin()->first, graph, edge_counts);
    part1 = group1_size * (graph.size() - group1_size);

    std::cout << part1 << std::endl; // 554064

    return 0;
}
