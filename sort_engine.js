/**
 * Sorting Algorithm Engine & Step Generator
 * Records fine-grained code line highlights, variable inspector state, and 3D visual frames.
 * 
 * Frame Structure:
 * {
 *   array: Array<number>,
 *   highlights: { compare: [], swap: [], pivot: [], sorted: [], active: [] },
 *   codeLine: number, // 1-indexed line in the algorithm code
 *   vars: { i, j, minIdx, pivot, key, condition, pass },
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

    recordStep(arr, highlights = {}, log = "", codeLine = 1, vars = {}) {
        this.steps.push({
            array: [...arr],
            highlights: {
                compare: highlights.compare || [],
                swap: highlights.swap || [],
                pivot: highlights.pivot || [],
                sorted: highlights.sorted || [],
                active: highlights.active || []
            },
            codeLine: codeLine,
            vars: vars,
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

        this.recordStep(arr, {}, "Started Bubble Sort.", 1, { n });

        for (let i = 0; i < n - 1; i++) {
            this.recordStep(arr, { sorted: [...sortedIndices] }, `Pass ${i + 1}: Starting outer loop i = ${i}`, 2, { i, n });
            let swapped = false;

            for (let j = 0; j < n - i - 1; j++) {
                this.recordStep(arr, { compare: [j, j + 1], sorted: [...sortedIndices] }, `Checking inner loop j = ${j} (limit = ${n - i - 1})`, 3, { i, j, limit: n - i - 1 });

                this.comparisons++;
                const isGreater = arr[j] > arr[j + 1];
                const condStr = `arr[${j}] (${arr[j]}) > arr[${j + 1}] (${arr[j + 1]}) → ${isGreater ? 'TRUE (Swap)' : 'FALSE'}`;

                this.recordStep(
                    arr, 
                    { compare: [j, j + 1], sorted: [...sortedIndices] }, 
                    `Comparing: ${condStr}`, 
                    4, 
                    { i, j, val1: arr[j], val2: arr[j + 1], condition: condStr }
                );

                if (isGreater) {
                    // Swap
                    const temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    this.swaps++;
                    swapped = true;

                    this.recordStep(
                        arr, 
                        { swap: [j, j + 1], sorted: [...sortedIndices] }, 
                        `Swapped arr[${j}] and arr[${j + 1}] (${arr[j + 1]} ↔ ${arr[j]})`, 
                        5, 
                        { i, j, val1: arr[j], val2: arr[j + 1], action: `Swapped (${arr[j]} ↔ ${arr[j + 1]})` }
                    );
                }
            }

            sortedIndices.push(n - 1 - i);
            this.recordStep(
                arr, 
                { sorted: [...sortedIndices] }, 
                `Element at index ${n - 1 - i} (${arr[n - 1 - i]}) is locked in sorted position.`, 
                2, 
                { i, locked: n - 1 - i, sortedCount: sortedIndices.length }
            );

            if (!swapped) {
                this.recordStep(arr, { sorted: [...sortedIndices] }, "Array is already sorted! Early break.", 6, { i, swapped: false });
                break;
            }
        }

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Bubble Sort Complete! All elements sorted.", 7, { status: "Done" });
        return this.steps;
    }

    // 2. Insertion Sort 📥
    insertionSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;

        this.recordStep(arr, {}, "Started Insertion Sort.", 1, { n });

        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;

            this.recordStep(arr, { pivot: [i] }, `Outer loop: Selected key = arr[${i}] (${key})`, 2, { i, key });

            while (j >= 0 && arr[j] > key) {
                this.comparisons++;
                const condStr = `arr[${j}] (${arr[j]}) > key (${key}) → TRUE (Shift Right)`;

                this.recordStep(arr, { compare: [j, j + 1], pivot: [i] }, condStr, 3, { i, j, key, condition: condStr });
                arr[j + 1] = arr[j];
                this.swaps++;
                j--;

                this.recordStep(arr, { swap: [j + 1, j + 2] }, `Shifted arr[${j + 1}] right to position ${j + 2}`, 4, { i, j, key, shifted: arr[j + 2] });
            }
            if (j >= 0) this.comparisons++;

            arr[j + 1] = key;
            const sortedRange = Array.from({ length: i + 1 }, (_, k) => k);
            this.recordStep(arr, { active: [j + 1], sorted: sortedRange }, `Inserted key (${key}) at position ${j + 1}`, 5, { i, insertedAt: j + 1, key });
        }

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Insertion Sort Complete!", 6, { status: "Done" });
        return this.steps;
    }

    // 3. Selection Sort 🎯
    selectionSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;
        const sortedIndices = [];

        this.recordStep(arr, {}, "Started Selection Sort.", 1, { n });

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            this.recordStep(arr, { pivot: [minIdx], sorted: [...sortedIndices] }, `Pass ${i + 1}: Setting min_idx = ${i} (${arr[i]})`, 2, { i, minIdx, minVal: arr[minIdx] });

            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                const isSmaller = arr[j] < arr[minIdx];
                const condStr = `arr[${j}] (${arr[j]}) < arr[${minIdx}] (${arr[minIdx]}) → ${isSmaller ? 'New Min' : 'False'}`;

                this.recordStep(arr, { compare: [j, minIdx], pivot: [minIdx], sorted: [...sortedIndices] }, `Comparing: ${condStr}`, 3, { i, j, minIdx, condition: condStr });

                if (isSmaller) {
                    minIdx = j;
                    this.recordStep(arr, { pivot: [minIdx], sorted: [...sortedIndices] }, `Updated min_idx = ${minIdx} (${arr[minIdx]})`, 4, { i, j, minIdx, minVal: arr[minIdx] });
                }
            }

            if (minIdx !== i) {
                const temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
                this.swaps++;
                this.recordStep(arr, { swap: [i, minIdx], sorted: [...sortedIndices] }, `Swapped position ${i} (${temp}) with min position ${minIdx} (${arr[i]})`, 5, { i, minIdx, swapped: `${temp} ↔ ${arr[i]}` });
            }
            sortedIndices.push(i);
        }

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Selection Sort Complete!", 6, { status: "Done" });
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
            this.recordStep(arr, { pivot: [high], sorted: Array.from(sortedSet) }, `Pivot chosen: ${pivotVal} (arr[${high}])`, 2, { low, high, pivot: pivotVal });
            let i = low - 1;

            for (let j = low; j < high; j++) {
                this.comparisons++;
                const isLess = arr[j] < pivotVal;
                const condStr = `arr[${j}] (${arr[j]}) < pivot (${pivotVal}) → ${isLess ? 'Swap i & j' : 'False'}`;

                this.recordStep(arr, { compare: [j, high], pivot: [high], sorted: Array.from(sortedSet) }, condStr, 3, { low, high, i, j, pivot: pivotVal, condition: condStr });

                if (isLess) {
                    i++;
                    if (i !== j) {
                        const temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                        this.swaps++;
                        this.recordStep(arr, { swap: [i, j], pivot: [high], sorted: Array.from(sortedSet) }, `Swapped arr[${i}] (${arr[j]}) and arr[${j}] (${arr[i]})`, 4, { i, j, pivot: pivotVal });
                    }
                }
            }

            const temp = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp;
            this.swaps++;
            sortedSet.add(i + 1);
            this.recordStep(arr, { swap: [i + 1, high], sorted: Array.from(sortedSet) }, `Placed pivot ${pivotVal} at correct index ${i + 1}`, 5, { pivotIndex: i + 1, pivot: pivotVal });
            return i + 1;
        };

        const quickSortHelper = (low, high) => {
            if (low < high) {
                this.recordStep(arr, { sorted: Array.from(sortedSet) }, `quickSort(low=${low}, high=${high})`, 1, { low, high });
                const pi = partition(low, high);
                quickSortHelper(low, pi - 1);
                quickSortHelper(pi + 1, high);
            } else if (low === high) {
                sortedSet.add(low);
            }
        };

        this.recordStep(arr, {}, "Started Quick Sort.", 1, { n });
        quickSortHelper(0, n - 1);

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Quick Sort Complete!", 6, { status: "Done" });
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

            this.recordStep(arr, { active: Array.from({ length: right - left + 1 }, (_, idx) => left + idx) }, `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`, 3, { left, mid, right });

            while (i < L.length && j < R.length) {
                this.comparisons++;
                const isLeftSmaller = L[i] <= R[j];
                const condStr = `L[${i}] (${L[i]}) <= R[${j}] (${R[j]}) → ${isLeftSmaller ? 'Take Left' : 'Take Right'}`;

                this.recordStep(arr, { compare: [left + i, mid + 1 + j] }, condStr, 4, { i, j, k, condition: condStr });

                if (isLeftSmaller) {
                    arr[k] = L[i];
                    i++;
                } else {
                    arr[k] = R[j];
                    j++;
                }
                this.swaps++;
                this.recordStep(arr, { active: [k] }, `Placed ${arr[k]} at merged position ${k}`, 5, { k, val: arr[k] });
                k++;
            }

            while (i < L.length) {
                arr[k] = L[i];
                this.swaps++;
                this.recordStep(arr, { active: [k] }, `Copied remaining left element ${L[i]} to index ${k}`, 5, { k, val: L[i] });
                i++; k++;
            }

            while (j < R.length) {
                arr[k] = R[j];
                this.swaps++;
                this.recordStep(arr, { active: [k] }, `Copied remaining right element ${R[j]} to index ${k}`, 5, { k, val: R[j] });
                j++; k++;
            }
        };

        const mergeSortHelper = (left, right) => {
            if (left < right) {
                const mid = Math.floor(left + (right - left) / 2);
                this.recordStep(arr, {}, `Divide: mid = ${mid}`, 2, { left, mid, right });
                mergeSortHelper(left, mid);
                mergeSortHelper(mid + 1, right);
                merge(left, mid, right);
            }
        };

        this.recordStep(arr, {}, "Started Merge Sort.", 1, { n });
        mergeSortHelper(0, n - 1);

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Merge Sort Complete!", 6, { status: "Done" });
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
                this.recordStep(arr, { compare: [i, largest], sorted: [...sortedIndices] }, `Heapify: Node ${i} (${arr[i]}) < largest child ${largest} (${arr[largest]})`, 4, { i, largest, size });
                const temp = arr[i];
                arr[i] = arr[largest];
                arr[largest] = temp;
                this.swaps++;
                this.recordStep(arr, { swap: [i, largest], sorted: [...sortedIndices] }, `Swapped node ${i} with child ${largest}`, 5, { i, largest, swapped: `${temp} ↔ ${arr[i]}` });
                heapify(size, largest);
            }
        };

        this.recordStep(arr, {}, "Started Heap Sort: Building Max Heap.", 1, { n });

        // Build Max Heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.recordStep(arr, { active: [i] }, `Heapifying subtree at index ${i}`, 2, { i, n });
            heapify(n, i);
        }
        this.recordStep(arr, {}, "Max Heap Built.", 2, { status: "Heap Ready" });

        // Extract elements from heap
        for (let i = n - 1; i > 0; i--) {
            this.recordStep(arr, { swap: [0, i], sorted: [...sortedIndices] }, `Moving max element (${arr[0]}) to end at position ${i}`, 3, { root: arr[0], endPos: i });
            const temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            this.swaps++;
            sortedIndices.push(i);
            this.recordStep(arr, { sorted: [...sortedIndices] }, `Index ${i} locked in sorted position.`, 4, { locked: i });
            heapify(i, 0);
        }
        sortedIndices.push(0);

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Heap Sort Complete!", 6, { status: "Done" });
        return this.steps;
    }

    // 7. Counting Sort 📊 (non-negative integers)
    countingSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;

        this.recordStep(arr, {}, "Started Counting Sort.", 1, { n });

        const minVal = Math.min(...arr);
        if (minVal < 0) {
            this.recordStep(arr, {}, "Error: Counting Sort requires non-negative integers.", 1, { error: "Negative values" });
            return this.steps;
        }

        const maxVal = Math.max(...arr);
        const count = new Array(maxVal + 1).fill(0);

        for (let i = 0; i < n; i++) {
            count[arr[i]]++;
            this.recordStep(arr, { active: [i] }, `Tallying: count[${arr[i]}] = ${count[arr[i]]}`, 2, { i, val: arr[i], freq: count[arr[i]] });
        }

        let idx = 0;
        for (let i = 0; i <= maxVal; i++) {
            while (count[i] > 0) {
                arr[idx] = i;
                count[i]--;
                this.swaps++;
                this.recordStep(arr, { active: [idx] }, `Rebuilding array: placed ${i} at index ${idx}`, 3, { idx, val: i });
                idx++;
            }
        }

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Counting Sort Complete!", 4, { status: "Done" });
        return this.steps;
    }

    // 8. Radix Sort 🔢 (non-negative integers)
    radixSort(inputArr) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;

        this.recordStep(arr, {}, "Started Radix Sort.", 1, { n });

        const minVal = Math.min(...arr);
        if (minVal < 0) {
            this.recordStep(arr, {}, "Error: Radix Sort requires non-negative integers.", 1, { error: "Negative values" });
            return this.steps;
        }

        const maxVal = Math.max(...arr);

        for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
            this.recordStep(arr, {}, `Sorting place value exp = ${exp}`, 2, { exp });

            const output = new Array(n).fill(0);
            const count = new Array(10).fill(0);

            for (let i = 0; i < n; i++) {
                const digit = Math.floor(arr[i] / exp) % 10;
                count[digit]++;
                this.recordStep(arr, { active: [i] }, `Digit at place ${exp} for ${arr[i]} is ${digit}`, 3, { i, val: arr[i], digit, exp });
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

            this.recordStep(arr, {}, `Completed pass for place value ${exp}`, 4, { exp });
        }

        const allSorted = Array.from({ length: n }, (_, k) => k);
        this.recordStep(arr, { sorted: allSorted }, "Radix Sort Complete!", 5, { status: "Done" });
        return this.steps;
    }

    /* =========================================================
       SEARCHING ALGORITHMS
       ========================================================= */

    // 9. Linear Search 🔍 O(n)
    linearSearch(inputArr, target = 25) {
        this.resetMetrics();
        const arr = [...inputArr];
        const n = arr.length;

        this.recordStep(arr, {}, `Started Linear Search for target = ${target}`, 1, { target, n });

        for (let i = 0; i < n; i++) {
            this.comparisons++;
            const isMatch = arr[i] === target;
            const condStr = `arr[${i}] (${arr[i]}) == target (${target}) → ${isMatch ? 'FOUND!' : 'Not Equal'}`;

            this.recordStep(arr, { compare: [i] }, condStr, 2, { i, target, currentVal: arr[i], condition: condStr });

            if (isMatch) {
                this.recordStep(arr, { sorted: [i] }, `🎯 Element ${target} found at index ${i}!`, 3, { foundIndex: i, target, status: "MATCH FOUND" });
                return this.steps;
            }
        }

        this.recordStep(arr, {}, `❌ Element ${target} NOT found in array.`, 4, { target, status: "NOT FOUND" });
        return this.steps;
    }

    // 10. Binary Search 🎯 O(log n)
    binarySearch(inputArr, target = 25) {
        this.resetMetrics();
        // Binary search requires a sorted array
        const arr = [...inputArr].sort((a, b) => a - b);
        const n = arr.length;

        this.recordStep(arr, {}, `Sorted array for Binary Search. Target = ${target}`, 1, { target, n });

        let low = 0;
        let high = n - 1;

        while (low <= high) {
            const mid = Math.floor(low + (high - low) / 2);
            this.comparisons++;
            const midVal = arr[mid];

            const rangeIndices = Array.from({ length: high - low + 1 }, (_, k) => low + k);

            this.recordStep(
                arr, 
                { compare: [mid], active: rangeIndices }, 
                `Checking mid = ${mid} (arr[${mid}] = ${midVal}) in range [${low}..${high}]`, 
                2, 
                { low, high, mid, midVal, target }
            );

            if (midVal === target) {
                this.recordStep(
                    arr, 
                    { sorted: [mid] }, 
                    `🎯 Target ${target} FOUND at index ${mid}!`, 
                    3, 
                    { foundIndex: mid, target, status: "MATCH FOUND" }
                );
                return this.steps;
            } else if (midVal < target) {
                const condStr = `arr[${mid}] (${midVal}) < target (${target}) → Search Right (low = ${mid + 1})`;
                this.recordStep(
                    arr, 
                    { compare: [mid], active: rangeIndices }, 
                    condStr, 
                    4, 
                    { low, high, mid, condition: condStr }
                );
                low = mid + 1;
            } else {
                const condStr = `arr[${mid}] (${midVal}) > target (${target}) → Search Left (high = ${mid - 1})`;
                this.recordStep(
                    arr, 
                    { compare: [mid], active: rangeIndices }, 
                    condStr, 
                    5, 
                    { low, high, mid, condition: condStr }
                );
                high = mid - 1;
            }
        }

        this.recordStep(arr, {}, `❌ Element ${target} NOT found in array.`, 6, { target, status: "NOT FOUND" });
        return this.steps;
    }

    // 11. Ternary Search 🔱 O(log3 n)
    ternarySearch(inputArr, target = 25) {
        this.resetMetrics();
        const arr = [...inputArr].sort((a, b) => a - b);
        const n = arr.length;

        this.recordStep(arr, {}, `Sorted array for Ternary Search. Target = ${target}`, 1, { target, n });

        let low = 0;
        let high = n - 1;

        while (low <= high) {
            const mid1 = low + Math.floor((high - low) / 3);
            const mid2 = high - Math.floor((high - low) / 3);

            const rangeIndices = Array.from({ length: high - low + 1 }, (_, k) => low + k);

            this.comparisons += 2;
            this.recordStep(
                arr, 
                { compare: [mid1, mid2], active: rangeIndices }, 
                `Checking mid1 = ${mid1} (${arr[mid1]}) and mid2 = ${mid2} (${arr[mid2]}) in range [${low}..${high}]`, 
                2, 
                { low, high, mid1, mid2, val1: arr[mid1], val2: arr[mid2], target }
            );

            if (arr[mid1] === target) {
                this.recordStep(arr, { sorted: [mid1] }, `🎯 Target ${target} FOUND at mid1 (index ${mid1})!`, 3, { foundIndex: mid1, target, status: "MATCH FOUND" });
                return this.steps;
            }
            if (arr[mid2] === target) {
                this.recordStep(arr, { sorted: [mid2] }, `🎯 Target ${target} FOUND at mid2 (index ${mid2})!`, 3, { foundIndex: mid2, target, status: "MATCH FOUND" });
                return this.steps;
            }

            if (target < arr[mid1]) {
                this.recordStep(arr, { compare: [mid1], active: rangeIndices }, `target (${target}) < arr[${mid1}] (${arr[mid1]}) → Search Left segment [${low}..${mid1 - 1}]`, 4, { low, high: mid1 - 1, target });
                high = mid1 - 1;
            } else if (target > arr[mid2]) {
                this.recordStep(arr, { compare: [mid2], active: rangeIndices }, `target (${target}) > arr[${mid2}] (${arr[mid2]}) → Search Right segment [${mid2 + 1}..${high}]`, 5, { low: mid2 + 1, high, target });
                low = mid2 + 1;
            } else {
                this.recordStep(arr, { compare: [mid1, mid2], active: rangeIndices }, `Target is between arr[${mid1}] and arr[${mid2}] → Search Middle segment [${mid1 + 1}..${mid2 - 1}]`, 6, { low: mid1 + 1, high: mid2 - 1, target });
                low = mid1 + 1;
                high = mid2 - 1;
            }
        }

        this.recordStep(arr, {}, `❌ Element ${target} NOT found in array.`, 7, { target, status: "NOT FOUND" });
        return this.steps;
    }

    // 12. Jump Search 🦘 O(√n)
    jumpSearch(inputArr, target = 25) {
        this.resetMetrics();
        const arr = [...inputArr].sort((a, b) => a - b);
        const n = arr.length;
        const step = Math.floor(Math.sqrt(n));

        this.recordStep(arr, {}, `Sorted array for Jump Search. Step block = ${step}, Target = ${target}`, 1, { target, step, n });

        let prev = 0;
        let curr = step;

        while (curr < n && arr[Math.min(curr, n) - 1] < target) {
            this.comparisons++;
            this.recordStep(arr, { compare: [curr - 1] }, `Jumping block: arr[${curr - 1}] (${arr[curr - 1]}) < target (${target})`, 2, { prev, curr, target });
            prev = curr;
            curr += step;
        }

        this.recordStep(arr, { active: Array.from({ length: Math.min(curr, n) - prev }, (_, k) => prev + k) }, `Linear scanning block [${prev}..${Math.min(curr, n) - 1}]`, 3, { prev, curr: Math.min(curr, n), target });

        while (prev < Math.min(curr, n)) {
            this.comparisons++;
            this.recordStep(arr, { compare: [prev] }, `Inspecting arr[${prev}] (${arr[prev]}) == target (${target})`, 4, { prev, val: arr[prev], target });
            if (arr[prev] === target) {
                this.recordStep(arr, { sorted: [prev] }, `🎯 Target ${target} FOUND at index ${prev}!`, 5, { foundIndex: prev, target, status: "MATCH FOUND" });
                return this.steps;
            }
            if (arr[prev] > target) break;
            prev++;
        }

        this.recordStep(arr, {}, `❌ Element ${target} NOT found in array.`, 6, { target, status: "NOT FOUND" });
        return this.steps;
    }

    // 13. Exponential Search 🚀 O(log n)
    exponentialSearch(inputArr, target = 25) {
        this.resetMetrics();
        const arr = [...inputArr].sort((a, b) => a - b);
        const n = arr.length;

        this.recordStep(arr, {}, `Sorted array for Exponential Search. Target = ${target}`, 1, { target, n });

        this.comparisons++;
        if (arr[0] === target) {
            this.recordStep(arr, { sorted: [0] }, `🎯 Target ${target} FOUND at index 0!`, 2, { foundIndex: 0, target, status: "MATCH FOUND" });
            return this.steps;
        }

        let i = 1;
        while (i < n && arr[i] <= target) {
            this.comparisons++;
            this.recordStep(arr, { compare: [i] }, `Exponential jump: index i = ${i} (arr[${i}] = ${arr[i]}) <= target (${target})`, 3, { i, val: arr[i], target });
            i *= 2;
        }

        const low = Math.floor(i / 2);
        const high = Math.min(i, n - 1);
        this.recordStep(arr, { active: Array.from({ length: high - low + 1 }, (_, k) => low + k) }, `Target lies in range [${low}..${high}]. Running Binary Search.`, 4, { low, high, target });

        // Binary search in bounded range
        let l = low, r = high;
        while (l <= r) {
            const mid = Math.floor(l + (r - l) / 2);
            this.comparisons++;
            this.recordStep(arr, { compare: [mid] }, `Binary probing mid = ${mid} (${arr[mid]})`, 5, { l, r, mid, target });
            if (arr[mid] === target) {
                this.recordStep(arr, { sorted: [mid] }, `🎯 Target ${target} FOUND at index ${mid}!`, 6, { foundIndex: mid, target, status: "MATCH FOUND" });
                return this.steps;
            }
            if (arr[mid] < target) l = mid + 1;
            else r = mid - 1;
        }

        this.recordStep(arr, {}, `❌ Element ${target} NOT found in array.`, 7, { target, status: "NOT FOUND" });
        return this.steps;
    }
}

// Module export for Node & Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SortingEngine;
}

