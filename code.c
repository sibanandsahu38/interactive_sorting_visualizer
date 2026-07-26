/*
 * Sorting Algorithm Visualizer (Text-Based)
 * --------------------------------------------
 * Implements 8 classic sorting algorithms, printing the array state
 * at each meaningful step so you can watch each one work:
 *   1. Bubble Sort
 *   2. Insertion Sort
 *   3. Selection Sort
 *   4. Quick Sort
 *   5. Merge Sort
 *   6. Heap Sort
 *   7. Counting Sort   (non-negative integers only)
 *   8. Radix Sort      (non-negative integers only)
 */
#include <stdio.h>
#define MAX_SIZE 200
//------------Print Array--------------------
void print_array(int arr[], int size, int hi1, int hi2) {
    for (int i = 0; i < size; i++) {
        if (i == hi1 || i == hi2) {
            printf("[%d] ", arr[i]);
        } else {
            printf(" %d  ", arr[i]);
        }
    }
    printf("\n");
}

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int array_max(int arr[], int size) {
    int max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

int array_min(int arr[], int size) {
    int min = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] < min) min = arr[i];
    }
    return min;
}

// ---------- 1. Bubble Sort ----------

void bubble_sort(int arr[], int size) {
    printf("\n--- Bubble Sort ---\n");
    print_array(arr, size, -1, -1);

    for (int i = 0; i < size - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < size - i - 1; j++) {
            printf("Comparing positions %d and %d:\n", j, j + 1);
            print_array(arr, size, j, j + 1);
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
                swapped = 1;
                printf("  -> Swapped\n");
                print_array(arr, size, j, j + 1);
            }
        }
        if (!swapped) break;
    }
    printf("Final result: ");
    print_array(arr, size, -1, -1);
}

// ---------- 2. Insertion Sort ----------

void insertion_sort(int arr[], int size) {
    printf("\n--- Insertion Sort ---\n");
    print_array(arr, size, -1, -1);

    for (int i = 1; i < size; i++) {
        int key = arr[i];
        int j = i - 1;
        printf("Inserting %d into the sorted portion:\n", key);

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
        print_array(arr, size, j + 1, -1);
    }
    printf("Final result: ");
    print_array(arr, size, -1, -1);
}

// ---------- 3. Selection Sort ----------

void selection_sort(int arr[], int size) {
    printf("\n--- Selection Sort ---\n");
    print_array(arr, size, -1, -1);

    for (int i = 0; i < size - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < size; j++) {
            if (arr[j] < arr[min_idx]) min_idx = j;
        }
        if (min_idx != i) {
            printf("Swapping position %d (%d) with position %d (%d):\n",
                   i, arr[i], min_idx, arr[min_idx]);
            swap(&arr[i], &arr[min_idx]);
            print_array(arr, size, i, min_idx);
        }
    }
    printf("Final result: ");
    print_array(arr, size, -1, -1);
}

// ---------- 4. Quick Sort ----------

int partition(int arr[], int low, int high, int size) {
    int pivot = arr[high];
    printf("Pivot chosen: %d (position %d)\n", pivot, high);
    int i = low - 1;

    for (int j = low; j < high; j++) {
        printf("Comparing %d (pos %d) to pivot %d:\n", arr[j], j, pivot);
        print_array(arr, size, j, high);
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    printf("Placing pivot %d at position %d:\n", pivot, i + 1);
    print_array(arr, size, i + 1, -1);
    return i + 1;
}

void quick_sort_helper(int arr[], int low, int high, int size) {
    if (low < high) {
        int pi = partition(arr, low, high, size);
        quick_sort_helper(arr, low, pi - 1, size);
        quick_sort_helper(arr, pi + 1, high, size);
    }
}

void quick_sort(int arr[], int size) {
    printf("\n--- Quick Sort ---\n");
    print_array(arr, size, -1, -1);
    quick_sort_helper(arr, 0, size - 1, size);
    printf("Final result: ");
    print_array(arr, size, -1, -1);
}

// ---------- 5. Merge Sort ----------

void merge(int arr[], int left, int mid, int right, int size) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[MAX_SIZE], R[MAX_SIZE];

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        arr[k] = (L[i] <= R[j]) ? L[i++] : R[j++];
        k++;
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];

    printf("Merged subarray [%d..%d]:\n", left, right);
    print_array(arr, size, left, right);
}

void merge_sort_helper(int arr[], int left, int right, int size) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        merge_sort_helper(arr, left, mid, size);
        merge_sort_helper(arr, mid + 1, right, size);
        merge(arr, left, mid, right, size);
    }
}

