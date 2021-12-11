function lengthOfLIS(nums) {
    const n = nums.length;
    if (n <= 1) {
        return n
    }
    let max = 1;
    let dp = [null, nums[0]];
    for (let i = 1; i < n; i++) {
        if (nums[i] > dp[max]) {
            dp[++max] = nums[i]
        } else {
            console.log('b')
            let left = 1;
            let right = max;
            let mid
            while (left <= right) {
                mid = (left + right) >> 1;
                if (dp[mid] > nums[i]) {
                    right = mid - 1
                } else {
                    left = mid + 1;
                }
            }
            dp[mid] = nums[i]
        }
    }
    return max
}
