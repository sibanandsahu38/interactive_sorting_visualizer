document.addEventListener("DOMContentLoaded", () => {
    let currentAlgo = 1;
    let arraySize = 8;
    let animSpeed = 600; // ms
    let currentArray = [64, 34, 25, 12, 22, 11, 90, 45];
    let searchTarget = 25;
    let steps = [];
    let currentStepIdx = 0;
    let isPlaying = false;
    let timerId = null;
    let is3dView = true;
    let soundEnabled = true;

    const engine = new SortingEngine();

    // DOM Elements
    const visitorCountEl = document.getElementById("visitorCount");
    const algoButtons = document.querySelectorAll(".op-btn");
    const arrayTypeSelect = document.getElementById("arrayTypeSelect");
    const manualInputRow = document.getElementById("manualInputRow");
    const manualInputText = document.getElementById("manualInputText");
    const applyManualBtn = document.getElementById("applyManualBtn");

    const soundToggleBtn = document.getElementById("soundToggleBtn");
    const soundIcon = document.getElementById("soundIcon");

    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const stepBtn = document.getElementById("stepBtn");
    const resetBtn = document.getElementById("resetBtn");
    const generateBtn = document.getElementById("generateBtn");

    const targetInputGroup = document.getElementById("targetInputGroup");
    const targetInputVal = document.getElementById("targetInputVal");
    const targetRandomBtn = document.getElementById("targetRandomBtn");

    const view3dBtn = document.getElementById("view3dBtn");
    const view2dBtn = document.getElementById("view2dBtn");
    const threeStage = document.getElementById("threeStage");
    const barsContainer = document.getElementById("barsContainer");

    const camIsoBtn = document.getElementById("camIsoBtn");
    const camFrontBtn = document.getElementById("camFrontBtn");
    const camTopBtn = document.getElementById("camTopBtn");

    const sizeSlider = document.getElementById("sizeSlider");
    const sizeValue = document.getElementById("sizeValue");
    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");

    const metricComparisons = document.getElementById("metricComparisons");
    const metricSwaps = document.getElementById("metricSwaps");
    const metricProgress = document.getElementById("metricProgress");
    const metricComplexity = document.getElementById("metricComplexity");

    const currentAlgoTitle = document.getElementById("currentAlgoTitle");
    const consoleBody = document.getElementById("consoleBody");
    const clearConsoleBtn = document.getElementById("clearConsoleBtn");
    const codeEditorBox = document.getElementById("codeEditorBox");
    const varBadges = document.getElementById("varBadges");

    // Formatted C / DSA Code with Syntax Color Tokens for 13 Algorithms
    const algoSourceCodes = {
        1: [
            '<span class="syn-kw">void</span> <span class="syn-fn">bubbleSort</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
            '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i <span class="syn-op">&lt;</span> n <span class="syn-op">-</span> <span class="syn-num">1</span>; i<span class="syn-op">++</span>) {',
            '        <span class="syn-kw">for</span> (<span class="syn-kw">int</span> j = <span class="syn-num">0</span>; j <span class="syn-op">&lt;</span> n <span class="syn-op">-</span> i <span class="syn-op">-</span> <span class="syn-num">1</span>; j<span class="syn-op">++</span>) {',
            '            <span class="syn-kw">if</span> (arr[j] <span class="syn-op">&gt;</span> arr[j <span class="syn-op">+</span> <span class="syn-num">1</span>]) {',
            '                <span class="syn-fn">swap</span>(&amp;arr[j], &amp;arr[j <span class="syn-op">+</span> <span class="syn-num">1</span>]);',
            '            }',
            '        }',
            '    }',
            '}'
        ],
        2: [
            '<span class="syn-kw">void</span> <span class="syn-fn">insertionSort</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
            '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">1</span>; i <span class="syn-op">&lt;</span> n; i<span class="syn-op">++</span>) {',
            '        <span class="syn-kw">int</span> key = arr[i], j = i <span class="syn-op">-</span> <span class="syn-num">1</span>;',
            '        <span class="syn-kw">while</span> (j <span class="syn-op">&gt;=</span> <span class="syn-num">0</span> <span class="syn-op">&amp;&amp;</span> arr[j] <span class="syn-op">&gt;</span> key) {',
            '            arr[j <span class="syn-op">+</span> <span class="syn-num">1</span>] = arr[j]; j<span class="syn-op">--</span>;',
            '        }',
            '        arr[j <span class="syn-op">+</span> <span class="syn-num">1</span>] = key;',
            '    }',
            '}'
        ],
        3: [
            '<span class="syn-kw">void</span> <span class="syn-fn">selectionSort</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
            '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i <span class="syn-op">&lt;</span> n <span class="syn-op">-</span> <span class="syn-num">1</span>; i<span class="syn-op">++</span>) {',
            '        <span class="syn-kw">int</span> min_idx = i;',
            '        <span class="syn-kw">for</span> (<span class="syn-kw">int</span> j = i <span class="syn-op">+</span> <span class="syn-num">1</span>; j <span class="syn-op">&lt;</span> n; j<span class="syn-op">++</span>) {',
            '            <span class="syn-kw">if</span> (arr[j] <span class="syn-op">&lt;</span> arr[min_idx]) min_idx = j;',
            '        }',
            '        <span class="syn-kw">if</span> (min_idx <span class="syn-op">!=</span> i) <span class="syn-fn">swap</span>(&amp;arr[i], &amp;arr[min_idx]);',
            '    }',
            '}'
        ],
        4: [
            '<span class="syn-kw">int</span> <span class="syn-fn">partition</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> low, <span class="syn-kw">int</span> high) {',
            '    <span class="syn-kw">int</span> pivot = arr[high], i = low <span class="syn-op">-</span> <span class="syn-num">1</span>;',
            '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> j = low; j <span class="syn-op">&lt;</span> high; j<span class="syn-op">++</span>) {',
            '        <span class="syn-kw">if</span> (arr[j] <span class="syn-op">&lt;</span> pivot) { i<span class="syn-op">++</span>; <span class="syn-fn">swap</span>(&amp;arr[i], &amp;arr[j]); }',
            '    }',
            '    <span class="syn-fn">swap</span>(&amp;arr[i <span class="syn-op">+</span> <span class="syn-num">1</span>], &amp;arr[high]);',
            '    <span class="syn-kw">return</span> i <span class="syn-op">+</span> <span class="syn-num">1</span>;',
            '}'
        ],
        5: [
            '<span class="syn-kw">void</span> <span class="syn-fn">merge</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> left, <span class="syn-kw">int</span> mid, <span class="syn-kw">int</span> right) {',
            '    <span class="syn-com">// Divide into Left and Right subarrays</span>',
            '    <span class="syn-kw">while</span> (i <span class="syn-op">&lt;</span> n1 <span class="syn-op">&amp;&amp;</span> j <span class="syn-op">&lt;</span> n2) {',
            '        <span class="syn-kw">if</span> (L[i] <span class="syn-op">&lt;=</span> R[j]) arr[k<span class="syn-op">++</span>] = L[i<span class="syn-op">++</span>];',
            '        <span class="syn-kw">else</span> arr[k<span class="syn-op">++</span>] = R[j<span class="syn-op">++</span>];',
            '    }',
            '    <span class="syn-com">// Copy remaining elements</span>',
            '}'
        ],
        6: [
            '<span class="syn-kw">void</span> <span class="syn-fn">heapSort</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
            '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = n <span class="syn-op">/</span> <span class="syn-num">2</span> <span class="syn-op">-</span> <span class="syn-num">1</span>; i <span class="syn-op">&gt;=</span> <span class="syn-num">0</span>; i<span class="syn-op">--</span>)',
            '        <span class="syn-fn">heapify</span>(arr, n, i); <span class="syn-com">// Build max heap</span>',
            '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = n <span class="syn-op">-</span> <span class="syn-num">1</span>; i <span class="syn-op">&gt;</span> <span class="syn-num">0</span>; i<span class="syn-op">--</span>) {',
            '        <span class="syn-fn">swap</span>(&amp;arr[<span class="syn-num">0</span>], &amp;arr[i]);',
            '        <span class="syn-fn">heapify</span>(arr, i, <span class="syn-num">0</span>);',
            '    }',
            '}'
        ],
        7: [
            '<span class="syn-kw">void</span> <span class="syn-fn">countingSort</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
            '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i <span class="syn-op">&lt;</span> n; i<span class="syn-op">++</span>) count[arr[i]]<span class="syn-op">++</span>;',
            '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i <span class="syn-op">&lt;=</span> max_val; i<span class="syn-op">++</span>) {',
            '        <span class="syn-kw">while</span> (count[i] <span class="syn-op">&gt;</span> <span class="syn-num">0</span>) arr[idx<span class="syn-op">++</span>] = i;',
            '    }',
            '}'
        ],
        8: [
            '<span class="syn-kw">void</span> <span class="syn-fn">radixSort</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
            '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> exp = <span class="syn-num">1</span>; max <span class="syn-op">/</span> exp <span class="syn-op">&gt;</span> <span class="syn-num">0</span>; exp <span class="syn-op">*=</span> <span class="syn-num">10</span>) {',
            '        <span class="syn-com">// Tally digits at place value exp</span>',
            '        <span class="syn-fn">countingSortByDigit</span>(arr, n, exp);',
            '    }',
            '}'
        ],
        // Searching Algorithms
        9: [
            '<span class="syn-kw">int</span> <span class="syn-fn">linearSearch</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n, <span class="syn-kw">int</span> target) {',
            '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i <span class="syn-op">&lt;</span> n; i<span class="syn-op">++</span>) {',
            '        <span class="syn-kw">if</span> (arr[i] <span class="syn-op">==</span> target) <span class="syn-kw">return</span> i; <span class="syn-com">// Match found!</span>',
            '    }',
            '    <span class="syn-kw">return</span> <span class="syn-op">-</span><span class="syn-num">1</span>; <span class="syn-com">// Not found</span>',
            '}'
        ],
        10: [
            '<span class="syn-kw">int</span> <span class="syn-fn">binarySearch</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> low, <span class="syn-kw">int</span> high, <span class="syn-kw">int</span> target) {',
            '    <span class="syn-kw">while</span> (low <span class="syn-op">&lt;=</span> high) {',
            '        <span class="syn-kw">int</span> mid = low <span class="syn-op">+</span> (high <span class="syn-op">-</span> low) <span class="syn-op">/</span> <span class="syn-num">2</span>;',
            '        <span class="syn-kw">if</span> (arr[mid] <span class="syn-op">==</span> target) <span class="syn-kw">return</span> mid; <span class="syn-com">// Found!</span>',
            '        <span class="syn-kw">else</span> <span class="syn-kw">if</span> (arr[mid] <span class="syn-op">&lt;</span> target) low = mid <span class="syn-op">+</span> <span class="syn-num">1</span>; <span class="syn-com">// Search Right</span>',
            '        <span class="syn-kw">else</span> high = mid <span class="syn-op">-</span> <span class="syn-num">1</span>; <span class="syn-com">// Search Left</span>',
            '    }',
            '    <span class="syn-kw">return</span> <span class="syn-op">-</span><span class="syn-num">1</span>;',
            '}'
        ],
        11: [
            '<span class="syn-kw">int</span> <span class="syn-fn">ternarySearch</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> low, <span class="syn-kw">int</span> high, <span class="syn-kw">int</span> target) {',
            '    <span class="syn-kw">while</span> (low <span class="syn-op">&lt;=</span> high) {',
            '        <span class="syn-kw">int</span> mid1 = low <span class="syn-op">+</span> (high <span class="syn-op">-</span> low) <span class="syn-op">/</span> <span class="syn-num">3</span>, mid2 = high <span class="syn-op">-</span> (high <span class="syn-op">-</span> low) <span class="syn-op">/</span> <span class="syn-num">3</span>;',
            '        <span class="syn-kw">if</span> (arr[mid1] <span class="syn-op">==</span> target) <span class="syn-kw">return</span> mid1;',
            '        <span class="syn-kw">if</span> (arr[mid2] <span class="syn-op">==</span> target) <span class="syn-kw">return</span> mid2;',
            '        <span class="syn-kw">if</span> (target <span class="syn-op">&lt;</span> arr[mid1]) high = mid1 <span class="syn-op">-</span> <span class="syn-num">1</span>;',
            '        <span class="syn-kw">else</span> <span class="syn-kw">if</span> (target <span class="syn-op">&gt;</span> arr[mid2]) low = mid2 <span class="syn-op">+</span> <span class="syn-num">1</span>;',
            '        <span class="syn-kw">else</span> { low = mid1 <span class="syn-op">+</span> <span class="syn-num">1</span>; high = mid2 <span class="syn-op">-</span> <span class="syn-num">1</span>; }',
            '    }',
            '    <span class="syn-kw">return</span> <span class="syn-op">-</span><span class="syn-num">1</span>;',
            '}'
        ],
        12: [
            '<span class="syn-kw">int</span> <span class="syn-fn">jumpSearch</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n, <span class="syn-kw">int</span> target) {',
            '    <span class="syn-kw">int</span> step = <span class="syn-fn">sqrt</span>(n), prev = <span class="syn-num">0</span>;',
            '    <span class="syn-kw">while</span> (arr[<span class="syn-fn">min</span>(step, n) <span class="syn-op">-</span> <span class="syn-num">1</span>] <span class="syn-op">&lt;</span> target) {',
            '        prev = step; step <span class="syn-op">+=</span> <span class="syn-fn">sqrt</span>(n);',
            '        <span class="syn-kw">if</span> (prev <span class="syn-op">&gt;=</span> n) <span class="syn-kw">return</span> <span class="syn-op">-</span><span class="syn-num">1</span>;',
            '    }',
            '    <span class="syn-kw">while</span> (arr[prev] <span class="syn-op">&lt;</span> target) { prev<span class="syn-op">++</span>; <span class="syn-kw">if</span> (prev <span class="syn-op">==</span> <span class="syn-fn">min</span>(step, n)) <span class="syn-kw">return</span> <span class="syn-op">-</span><span class="syn-num">1</span>; }',
            '    <span class="syn-kw">if</span> (arr[prev] <span class="syn-op">==</span> target) <span class="syn-kw">return</span> prev;',
            '    <span class="syn-kw">return</span> <span class="syn-op">-</span><span class="syn-num">1</span>;',
            '}'
        ],
        13: [
            '<span class="syn-kw">int</span> <span class="syn-fn">exponentialSearch</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n, <span class="syn-kw">int</span> target) {',
            '    <span class="syn-kw">if</span> (arr[<span class="syn-num">0</span>] <span class="syn-op">==</span> target) <span class="syn-kw">return</span> <span class="syn-num">0</span>;',
            '    <span class="syn-kw">int</span> i = <span class="syn-num">1</span>;',
            '    <span class="syn-kw">while</span> (i <span class="syn-op">&lt;</span> n <span class="syn-op">&amp;&amp;</span> arr[i] <span class="syn-op">&lt;=</span> target) i <span class="syn-op">*=</span> <span class="syn-num">2</span>;',
            '    <span class="syn-kw">return</span> <span class="syn-fn">binarySearch</span>(arr, i <span class="syn-op">/</span> <span class="syn-num">2</span>, <span class="syn-fn">min</span>(i, n <span class="syn-op">-</span> <span class="syn-num">1</span>), target);',
            '}'
        ]
    };

    const algoConfigs = {
        // Sorting Algorithms (1-8)
        1: { title: "🫧 Bubble Sort", complexity: "O(n²)", isSearch: false, func: (arr) => engine.bubbleSort(arr) },
        2: { title: "📥 Insertion Sort", complexity: "O(n²)", isSearch: false, func: (arr) => engine.insertionSort(arr) },
        3: { title: "🎯 Selection Sort", complexity: "O(n²)", isSearch: false, func: (arr) => engine.selectionSort(arr) },
        4: { title: "⚡ Quick Sort", complexity: "O(n log n)", isSearch: false, func: (arr) => engine.quickSort(arr) },
        5: { title: "🔀 Merge Sort", complexity: "O(n log n)", isSearch: false, func: (arr) => engine.mergeSort(arr) },
        6: { title: "🌲 Heap Sort", complexity: "O(n log n)", isSearch: false, func: (arr) => engine.heapSort(arr) },
        7: { title: "📊 Counting Sort", complexity: "O(n + k)", isSearch: false, func: (arr) => engine.countingSort(arr) },
        8: { title: "🔢 Radix Sort", complexity: "O(nk)", isSearch: false, func: (arr) => engine.radixSort(arr) },

        // Searching Algorithms (9-13)
        9: { title: "🔍 Linear Search", complexity: "O(n)", isSearch: true, func: (arr, tgt) => engine.linearSearch(arr, tgt) },
        10: { title: "🎯 Binary Search", complexity: "O(log n)", isSearch: true, func: (arr, tgt) => engine.binarySearch(arr, tgt) },
        11: { title: "🔱 Ternary Search", complexity: "O(log₃ n)", isSearch: true, func: (arr, tgt) => engine.ternarySearch(arr, tgt) },
        12: { title: "🦘 Jump Search", complexity: "O(√n)", isSearch: true, func: (arr, tgt) => engine.jumpSearch(arr, tgt) },
        13: { title: "🚀 Exponential Search", complexity: "O(log n)", isSearch: true, func: (arr, tgt) => engine.exponentialSearch(arr, tgt) }
    };

    /* =========================================================
       WEB AUDIO API SYNTHESIZER
       ========================================================= */
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playTone(freq, duration = 0.08, type = 'sine') {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {}
    }

    function playCompletionChime() {
        if (!soundEnabled) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                playTone(freq, 0.25, 'triangle');
            }, idx * 90);
        });
    }

    soundToggleBtn.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
        soundToggleBtn.innerHTML = `<span id="soundIcon">${soundIcon.textContent}</span> Sound: ${soundEnabled ? 'ON' : 'OFF'}`;
        if (soundEnabled) {
            initAudio();
            playTone(440, 0.1);
        }
    });

    // Initialize Visitor Counter
    function initVisitorCounter() {
        let visits = parseInt(localStorage.getItem("sort_3d_visits") || "0", 10) + 1;
        localStorage.setItem("sort_3d_visits", visits);
        visitorCountEl.textContent = `Visits: ${visits}`;

        fetch("https://api.counterapi.dev/v1/sorting-visualizer-sibanand-3d/visits/up")
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

            // Toggle Target input visibility if searching
            const cfg = algoConfigs[currentAlgo];
            if (cfg.isSearch) {
                targetInputGroup.style.display = "flex";
                if (!currentArray.includes(searchTarget)) {
                    searchTarget = currentArray[Math.floor(currentArray.length / 2)] || 25;
                    targetInputVal.value = searchTarget;
                }
            } else {
                targetInputGroup.style.display = "none";
            }

            resetVisualizer();
        });
    });

    // Target Value Change
    targetInputVal.addEventListener("change", () => {
        searchTarget = parseInt(targetInputVal.value, 10) || 25;
        resetVisualizer();
    });

    targetRandomBtn.addEventListener("click", () => {
        if (currentArray.length > 0) {
            searchTarget = currentArray[Math.floor(Math.random() * currentArray.length)];
            targetInputVal.value = searchTarget;
            resetVisualizer();
        }
    });

    /* =========================================================
       THREE.JS 3D ISOMETRIC ENGINE (High-Visibility Tuning)
       ========================================================= */
    let threeScene, threeCamera, threeRenderer, threeControls;
    let threePillarMeshes = [];

    function initThreeEngine() {
        if (threeRenderer || !window.THREE) return;

        const width = threeStage.clientWidth || 750;
        const height = threeStage.clientHeight || 480;

        threeScene = new THREE.Scene();
        threeScene.background = new THREE.Color(0x040711);

        threeCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        setCameraView("iso");

        threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        threeRenderer.setSize(width, height);
        threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        threeRenderer.shadowMap.enabled = true;
        threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        threeStage.appendChild(threeRenderer.domElement);

        if (window.THREE.OrbitControls) {
            threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
            threeControls.enableDamping = true;
            threeControls.dampingFactor = 0.05;
            threeControls.maxPolarAngle = Math.PI / 2 - 0.04;
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        threeScene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(12, 22, 16);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        threeScene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
        fillLight.position.set(-12, 14, -10);
        threeScene.add(fillLight);

        const gridHelper = new THREE.GridHelper(26, 26, 0x38bdf8, 0x1e293b);
        gridHelper.position.y = 0;
        threeScene.add(gridHelper);

        const floorGeom = new THREE.PlaneGeometry(30, 30);
        const floorMat = new THREE.MeshStandardMaterial({ 
            color: 0x050811, 
            roughness: 0.15, 
            metalness: 0.85 
        });
        const floorMesh = new THREE.Mesh(floorGeom, floorMat);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.y = -0.01;
        floorMesh.receiveShadow = true;
        threeScene.add(floorMesh);

        window.addEventListener("resize", () => {
            if (threeRenderer && threeStage) {
                const w = threeStage.clientWidth;
                const h = threeStage.clientHeight || 480;
                threeCamera.aspect = w / h;
                threeCamera.updateProjectionMatrix();
                threeRenderer.setSize(w, h);
            }
        });

        function animateLoop() {
            requestAnimationFrame(animateLoop);
            if (threeControls) threeControls.update();
            if (threeRenderer && threeScene && threeCamera) {
                threeRenderer.render(threeScene, threeCamera);
            }
        }
        animateLoop();
    }

    function setCameraView(preset) {
        if (!threeCamera) return;
        if (preset === "iso") {
            threeCamera.position.set(0, 10, 16);
            if (threeControls) threeControls.target.set(0, 2.5, 0);
        } else if (preset === "front") {
            threeCamera.position.set(0, 4.5, 17);
            if (threeControls) threeControls.target.set(0, 2.5, 0);
        } else if (preset === "top") {
            threeCamera.position.set(0, 20, 0.1);
            if (threeControls) threeControls.target.set(0, 0, 0);
        }
        if (threeControls) threeControls.update();
    }

    camIsoBtn.addEventListener("click", () => setCameraView("iso"));
    camFrontBtn.addEventListener("click", () => setCameraView("front"));
    camTopBtn.addEventListener("click", () => setCameraView("top"));

    // View Switcher (3D vs 2D)
    view3dBtn.addEventListener("click", () => {
        is3dView = true;
        view3dBtn.classList.add("active");
        view2dBtn.classList.remove("active");
        threeStage.style.display = "block";
        barsContainer.style.display = "none";
        renderStep(currentStepIdx);
    });

    view2dBtn.addEventListener("click", () => {
        is3dView = false;
        view2dBtn.classList.add("active");
        view3dBtn.classList.remove("active");
        threeStage.style.display = "none";
        barsContainer.style.display = "flex";
        renderStep(currentStepIdx);
    });

    // High-Resolution Razor Sharp 3D Value Sprite
    function createValueSprite(text, color = "#ffffff", isTarget = false) {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        // Background pill badge
        ctx.fillStyle = isTarget ? "rgba(16, 185, 129, 0.95)" : "rgba(10, 15, 30, 0.85)";
        ctx.strokeStyle = isTarget ? "#10b981" : "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(32, 20, 192, 88, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isTarget ? "#022c22" : color;
        ctx.font = "Bold 52px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 128, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1.8, 0.9, 1);
        return sprite;
    }

    function render3DFrame(frame) {
        if (!threeScene) return;

        threePillarMeshes.forEach(mesh => threeScene.remove(mesh));
        threePillarMeshes = [];

        const arr = frame.array;
        const n = arr.length;
        const maxVal = Math.max(...arr, 10);
        const totalWidth = 14.5;
        const spacing = totalWidth / Math.max(n - 1, 1);
        const startX = -totalWidth / 2;

        arr.forEach((val, idx) => {
            const height = Math.max(0.6, (val / maxVal) * 7.2);
            const radius = Math.min(0.55, spacing * 0.4);

            let hexColor = 0x334155;
            let emissiveColor = 0x000000;
            let badgeColor = "#ffffff";
            let isTarget = false;

            if (frame.highlights.sorted.includes(idx)) {
                // Found Target or Sorted
                hexColor = 0x10b981; // Emerald Green
                emissiveColor = 0x065f46;
                badgeColor = "#a7f3d0";
                isTarget = true;
            } else if (frame.highlights.swap.includes(idx)) {
                hexColor = 0xef4444; // Neon Red Swap
                emissiveColor = 0x991b1b;
                badgeColor = "#fca5a5";
            } else if (frame.highlights.compare.includes(idx)) {
                hexColor = 0xf59e0b; // Amber Active Search Probe
                emissiveColor = 0x92400e;
                badgeColor = "#fde68a";
            } else if (frame.highlights.pivot.includes(idx)) {
                hexColor = 0xa855f7; // Purple Pivot / Range
                emissiveColor = 0x6b21a8;
                badgeColor = "#e9d5ff";
            } else if (frame.highlights.active.includes(idx)) {
                hexColor = 0x38bdf8; // Neon Cyan In-Scope Range
                emissiveColor = 0x0369a1;
                badgeColor = "#bae6fd";
            }

            const geom = new THREE.CylinderGeometry(radius, radius, height, 32);
            const mat = new THREE.MeshStandardMaterial({
                color: hexColor,
                emissive: emissiveColor,
                roughness: 0.12,
                metalness: 0.65
            });

            const mesh = new THREE.Mesh(geom, mat);
            const posX = startX + idx * spacing;
            mesh.position.set(posX, height / 2, 0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const sprite = createValueSprite(String(val), badgeColor, isTarget);
            sprite.position.set(0, height / 2 + 0.75, 0);
            mesh.add(sprite);

            threeScene.add(mesh);
            threePillarMeshes.push(mesh);
        });
    }

    // Render Code Execution Lines in Editor Box
    function renderCodeEditor(algoId) {
        const codeLines = algoSourceCodes[algoId] || [];
        codeEditorBox.innerHTML = "";

        codeLines.forEach((htmlLine, idx) => {
            const lineNum = idx + 1;
            const row = document.createElement("div");
            row.className = "code-row";
            row.id = `codeRow_${lineNum}`;
            row.innerHTML = `
                <span class="code-arrow">▶</span>
                <span class="code-num">${lineNum}</span>
                <span class="code-txt">${htmlLine}</span>
            `;
            codeEditorBox.appendChild(row);
        });
    }

    // Array Generation Logic
    function generateInitialArray() {
        const type = arrayTypeSelect.value;
        manualInputRow.style.display = (type === "manual") ? "block" : "none";

        if (type === "custom_8") {
            currentArray = [64, 34, 25, 12, 22, 11, 90, 45];
            arraySize = currentArray.length;
            sizeSlider.value = arraySize;
            sizeValue.textContent = arraySize;
            return;
        }

        if (type === "manual") {
            const parsed = manualInputText.value.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
            if (parsed.length > 0) {
                currentArray = parsed.slice(0, 50);
            } else {
                currentArray = [64, 34, 25, 12, 22, 11, 90, 45];
            }
            arraySize = currentArray.length;
            sizeSlider.value = arraySize;
            sizeValue.textContent = arraySize;
            return;
        }

        currentArray = [];
        if (type === "random") {
            for (let i = 0; i < arraySize; i++) {
                currentArray.push(Math.floor(Math.random() * 90) + 10);
            }
        } else if (type === "reversed") {
            for (let i = 0; i < arraySize; i++) {
                currentArray.push(Math.floor(100 - (i * (90 / arraySize))));
            }
        } else if (type === "nearly") {
            for (let i = 0; i < arraySize; i++) {
                currentArray.push(Math.floor(10 + (i * (90 / arraySize))));
            }
            for (let s = 0; s < Math.max(1, Math.floor(arraySize / 4)); s++) {
                const idx1 = Math.floor(Math.random() * arraySize);
                const idx2 = Math.floor(Math.random() * arraySize);
                const tmp = currentArray[idx1];
                currentArray[idx1] = currentArray[idx2];
                currentArray[idx2] = tmp;
            }
        } else if (type === "few_unique") {
            const setValues = [20, 45, 75, 95];
            for (let i = 0; i < arraySize; i++) {
                currentArray.push(setValues[Math.floor(Math.random() * setValues.length)]);
            }
        }
    }

    sizeSlider.addEventListener("input", (e) => {
        arraySize = parseInt(e.target.value, 10);
        sizeValue.textContent = arraySize;
        if (arrayTypeSelect.value !== "manual" && arrayTypeSelect.value !== "custom_8") {
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
        currentAlgoTitle.textContent = `${cfg.title} (3D Isometric)`;
        metricComplexity.textContent = cfg.complexity;

        renderCodeEditor(currentAlgo);

        // Generate Steps from SortingEngine (Searching or Sorting)
        if (cfg.isSearch) {
            steps = cfg.func([...currentArray], searchTarget);
        } else {
            steps = cfg.func([...currentArray]);
        }

        currentStepIdx = 0;

        consoleBody.innerHTML = `<div class="console-line highlight">Initialized ${cfg.title} on [${currentArray.join(', ')}]${cfg.isSearch ? ` with target ${searchTarget}` : ''}.</div>`;
        initThreeEngine();
        renderStep(0);
    }

    // Render Step Frame
    function renderStep(stepIdx) {
        if (!steps || steps.length === 0) return;
        const frame = steps[Math.min(stepIdx, steps.length - 1)];

        // 1. Update 3D / 2D View
        render3DFrame(frame);

        barsContainer.innerHTML = "";
        const maxVal = Math.max(...frame.array, 10);

        frame.array.forEach((val, idx) => {
            const bar = document.createElement("div");
            bar.className = "bar";
            bar.style.height = `${Math.max(10, (val / maxVal) * 92)}%`;

            if (frame.highlights.sorted.includes(idx)) {
                bar.classList.add("sorted");
            } else if (frame.highlights.swap.includes(idx)) {
                bar.classList.add("swap");
            } else if (frame.highlights.compare.includes(idx)) {
                bar.classList.add("compare");
            } else if (frame.highlights.pivot.includes(idx)) {
                bar.classList.add("pivot");
            } else if (frame.highlights.active.includes(idx)) {
                bar.classList.add("compare");
            }

            if (arraySize <= 25) {
                bar.textContent = val;
            }
            barsContainer.appendChild(bar);
        });

        // 2. Update Metrics
        metricComparisons.textContent = frame.metrics.comparisons;
        metricSwaps.textContent = frame.metrics.swaps;
        const pct = Math.round(((stepIdx + 1) / steps.length) * 100);
        metricProgress.textContent = `${pct}%`;

        // 3. Highlight Executing Line in Code Editor
        document.querySelectorAll(".code-row").forEach(row => {
            row.className = "code-row";
        });

        const activeLine = frame.codeLine || 1;
        const activeRow = document.getElementById(`codeRow_${activeLine}`);
        if (activeRow) {
            if (frame.highlights.swap.length > 0) {
                activeRow.classList.add("active-swap");
            } else if (frame.highlights.compare.length > 0) {
                activeRow.classList.add("active-compare");
            } else {
                activeRow.classList.add("active");
            }
            activeRow.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }

        // 4. Update Live Variable Inspector Badges
        let varBadgesHtml = "";
        const vars = frame.vars || {};

        if (vars.target !== undefined) varBadgesHtml += `<span class="var-badge highlight">Target = ${vars.target}</span>`;
        if (vars.i !== undefined) varBadgesHtml += `<span class="var-badge">i = ${vars.i}</span>`;
        if (vars.j !== undefined) varBadgesHtml += `<span class="var-badge">j = ${vars.j}</span>`;
        if (vars.low !== undefined) varBadgesHtml += `<span class="var-badge">low = ${vars.low}</span>`;
        if (vars.high !== undefined) varBadgesHtml += `<span class="var-badge">high = ${vars.high}</span>`;
        if (vars.mid !== undefined) varBadgesHtml += `<span class="var-badge highlight">mid = ${vars.mid}</span>`;
        if (vars.mid1 !== undefined) varBadgesHtml += `<span class="var-badge highlight">mid1 = ${vars.mid1}</span>`;
        if (vars.mid2 !== undefined) varBadgesHtml += `<span class="var-badge highlight">mid2 = ${vars.mid2}</span>`;
        if (vars.key !== undefined) varBadgesHtml += `<span class="var-badge highlight">key = ${vars.key}</span>`;
        if (vars.pivot !== undefined) varBadgesHtml += `<span class="var-badge highlight">pivot = ${vars.pivot}</span>`;
        if (vars.minIdx !== undefined) varBadgesHtml += `<span class="var-badge highlight">min_idx = ${vars.minIdx}</span>`;

        if (vars.condition) {
            varBadgesHtml += `<span class="var-badge highlight">${vars.condition}</span>`;
        }
        if (vars.action) {
            varBadgesHtml += `<span class="var-badge swap-highlight">${vars.action}</span>`;
        }
        if (vars.status) {
            const isMatch = vars.status.includes("MATCH");
            varBadgesHtml += `<span class="var-badge ${isMatch ? 'highlight' : 'swap-highlight'}">${vars.status}</span>`;
        }

        if (!varBadgesHtml) {
            varBadgesHtml = `<span class="var-badge">State: Step ${stepIdx + 1}/${steps.length}</span>`;
        }

        varBadges.innerHTML = varBadgesHtml;

        // 5. Sound Synthesizer FX
        if (frame.highlights.sorted.length > 0 && stepIdx === steps.length - 1) {
            playCompletionChime();
        } else if (frame.highlights.swap.length > 0) {
            const swapVal = frame.array[frame.highlights.swap[0]] || 50;
            playTone(300 + (swapVal / maxVal) * 500, 0.08, 'sawtooth');
        } else if (frame.highlights.compare.length > 0) {
            const compVal = frame.array[frame.highlights.compare[0]] || 50;
            playTone(250 + (compVal / maxVal) * 600, 0.06, 'sine');
        }

        // 6. Log to Terminal
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
        initAudio();
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

    // Initial startup
    resetVisualizer();
});