void merge_sort(int arr[], int size) {
    printf("\n--- Merge Sort ---\n");
    print_array(arr, size, -1, -1);
    merge_sort_helper(arr, 0, size - 1, size);
    printf("Final result: ");
    print_array(arr, size, -1, -1);
}

// ---------- 6. Heap Sort ----------

void heapify(int arr[], int size, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        printf("Sifting down: swapping position %d (%d) with position %d (%d):\n",
               i, arr[i], largest, arr[largest]);
        swap(&arr[i], &arr[largest]);
        print_array(arr, size, i, largest);
        heapify(arr, size, n, largest);
    }
}

void heap_sort(int arr[], int size) {
    printf("\n--- Heap Sort ---\n");
    print_array(arr, size, -1, -1);

    printf("Building max heap:\n");
    for (int i = size / 2 - 1; i >= 0; i--) {
        heapify(arr, size, size, i);
    }
    printf("Heap built:\n");
    print_array(arr, size, -1, -1);

    for (int i = size - 1; i > 0; i--) {
        printf("Moving max (%d) to position %d:\n", arr[0], i);
        swap(&arr[0], &arr[i]);
        print_array(arr, size, 0, i);
        heapify(arr, size, i, 0);
    }
    printf("Final result: ");
    print_array(arr, size, -1, -1);
}

// ---------- 7. Counting Sort ----------

void counting_sort(int arr[], int size) {
    printf("\n--- Counting Sort ---\n");
    print_array(arr, size, -1, -1);

    int min_val = array_min(arr, size);
    if (min_val < 0) {
        printf("Counting sort in this demo only supports non-negative integers.\n");
        return;
    }

    int max_val = array_max(arr, size);
    int count[max_val + 1];
    for (int i = 0; i <= max_val; i++) count[i] = 0;

    for (int i = 0; i < size; i++) count[arr[i]]++;

    printf("Count array (index = value, value = frequency):\n");
    for (int i = 0; i <= max_val; i++) printf("%d:%d  ", i, count[i]);
    printf("\n");

    int output[MAX_SIZE];
    int idx = 0;
    for (int i = 0; i <= max_val; i++) {
        while (count[i] > 0) {
            output[idx++] = i;
            count[i]--;
        }
    }
    for (int i = 0; i < size; i++) arr[i] = output[i];

    printf("Final result: ");
    print_array(arr, size, -1, -1);
}

// ---------- 8. Radix Sort ----------

void counting_sort_by_digit(int arr[], int size, int exp) {
    int output[MAX_SIZE];
    int count[10] = {0};

    for (int i = 0; i < size; i++) count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];

    for (int i = size - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    for (int i = 0; i < size; i++) arr[i] = output[i];
}

void radix_sort(int arr[], int size) {
    printf("\n--- Radix Sort ---\n");
    print_array(arr, size, -1, -1);

    int min_val = array_min(arr, size);
    if (min_val < 0) {
        printf("Radix sort in this demo only supports non-negative integers.\n");
        return;
    }

    int max_val = array_max(arr, size);
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        printf("Sorting by digit at place value %d:\n", exp);
        counting_sort_by_digit(arr, size, exp);
        print_array(arr, size, -1, -1);
    }

    printf("Final result: ");
    print_array(arr, size, -1, -1);
}

// ---------- Main ----------

int main() {
    int arr[MAX_SIZE];
    int size, choice;

    printf("=== Sorting Algorithm Visualizer ===\n");
    printf("Enter number of elements (max %d): ", MAX_SIZE);
    scanf("%d", &size);

    if (size < 1 || size > MAX_SIZE) {
        printf("Invalid size.\n");
        return 1;
    }

    printf("Enter %d elements:\n", size);
    for (int i = 0; i < size; i++) {
        scanf("%d", &arr[i]);
    }

    printf("\n1. Bubble Sort\n");
    printf("2. Insertion Sort\n");
    printf("3. Selection Sort\n");
    printf("4. Quick Sort\n");
    printf("5. Merge Sort\n");
    printf("6. Heap Sort\n");
    printf("7. Counting Sort (non-negative integers only)\n");
    printf("8. Radix Sort (non-negative integers only)\n");
    printf("Choose an algorithm: ");
    scanf("%d", &choice);

    switch (choice) {
        case 1: bubble_sort(arr, size); break;
        case 2: insertion_sort(arr, size); break;
        case 3: selection_sort(arr, size); break;
        case 4: quick_sort(arr, size); break;
        case 5: merge_sort(arr, size); break;
        case 6: heap_sort(arr, size); break;
        case 7: counting_sort(arr, size); break;
        case 8: radix_sort(arr, size); break;
        default: printf("Invalid choice.\n");
    }

    return 0;
}
