// 这个的方式方法太多了，这里随便写几种吧。
const arrOrg = [1, 3, 5, 5, 2, 2, 5, 6];

// es6:
const resultES6 = Array.from(new Set(arrOrg))
// console.log(resultES6); 

// 通过检验index
const resultFilter = arrOrg.filter((item, index) => arrOrg.indexOf(item) === index);
// console.log(resultFilter);  

// 创建一个新的数组
const resultNewArr = [];
arrOrg.forEach(item => {
    if (resultNewArr.indexOf(item) !== -1) {
        return
    } else {
        resultNewArr.push(item);
    }
})
// console.log(resultNewArr);  


// 还有很多很多
// 先排序，后比较相邻的两个值,此时有两种处理方式：
// 如果不相同的话就把第二个值保存起来，要注意的是第一个值的保存，因为如果只保存第二个值的情况下，arrOrg[0]这一项将会被丢掉。

// 或者相同时将第二个值删掉。
// 当然假如这样做的话要注意，使用splice进行删除时，原数组会发生改变，此时我们遍历指针就得-1.

