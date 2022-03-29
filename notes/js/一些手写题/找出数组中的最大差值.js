// 找出数组中的最大差值
const maxDiff = (arr) => {
    let maxDiffVal = 0;
    let minVal = arr[0];
    for (let i = 0; i < arr.length; i++) {
        minVal = Math.min(minVal, arr[i]);
        maxDiffVal = Math.max(maxDiffVal, arr[i] - minVal)
    }
    return maxDiffVal;
}

console.log(maxDiff([1,4,5,2]))