document.addEventListener("DOMContentLoaded", () => {
    let currentAlgo = 1;
    let arraySize = 30;
    let animSpeed = 50; // ms
    let currentArray = [];
    let steps = [];
    let currentStepIdx = 0;
    let isPlaying = false;
    let timerId = null;

    const engine = new SortingEngine();

    // DOM Elements
    const visitorCountEl = document.getElementById("visitorCount");
    const algoButtons = document.querySelectorAll(".op-btn");
    const arrayTypeSelect = document.getElementById("arrayTypeSelect");
    const manualInputRow = document.getElementById("manualInputRow");
    const manualInputText = document.getElementById("manualInputText");
    const applyManualBtn = document.getElementById("applyManualBtn");

    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const stepBtn = document.getElementById("stepBtn");
    const resetBtn = document.getElementById("resetBtn");
    const generateBtn = document.getElementById("generateBtn");

    const sizeSlider = document.getElementById("sizeSlider");
    const sizeValue = document.getElementById("sizeValue");
    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");

    const metricComparisons = document.getElementById("metricComparisons");
    const metricSwaps = document.getElementById("metricSwaps");
    const metricProgress = document.getElementById("metricProgress");
    const metricComplexity = document.getElementById("metricComplexity");

    const currentAlgoTitle = document.getElementById("currentAlgoTitle");
    const barsContainer = document.getElementById("barsContainer");
    const consoleBody = document.getElementById("consoleBody");
    const clearConsoleBtn = document.getElementById("clearConsoleBtn");

    // Algorithm Config Metadata
    const algoConfigs = {
        1: { title: "🫧 Bubble Sort", complexity: "O(n²)", func: (arr) => engine.bubbleSort(arr) },
        2: { title: "📥 Insertion Sort", complexity: "O(n²)", func: (arr) => engine.insertionSort(arr) },
        3: { title: "🎯 Selection Sort", complexity: "O(n²)", func: (arr) => engine.selectionSort(arr) },
        4: { title: "⚡ Quick Sort", complexity: "O(n log n)", func: (arr) => engine.quickSort(arr) },
        5: { title: "🔀 Merge Sort", complexity: "O(n log n)", func: (arr) => engine.mergeSort(arr) },
        6: { title: "🌲 Heap Sort", complexity: "O(n log n)", func: (arr) => engine.heapSort(arr) },
        7: { title: "📊 Counting Sort", complexity: "O(n + k)", func: (arr) => engine.countingSort(arr) },
        8: { title: "🔢 Radix Sort", complexity: "O(nk)", func: (arr) => engine.radixSort(arr) }
    };

    // Initialize Visitor Counter
    function initVisitorCounter() {
        let visits = parseInt(localStorage.getItem("sort_visualizer_visits") || "0", 10) + 1;
        localStorage.setItem("sort_visualizer_visits", visits);
        visitorCountEl.textContent = `Visits: ${visits}`;

        fetch("https://api.counterapi.dev/v1/sorting-visualizer-sibanand/visits/up")
            .then(res => res.json())
            .then(data => {
                if (data && data.count) {
                    visitorCountEl.textContent = `Visits: ${data.count}`;
                }
            })
            .catch(() => {});
    }

    initVisitorCounter();

    // Sidebar Algo Select
    algoButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            algoButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentAlgo = parseInt(btn.dataset.algo, 10);
            resetVisualizer();
        });
    });

    // Array Generation Logic
    function generateInitialArray() {
        const type = arrayTypeSelect.value;
        manualInputRow.style.display = (type === "manual") ? "block" : "none";

        if (type === "manual") {
            const parsed = manualInputText.value.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
            if (parsed.length > 0) {
                currentArray = parsed.slice(0, 100);
            } else {
                currentArray = [45, 12, 89, 3, 27, 60, 15, 72, 34, 50];
            }
            arraySize = currentArray.length;
            sizeSlider.value = arraySize;
            sizeValue.textContent = arraySize;
            return;
        }

        currentArray = [];
        if (type === "random") {
            for (let i = 0; i < arraySize; i++) {
                currentArray.push(Math.floor(Math.random() * 95) + 5);
            }
        } else if (type === "reversed") {
            for (let i = 0; i < arraySize; i++) {
                currentArray.push(Math.floor(100 - (i * (90 / arraySize))));
            }
        } else if (type === "nearly") {
            for (let i = 0; i < arraySize; i++) {
                currentArray.push(Math.floor(5 + (i * (90 / arraySize))));
            }
            // Swap a few elements to make it nearly sorted
            for (let s = 0; s < Math.max(2, Math.floor(arraySize / 5)); s++) {
                const idx1 = Math.floor(Math.random() * arraySize);
                const idx2 = Math.floor(Math.random() * arraySize);
                const tmp = currentArray[idx1];
                currentArray[idx1] = currentArray[idx2];
                currentArray[idx2] = tmp;
            }
        } else if (type === "few_unique") {
            const setValues = [15, 35, 60, 85];
            for (let i = 0; i < arraySize; i++) {
                currentArray.push(setValues[Math.floor(Math.random() * setValues.length)]);
            }
        }
    }

    // Sliders
    sizeSlider.addEventListener("input", (e) => {
        arraySize = parseInt(e.target.value, 10);
        sizeValue.textContent = arraySize;
        if (arrayTypeSelect.value !== "manual") {
            resetVisualizer();
        }
    });

    speedSlider.addEventListener("input", (e) => {
        animSpeed = parseInt(e.target.value, 10);
        speedValue.textContent = `${animSpeed}ms`;
        if (isPlaying) {
            pausePlayback();
            startPlayback();
        }
    });

    arrayTypeSelect.addEventListener("change", () => {
        resetVisualizer();
    });

    applyManualBtn.addEventListener("click", () => {
        resetVisualizer();
    });

    // Reset Visualizer & Generate Steps
    function resetVisualizer() {
        pausePlayback();
        generateInitialArray();

        const cfg = algoConfigs[currentAlgo];
        currentAlgoTitle.textContent = cfg.title;
        metricComplexity.textContent = cfg.complexity;

        // Generate Steps from SortingEngine
        steps = cfg.func([...currentArray]);
        currentStepIdx = 0;

        consoleBody.innerHTML = `<div class="console-line highlight">Initialized ${cfg.title} with ${currentArray.length} elements.</div>`;
        renderStep(0);
    }

    // Render Bar Chart for a specific Step Frame
    function renderStep(stepIdx) {
        if (!steps || steps.length === 0) return;
        const frame = steps[Math.min(stepIdx, steps.length - 1)];

        barsContainer.innerHTML = "";
        const maxVal = Math.max(...frame.array, 10);

        frame.array.forEach((val, idx) => {
            const bar = document.createElement("div");
            bar.className = "bar";
            bar.style.height = `${Math.max(10, (val / maxVal) * 92)}%`;

            // Color Highlighting
            if (frame.highlights.swap.includes(idx)) {
                bar.classList.add("swap");
            } else if (frame.highlights.compare.includes(idx)) {
                bar.classList.add("compare");
            } else if (frame.highlights.pivot.includes(idx)) {
                bar.classList.add("pivot");
            } else if (frame.highlights.sorted.includes(idx)) {
                bar.classList.add("sorted");
            } else if (frame.highlights.active.includes(idx)) {
                bar.classList.add("compare");
            }

            if (arraySize <= 35) {
                bar.textContent = val;
            }

            barsContainer.appendChild(bar);
        });

        // Update Dashboard Metrics
        metricComparisons.textContent = frame.metrics.comparisons;
        metricSwaps.textContent = frame.metrics.swaps;
        const pct = Math.round(((stepIdx + 1) / steps.length) * 100);
        metricProgress.textContent = `${pct}%`;

        // Log to console if new step
        if (frame.log) {
            const line = document.createElement("div");
            line.className = "console-line";
            line.textContent = `[Step ${stepIdx + 1}/${steps.length}] ${frame.log}`;
            consoleBody.appendChild(line);
            consoleBody.scrollTop = consoleBody.scrollHeight;
        }
    }

    // Playback Controls
    function startPlayback() {
        if (isPlaying) return;
        isPlaying = true;
        playBtn.disabled = true;
        pauseBtn.disabled = false;

        timerId = setInterval(() => {
            if (currentStepIdx < steps.length - 1) {
                currentStepIdx++;
                renderStep(currentStepIdx);
            } else {
                pausePlayback();
            }
        }, animSpeed);
    }

    function pausePlayback() {
        isPlaying = false;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    playBtn.addEventListener("click", startPlayback);
    pauseBtn.addEventListener("click", pausePlayback);

    stepBtn.addEventListener("click", () => {
        pausePlayback();
        if (currentStepIdx < steps.length - 1) {
            currentStepIdx++;
            renderStep(currentStepIdx);
        }
    });

    resetBtn.addEventListener("click", () => {
        resetVisualizer();
    });

    generateBtn.addEventListener("click", () => {
        resetVisualizer();
    });

    clearConsoleBtn.addEventListener("click", () => {
        consoleBody.innerHTML = `<div class="console-line">Console cleared.</div>`;
    });

    // Initial load
    resetVisualizer();
});
