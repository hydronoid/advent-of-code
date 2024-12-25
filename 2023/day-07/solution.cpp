#include "../input_utils.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <unordered_map>
#include <algorithm>

struct hand {
    std::string cards;
    int bid;
    int type;
};

int determine_hand_type(std::string cards, bool use_new_joker_rule=false) {
    std::unordered_map<char, int> card_count;
    int max_count = 0;
    int joker_count = 0; // for part 2, count jokers separately

    for (char card : cards) {
        if (use_new_joker_rule && card == 'J') {
            joker_count++;
            continue;
        }
        card_count[card]++;
        max_count = std::max<int>(max_count, card_count[card]);
    }

    if (use_new_joker_rule)
        max_count += joker_count; // for part 2
    
    int unique_labels = card_count.size();

    // use an integer to represent the type, where larger = stronger type
    switch (max_count) {
        case 5:
            return 7;                           // five of a kind
        case 4:
            return 6;                           // four of a kind
        case 3:
            if (unique_labels == 2) return 5;   // full house
            else return 4;                      // three of a kind
        case 2:
            if (unique_labels == 3) return 3;   // two pair
            else return 2;                      // one pair
        default:
            return 1;                           // high card
    }
}

hand parse_line(std::string line) {
    hand h;
    int space_position = line.find(' ');
    
    h.cards = line.substr(0, space_position);
    h.bid = std::stoi(line.substr(space_position + 1));
    h.type = determine_hand_type(h.cards);

    return h;
}

bool compare_hand_cards(const hand a, const hand b, const std::string card_strengths) {
    for (int i = 0; i < 5; i++) {
        if (a.cards[i] != b.cards[i]) {
            return card_strengths.find(a.cards[i]) > card_strengths.find(b.cards[i]);
        }
    }
    return false;
}

bool hand_comparator(const hand a, const hand b) {
    if (a.type == b.type) {
        return compare_hand_cards(a, b, "AKQJT98765432");
    }
    return a.type < b.type;
}

bool hand_comparator_with_joker(const hand a, const hand b) {
    if (a.type == b.type) {
        return compare_hand_cards(a, b, "AKQT98765432J");
    }
    return a.type < b.type;
}


int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int part1 = 0, part2 = 0;

    std::vector<hand> hands_list;

    for (const std::string& line : input) {
        hand h = parse_line(line);
        hands_list.push_back(h);
    }

    // Part 1
    std::sort(hands_list.begin(), hands_list.end(), hand_comparator); // sort by rank
    for (int i = 0; i < hands_list.size(); i++) {
        int rank = i+1;
        part1 += hands_list[i].bid * rank;
    }
    
    // Part 2
    for (hand& h : hands_list) {
        h.type = determine_hand_type(h.cards, true); // update type according to new rules
    }   
    std::sort(hands_list.begin(), hands_list.end(), hand_comparator_with_joker); // re-sort
    for (int i = 0; i < hands_list.size(); i++) {
        int rank = i+1;
        part2 += hands_list[i].bid * rank;
    }

    std::cout << part1 << std::endl; // 250232501
    std::cout << part2 << std::endl; // 249138943

    return 0;
}
