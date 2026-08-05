/**
 * Sorting Algorithm Engine & Step Generator
 * Converts 8 C sorting algorithms into step frames for animated playback.
 * 
 * Frame Structure:
 * {
 *   type: 'compare' | 'swap' | 'overwrite' | 'mark_sorted' | 'pivot' | 'count_freq',
 *   array: Array<number>,
 *   highlights: { active: [], compare: [], swap: [], pivot: [], sorted: [] },
 *   log: string,
 *   metrics: { comparisons: number, swaps: number }
 * }
 */

class SortingEngine {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.steps = [];
    }

    resetMetrics() {
        this.comparisons = 0;
        this.swaps = 0;
        this.steps = [];
    }

    recordStep(arr, highlights = {}, log = "") {
        this.steps.push({
            array: [...arr],
            highlights: {
                compare: highlights.compare || [],
                swap: highlights.swap || [],
                pivot: highlights.pivot || [],
                sorted: highlights.sorted || [],
                active: highlights.active || []
            },
            log: log,
            metrics: {
                comparisons: this.comparisons,
                swaps: this.swaps
            }
        });
    }

    // 1. Bubble Sort 🫧
    bubbleSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;
        const sortedIndices = [];

        this.recordStep(arr, {}, "Started Bubble Sort.");

        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                this.recordStep(arr, { compare: [j, j + 1], sorted: [...sortedIndices] }, `Comparing elements at index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]})`);

                if (arr[j] > arr[j + 1]) {
                    // Swap
                    const temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    this.swaps++;
                    swapped = true;
                    this.recordStep(arr, { swap: [j, j + 1], sorted: [...sortedIndices] }, `Swapped ${arr[j + 1]} and ${arr[j]}`);
                }
            }
            sortedIndices.push(n - 1 - i);
            this.recordStep(arr, { sorted: [...sortedIndices] }, `Position ${n - 1 - i} is now in its final sorted place.`);
            if (!swapped) break;
        }

        // Mark remaining sorted
        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Bubble Sort Complete!");
        return this.steps;
    }

    // 2. Insertion Sort 📥
    insertionSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;

        this.recordStep(arr, {}, "Started Insertion Sort.");

        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;

            this.recordStep(arr, { pivot: [i] }, `Inserting key = ${key} (index ${i}) into sorted portion [0..${i - 1}]`);

            while (j >= 0 && arr[j] > key) {
                this.comparisons++;
                this.recordStep(arr, { compare: [j, j + 1], pivot: [i] }, `Comparing ${arr[j]} > ${key}. Shifting ${arr[j]} to index ${j + 1}`);
                arr[j + 1] = arr[j];
                this.swaps++;
                j--;
                this.recordStep(arr, { swap: [j + 1, j + 2] }, `Shifted element to index ${j + 2}`);
            }
            if (j >= 0) this.comparisons++;

            arr[j + 1] = key;
            const sortedRange = Array.from({ length: i + 1 }, (_, k) => k);
            this.recordStep(arr, { active: [j + 1], sorted: sortedRange }, `Placed key ${key} at index ${j + 1}`);
        }

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Insertion Sort Complete!");
        return this.steps;
    }

    // 3. Selection Sort 🎯
    selectionSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;
        const sortedIndices = [];

        this.recordStep(arr, {}, "Started Selection Sort.");

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            this.recordStep(arr, { pivot: [minIdx], sorted: [...sortedIndices] }, `Finding minimum element starting from index ${i}`);

            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                this.recordStep(arr, { compare: [j, minIdx], pivot: [minIdx], sorted: [...sortedIndices] }, `Comparing index ${j} (${arr[j]}) with current min at index ${minIdx} (${arr[minIdx]})`);
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                    this.recordStep(arr, { pivot: [minIdx], sorted: [...sortedIndices] }, `New minimum found: ${arr[minIdx]} at index ${minIdx}`);
                }
            }

            if (minIdx !== i) {
                const temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
                this.swaps++;
                this.recordStep(arr, { swap: [i, minIdx], sorted: [...sortedIndices] }, `Swapped position ${i} (${temp}) with min position ${minIdx} (${arr[i]})`);
            }
            sortedIndices.push(i);
        }

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Selection Sort Complete!");
        return this.steps;
    }

    // 4. Quick Sort ⚡
    quickSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;
        const sortedSet = new Set();

        const partition = (low, high) => {
            const pivotVal = arr[high];
            this.recordStep(arr, { pivot: [high], sorted: Array.from(sortedSet) }, `Pivot chosen: ${pivotVal} at index ${high}`);
            let i = low - 1;

            for (let j = low; j < high; j++) {
                this.comparisons++;
                this.recordStep(arr, { compare: [j, high], pivot: [high], sorted: Array.from(sortedSet) }, `Comparing ${arr[j]} at pos ${j} to pivot ${pivotVal}`);
                if (arr[j] < pivotVal) {
                    i++;
                    if (i !== j) {
                        const temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                        this.swaps++;
                        this.recordStep(arr, { swap: [i, j], pivot: [high], sorted: Array.from(sortedSet) }, `Swapped index ${i} (${arr[i]}) and index ${j} (${arr[j]})`);
                    }
                }
            }

            const temp = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp;
            this.swaps++;
            sortedSet.add(i + 1);
            this.recordStep(arr, { sorted: Array.from(sortedSet) }, `Placed pivot ${pivotVal} at its correct position ${i + 1}`);
            return i + 1;
        };

        const quickSortHelper = (low, high) => {
            if (low < high) {
                const pi = partition(low, high);
                quickSortHelper(low, pi - 1);
                quickSortHelper(pi + 1, high);
            } else if (low === high) {
                sortedSet.add(low);
            }
        };

        this.recordStep(arr, {}, "Started Quick Sort.");
        quickSortHelper(0, n - 1);

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Quick Sort Complete!");
        return this.steps;
    }

    // 5. Merge Sort 🔀
    mergeSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;

        const merge = (left, mid, right) => {
            const L = arr.slice(left, mid + 1);
            const R = arr.slice(mid + 1, right + 1);
            let i = 0, j = 0, k = left;

            this.recordStep(arr, { active: Array.from({ length: right - left + 1 }, (_, idx) => left + idx) }, `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`);

            while (i < L.length && j < R.length) {
                this.comparisons++;
                this.recordStep(arr, { compare: [left + i, mid + 1 + j] }, `Comparing left [${L[i]}] vs right [${R[j]}]`);
                if (L[i] <= R[j]) {
                    arr[k] = L[i];
                    i++;
                } else {
                    arr[k] = R[j];
                    j++;
                }
                this.swaps++;
                this.recordStep(arr, { active: [k] }, `Placed ${arr[k]} at index ${k}`);
                k++;
            }

            while (i < L.length) {
                arr[k] = L[i];
                this.swaps++;
                this.recordStep(arr, { active: [k] }, `Placed remaining left element ${L[i]} at index ${k}`);
                i++; k++;
            }

            while (j < R.length) {
                arr[k] = R[j];
                this.swaps++;
                this.recordStep(arr, { active: [k] }, `Placed remaining right element ${R[j]} at index ${k}`);
                j++; k++;
            }
        };

        const mergeSortHelper = (left, right) => {
            if (left < right) {
                const mid = Math.floor(left + (right - left) / 2);
                mergeSortHelper(left, mid);
                mergeSortHelper(mid + 1, right);
                merge(left, mid, right);
            }
        };

        this.recordStep(arr, {}, "Started Merge Sort.");
        mergeSortHelper(0, n - 1);

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Merge Sort Complete!");
        return this.steps;
    }

    // 6. Heap Sort 🌲
    heapSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;
        const sortedIndices = [];

        const heapify = (size, i) => {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < size) {
                this.comparisons++;
                if (arr[left] > arr[largest]) largest = left;
            }
            if (right < size) {
                this.comparisons++;
                if (arr[right] > arr[largest]) largest = right;
            }

            if (largest !== i) {
                this.recordStep(arr, { compare: [i, largest], sorted: [...sortedIndices] }, `Heapify: Sifting down node ${i} (${arr[i]}) with largest child ${largest} (${arr[largest]})`);
                const temp = arr[i];
                arr[i] = arr[largest];
                arr[largest] = temp;
                this.swaps++;
                this.recordStep(arr, { swap: [i, largest], sorted: [...sortedIndices] }, `Swapped node ${i} and ${largest}`);
                heapify(size, largest);
            }
        };

        this.recordStep(arr, {}, "Started Heap Sort.");

        // Build Max Heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(n, i);
        }
        this.recordStep(arr, {}, "Max Heap Built successfully.");

        // Extract elements from heap
        for (let i = n - 1; i > 0; i--) {
            this.recordStep(arr, { swap: [0, i], sorted: [...sortedIndices] }, `Moving max element (${arr[0]}) to end at index ${i}`);
            const temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            this.swaps++;
            sortedIndices.push(i);
            this.recordStep(arr, { sorted: [...sortedIndices] }, `Index ${i} fixed in sorted position.`);
            heapify(i, 0);
        }
        sortedIndices.push(0);

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Heap Sort Complete!");
        return this.steps;
    }

    // 7. Counting Sort 📊 (non-negative integers)
    countingSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;

        this.recordStep(arr, {}, "Started Counting Sort.");

        const minVal = Math.min(...arr);
        if (minVal < 0) {
            this.recordStep(arr, {}, "Error: Counting Sort requires non-negative integers.");
            return this.steps;
        }

        const maxVal = Math.max(...arr);
        const count = new Array(maxVal + 1).fill(0);

        for (let i = 0; i < n; i++) {
            count[arr[i]]++;
            this.recordStep(arr, { active: [i] }, `Counting frequency: arr[${i}] = ${arr[i]} (count = ${count[arr[i]]})`);
        }

        let idx = 0;
        for (let i = 0; i <= maxVal; i++) {
            while (count[i] > 0) {
                arr[idx] = i;
                count[i]--;
                this.swaps++;
                this.recordStep(arr, { active: [idx] }, `Rebuilding array: placed ${i} at index ${idx}`);
                idx++;
            }
        }

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Counting Sort Complete!");
        return this.steps;
    }

    // 8. Radix Sort 🔢 (non-negative integers)
    radixSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;

        this.recordStep(arr, {}, "Started Radix Sort.");

        const minVal = Math.min(...arr);
        if (minVal < 0) {
            this.recordStep(arr, {}, "Error: Radix Sort requires non-negative integers.");
            return this.steps;
        }

        const maxVal = Math.max(...arr);

        for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
            this.recordStep(arr, {}, `Sorting digit place value ${exp}`);

            const output = new Array(n).fill(0);
            const count = new Array(10).fill(0);

            for (let i = 0; i < n; i++) {
                const digit = Math.floor(arr[i] / exp) % 10;
                count[digit]++;
                this.recordStep(arr, { active: [i] }, `Digit at place ${exp} for ${arr[i]} is ${digit}`);
            }

            for (let i = 1; i < 10; i++) {
                count[i] += count[i - 1];
            }

            for (let i = n - 1; i >= 0; i--) {
                const digit = Math.floor(arr[i] / exp) % 10;
                output[count[digit] - 1] = arr[i];
                count[digit]--;
                this.swaps++;
            }

            for (let i = 0; i < n; i++) {
                arr[i] = output[i];
            }

            this.recordStep(arr, {}, `Completed pass for digit place value ${exp}`);
        }

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Radix Sort Complete!");
        return this.steps;
    }
}

// Module export for Node & Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SortingEngine;
}
