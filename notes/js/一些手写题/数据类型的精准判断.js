// typeof      instenseof     toString 
// 我们通常会使用以上三种来对数据类型进行判断。
// instance运算符用于通过查找原型链来检测某个变量是否为某个类型数据的实例。
// 每种引用类型都会直接或者间接继承自Object类型，因此它们都包含toString()函数。不同数据类型的toString()类型返回值也不一样，所以通过toString()函数可以准确判断值的类型。
// 我们可以通过toString方法来进行精准的判断数据的类型
const judgeType = (target) => {
    const temp = Object.prototype.toString.call(target);
    return temp.slice(8, -1)
}
const func = () => { }
console.log(judgeType([]));
console.log(judgeType({}));
console.log(judgeType(func));

