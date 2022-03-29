// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
// 实现一个展示前n项的斐波那切数列
const fbnq = (n) => {
    let fibArr = [];
    for (let i = 0; i < n; i++) {
        if (i < 2) {
            fibArr.push(i)
        } else {
            fibArr.push(fibArr[i - 1] + fibArr[i - 2])
        }
    }
    return fibArr;
}


// 找出菲波那切数列数列的第N项
const fib = (n) => {
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

// 动态规划
const fibSuper = (n) => {
    if (n < 2) {
        return n;
    }
    const fibArr = [0, 1];
    for (let i = 2; i <= n; i++){
        fibArr.push(fibArr[0] + fibArr[1]);
        fibArr.splice(0, 1);
    }
    return fibArr[1]
}
console.log(fib(8));
