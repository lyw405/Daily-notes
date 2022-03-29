// 关于拍平数组也有很多种方法
const arrOrg = [1, [2, 3], [[4, 5], [6, 7]]];

// 最简单的肯定是使用数组的flat方法。
const arrFlated = arrOrg.flat(Infinity);
// console.log(arrFlated);

// 我们也可以通过递归来进行
const flatArr = (target) => {
    var result = [];
    for (let i = 0; i < target.length; i++) {
        if (!Array.isArray(target[i])) {
            result.push(target[i]);
        } else {
            result = result.concat(flatArr(target[i]))
        }
    }
    return result;
}
console.log(flatArr(arrOrg));


// 小技巧时间
const flatted = (arr) => {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }  1
    return arr
}

// console.log(flatted(arrOrg))