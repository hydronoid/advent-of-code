#include "../input_utils.h"

#include <iostream>
#include <vector>
#include <iomanip>
#include <limits>
#include <cmath>


struct hailstone {
    double px, py, pz;
    double vx, vy, vz;
};

hailstone parse_line(const std::string& line) {
    hailstone h;
    sscanf(line.c_str(), "%lf, %lf, %lf @ %lf, %lf, %lf", &h.px, &h.py, &h.pz, &h.vx, &h.vy, &h.vz);
    return h;
}

std::pair<double, double> get_slope_and_intercept(hailstone h) {
    double m = h.vy / h.vx;        // slope
    double c = h.py - m * h.px;    // y-intercept 
    return {m, c};
}

bool occurred_in_past(hailstone h, double x) {
    double t = (x - h.px) / h.vx;
    return t < 0;
}

bool will_intersect_in_zone(hailstone h1, hailstone h2, double lower_bound, double upper_bound) {
    auto [m1, c1] = get_slope_and_intercept(h1);
    auto [m2, c2] = get_slope_and_intercept(h2);

    // parallel (equal gradients)
    if (m1 == m2) 
        return false; 
    
    // coordinates of intersection
    double x = (c2 - c1) / (m1 - m2);
    double y = m1 * x + c1;

    if (occurred_in_past(h1, x) || occurred_in_past(h2, x))
        return false;

    return (lower_bound <= x && x <= upper_bound) && (lower_bound <= y && y <= upper_bound);
}


// I'm not too familiar with linear algebra in general, so I stole this function
void gaussian_elimination(std::vector<std::vector<double>>& matrix) {
    int n = matrix.size();

    for (int i = 0; i < n; ++i) {
        double pivot = matrix[i][i];
        for (int j = i; j < n + 1; j++) {
            matrix[i][j] /= pivot;
        }

        for (int k = 0; k < n; ++k) {
            if (k != i) {
                double factor = matrix[k][i];
                for (int j = i; j < n + 1; j++) {
                    matrix[k][j] -= factor * matrix[i][j];
                }
            }
        }
    }
}

double calculate_rock_position(std::vector<hailstone>& stones) {
    // note this is not guaranteed to find a solution, as it assumes the first 3 hailstones will work - if it doesn't, try other hailstones
    hailstone h1 = stones[0];
    hailstone h2 = stones[1];
    hailstone h3 = stones[2];

    std::vector<std::vector<double>> mat = {
        {h1.vy-h2.vy, h2.vx-h1.vx, 0.0, h2.py-h1.py, h1.px-h2.px, 0.0, h1.px*h1.vy - h1.py*h1.vx - h2.px*h2.vy + h2.py*h2.vx}, // h1 and h2, x and y
        {h1.vy-h3.vy, h3.vx-h1.vx, 0.0, h3.py-h1.py, h1.px-h3.px, 0.0, h1.px*h1.vy - h1.py*h1.vx - h3.px*h3.vy + h3.py*h3.vx}, // h1 and h3, x and y
        {h1.vz-h2.vz, 0.0, h2.vx-h1.vx, h2.pz-h1.pz, 0.0, h1.px-h2.px, h1.px*h1.vz - h1.pz*h1.vx - h2.px*h2.vz + h2.pz*h2.vx}, // h1 and h2, x and z
        {h1.vz-h3.vz, 0.0, h3.vx-h1.vx, h3.pz-h1.pz, 0.0, h1.px-h3.px, h1.px*h1.vz - h1.pz*h1.vx - h3.px*h3.vz + h3.pz*h3.vx}, // h1 and h3, x and z
        {0.0, h1.vz-h2.vz, h2.vy-h1.vy, 0.0, h2.pz-h1.pz, h1.py-h2.py, h1.py*h1.vz - h1.pz*h1.vy - h2.py*h2.vz + h2.pz*h2.vy}, // h1 and h2, y and z
        {0.0, h1.vz-h3.vz, h3.vy-h1.vy, 0.0, h3.pz-h1.pz, h1.py-h3.py, h1.py*h1.vz - h1.pz*h1.vy - h3.py*h3.vz + h3.pz*h3.vy}  // h1 and h3, y and z
    };

    // solve the system of linear equations (6 variables)
    gaussian_elimination(mat);

    double rock_px = mat[0].back();
    double rock_py = mat[1].back();
    double rock_pz = mat[2].back();

    return rock_px + rock_py + rock_pz;
}

int main() {
    std::vector<std::string> input = read_file_to_array("input.txt");

    int part1 = 0;
    double part2 = 0;

    std::vector<hailstone> stones;

    for (const std::string& line : input) {
        stones.push_back(parse_line(line));
    }

    for (int i = 0; i < stones.size(); i++) {
        for (int j = i+1; j < stones.size(); j++) {
            part1 += will_intersect_in_zone(stones[i], stones[j], 200000000000000, 400000000000000);
        }
    }

    part2 = round(calculate_rock_position(stones));
    std::cout << std::setprecision(std::numeric_limits<double>::max_digits10);

    // Didn't have sufficient mathematical background to come up with a solution for Part 2 on my own,
    // but this Reddit thread and its comments helped me understand it a lot better:
    // https://www.reddit.com/r/adventofcode/comments/18q40he/2023_day_24_part_2_a_straightforward_nonsolver/

    std::cout << part1 << std::endl; // 15558
    std::cout << part2 << std::endl; // 765636044333842

    return 0;
}
