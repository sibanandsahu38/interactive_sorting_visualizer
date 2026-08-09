# 🧊 AlgoMaster 3D Algorithm Visualizer Studio

An interactive 3D WebGL & Canvas Algorithm Visualizer featuring **8 classic Sorting Algorithms** and **5 Searching Algorithms**, built with Three.js, Web Audio API synthesizers, live line-by-line C / DSA code execution tracing, and real-time variable inspection.

---

## ✨ Features

### 1. 🧊 3D Isometric Viewport (Three.js)
- **High-Gloss 3D Cylindrical Pillars** with studio lighting, metallic roughness reflections, and floor grid shadows.
- **3D Floating Value Badges** hovering directly above each pillar with high-contrast typography.
- **Dynamic Color Highlighting**:
  - 🟡 **Amber**: Comparing / Active search probing
  - 🔴 **Neon Coral/Red**: Swapping elements
  - 🟣 **Purple**: Active pivot / partition boundaries
  - 🟢 **Emerald Green**: Final locked sorted element / Target Match Found
- **Interactive Camera Controls**:
  - Free 360° mouse rotation and zoom
  - Quick view presets: **Isometric**, **Front**, and **Top-Down**

### 2. 📝 Live C / DSA Code Execution Trace & Variable Inspector
- Embedded C / DSA source code for all 13 algorithms with syntax highlighting.
- **Illuminated Line Tracker**: A glowing `▶` pointer and background highlight jumps to the exact line of code executing at each micro-step.
- **Live Variable Badges**: Displays real-time values for loop variables (`i`, `j`), search bounds (`low`, `high`, `mid`, `mid1`, `mid2`), conditions, and actions.

### 3. 🔊 Web Audio API Synthesizer
- Harmonic frequency tones proportional to element values during comparisons and swaps.
- Celebration chord chimes upon completing sorting or finding a search target.
- One-click `🔊 Sound: ON/OFF` toggle.

---

## 📊 Supported Algorithms

### Sorting (8 Algorithms)
1. **Bubble Sort** $\mathcal{O}(n^2)$
2. **Insertion Sort** $\mathcal{O}(n^2)$
3. **Selection Sort** $\mathcal{O}(n^2)$
4. **Quick Sort** $\mathcal{O}(n \log n)$
5. **Merge Sort** $\mathcal{O}(n \log n)$
6. **Heap Sort** $\mathcal{O}(n \log n)$
7. **Counting Sort** $\mathcal{O}(n + k)$
8. **Radix Sort** $\mathcal{O}(nk)$

### Searching (5 Algorithms)
1. **Linear Search** $\mathcal{O}(n)$
2. **Binary Search** $\mathcal{O}(\log n)$
3. **Ternary Search** $\mathcal{O}(\log_3 n)$
4. **Jump Search** $\mathcal{O}(\sqrt{n})$
5. **Exponential Search** $\mathcal{O}(\log n)$

---

## 🚀 Getting Started

### Method 1: Run Locally with Node.js
```bash
node server.js
```
Then open `http://localhost:8081/` in your browser.

### Method 2: Static Deployment (Vercel / GitHub Pages / Netlify)
This project requires no build tools. Simply drag and drop the folder or connect your GitHub repository directly to Vercel or GitHub Pages!

---

## 📂 Project Structure
```
├── index.html       # Visualizer UI, 3D Canvas stage, Code Trace & Variable Inspector
├── styles.css       # Glassmorphism dark theme, 3D viewport layout, syntax styling
├── app.js           # Three.js 3D engine, Web Audio synth, playback & camera controller
├── sort_engine.js   # Step frame generator for all 13 sorting and searching algorithms
├── server.js        # Lightweight local HTTP dev server (port 8081)
└── README.md        # Project documentation
```
