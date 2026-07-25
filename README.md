<div align="center">

# 📊 Sorting Algorithm Visualizer (C)

### Learn Data Structures & Algorithms Through Step-by-Step Visualization

A console-based application written in **C** that demonstrates how **8 classical sorting algorithms** work by displaying every important operation such as comparisons, swaps, merges, and partitions.

![Language](https://img.shields.io/badge/Language-C-blue?style=for-the-badge)
![Algorithms](https://img.shields.io/badge/Algorithms-8-success?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Console-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)

</div>

---

# 📚 Table of Contents

- ✨ Features
- 📖 Algorithms Included
- 🚀 Project Highlights
- 📊 Time Complexity
- 🛠️ Project Structure
- 💻 Getting Started
- ▶️ Sample Execution
- 📸 Demo
- 🧠 Concepts Covered
- 🎯 Learning Outcomes
- 🛣️ Future Roadmap
- 📄 License
- 👨‍💻 Author

---

# ✨ Features

- 📌 Visualizes **8 popular sorting algorithms**
- 🔄 Displays every comparison, swap, merge, and partition
- 📋 Interactive menu-driven interface
- 🎯 Highlights active elements using brackets `[ ]`
- ⚡ Bubble Sort includes **early-exit optimization**
- 📚 Excellent for beginners learning DSA
- 🧩 Modular and easy-to-understand C code
- 💡 Interview preparation friendly

---

# 📖 Algorithms Included

| Algorithm | Description |
|------------|-------------|
| 🫧 Bubble Sort | Repeatedly swaps adjacent out-of-order elements |
| 📝 Insertion Sort | Inserts each element into its correct position |
| 🎯 Selection Sort | Finds the minimum element and places it correctly |
| ⚡ Quick Sort | Divide-and-conquer using pivot partitioning |
| 🔀 Merge Sort | Splits arrays and merges sorted halves |
| 🌳 Heap Sort | Builds a max heap and repeatedly extracts the largest |
| 🔢 Counting Sort | Frequency-based sorting for non-negative integers |
| 🔟 Radix Sort | Digit-by-digit sorting using Counting Sort |

---

# 🚀 Project Highlights

✅ Step-by-step visualization

✅ Interactive menu-driven program

✅ Covers both comparison and non-comparison sorting

✅ Demonstrates recursion and divide-and-conquer

✅ Beginner-friendly implementation

✅ Interview-ready concepts

---

# 📊 Time Complexity

| Algorithm | Best | Average | Worst | Space | Stable |
|------------|------|----------|--------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | ✅ |
| Radix Sort | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) | O(n+k) | ✅ |

---

# 🛠️ Project Structure

```

Sorting-Algorithm-Visualizer
│
├── sorting_visualizer.c
├── README.md
├── LICENSE
│
└── assets
├── demo.gif
└── output.png

````

---

# 💻 Getting Started

## Requirements

- GCC Compiler
- C99 or later
- Windows / Linux / macOS

## Compilation

```bash
gcc sorting_visualizer.c -o sorting_visualizer
````

## Run

```bash
./sorting_visualizer
```

---

# ▶️ Sample Execution

```text
=== Sorting Algorithm Visualizer ===

Enter number of elements (max 20): 5

Enter 5 elements:
5 2 4 1 3

1. Bubble Sort
2. Insertion Sort
3. Selection Sort
4. Quick Sort
5. Merge Sort
6. Heap Sort
7. Counting Sort
8. Radix Sort

Choose an algorithm: 4
```

---

## 📸 Demo

<p align="center">
  <img src="assets/sorting_comparison.gif" alt="Sorting Algorithms Comparison" width="90%">
</p>

<p align="center">
  <em>Visualization of all 8 implemented sorting algorithms.</em>
</p>


# 🧠 Concepts Covered

* Arrays
* Functions
* Recursion
* Divide and Conquer
* Binary Heap
* Heapify Operation
* Counting Technique
* Stable vs Unstable Sorting
* Time Complexity Analysis
* Space Complexity
* Modular Programming

---

# 🎯 Learning Outcomes

This project helped me understand:

* ✔ Internal working of sorting algorithms
* ✔ Comparison-based vs non-comparison sorting
* ✔ Divide-and-conquer strategy
* ✔ Recursion in practical applications
* ✔ Heap data structure
* ✔ Algorithm visualization techniques
* ✔ Performance trade-offs between sorting methods

---

# 🛣️ Future Roadmap

* [ ] Add Shell Sort
* [ ] Add Bucket Sort
* [ ] Add Tim Sort
* [ ] Support negative integers in Counting Sort
* [ ] Random array generator
* [ ] Performance comparison graph
* [ ] ANSI color output
* [ ] Adjustable animation speed
* [ ] Export sorting statistics

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Sibanand Sahu**

🎓 Computer Science (AI & ML)

💻 Passionate about DSA, Competitive Programming, and Software Development.

⭐ If you found this project helpful, consider giving it a **Star** on GitHub!

---

<div align="center">

### 🚀 Happy Coding!

Made with ❤️ in C

</div>
