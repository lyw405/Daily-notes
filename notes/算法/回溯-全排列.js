// 给定一个 没有重复 数字的序列，返回其所有可能的全排列。
// 例如输入: [1,2,3] 输出:
// [
//   [1,2,3],
//   [1,3,2],
//   [2,1,3],
//   [2,3,1],
//   [3,1,2],
//   [3,2,1]
// ]

// 1. 算法策略
// 回溯算法是一种搜索法，试探法，它会在每一步做出选择，一旦发现这个选择无法得到期望结果，就回溯回去，重新做出选择。深度优先搜索利用的就是回溯算法思想。

// 2. 适用场景
// 回溯算法很简单，它就是不断的尝试，直到拿到解。它的这种算法思想，使它通常用于解决广度的搜索问题，即从一组可能的解中，选择一个满足要求的解。

// 3. 代码实现
// 我们可以写一下，数组 [1, 2, 3] 的全排列有：
// 先写以 1 开头的全排列，它们是：[1, 2, 3], [1, 3, 2]，即 1 + [2, 3] 的全排列；
// 再写以 2 开头的全排列，它们是：[2, 1, 3], [2, 3, 1]，即 2 + [1, 3] 的全排列；
// 最后写以 3 开头的全排列，它们是：[3, 1, 2], [3, 2, 1]，即 3 + [1, 2] 的全排列。
// 即回溯的处理思想，有点类似枚举搜索。我们枚举所有的解，找到满足期望的解。为了有规律地枚举所有可能的解，避免遗漏和重复，我们把问题求解的过程分为多个阶段。每个阶段，我们都会面对一个岔路口，我们先随意选一条路走，当发现这条路走不通的时候（不符合期望的解），就回退到上一个岔路口，另选一种走法继续走。
// 这显然是一个 递归 结构:
// 递归的终止条件是：一个排列中的数字已经选够了 ，因此我们需要一个变量来表示当前程序递归到第几层，我们把这个变量叫做 depth ，或者命名为 index ，表示当前要确定的是某个全排列中下标为 index 的那个数是多少；
// used（object）：用于把表示一个数是否被选中，如果这个数字(num)被选择这设置为 used[num] = true ，这样在考虑下一个位置的时候，就能够以 O(1)的时间复杂度判断这个数是否被选择过，这是一种「以空间换时间」的思想。

// 代码实现：
let permute = function(arr) {
    // 使用一个数组保存所有可能的全排列
    let res = []
    if (arr.length === 0) {
        return res
    }
    let used = {}, path = []
    dfs(arr, arr.length, 0, path, used, res)
    return res
}
let dfs = function(arr, len, depth, path, used, res) {
    // 所有数都填完了
    if (depth === len) {
        res.push([...path])
        return
    }
    for (let i = 0; i < len; i++) {
        if (!used[i]) {
            // 动态维护数组
            path.push(arr[i])
            used[i] = true
            // 继续递归填下一个数
            dfs(arr, len, depth + 1, path, used, res)
            // 撤销操作
            used[i] = false
            path.pop()
        }
      
    }
}
