// 堆：存储引用数据类型的空间。
// 栈：存储基础数据类型和指定代码的环境。

// -----------------------------------------------------
// 在对象中，键名是用字符转存储的(不严谨)，属性名不可以重复，但是数字格式==字符串格式
// let a = {}, b = '0', c = 0;
// a[b] = 'yu';
// a[c] = 'wang';
// console.log(a[b]) // 'wang'
// 延伸问题：对象和数组的区别。

// -----------------------------------------------------
// 值得注意的是es6中提出的symbol数据类型,懂的都懂，没什么好说的。
// let a = {}, b = Symbol('0'), c = Symbol('0');
// a[b] = 'yu';
// a[c] = 'wang';
// console.log(a[b]) // 'yu'
// 延伸问题：自己实现一个Symbol

// -----------------------------------------------------
// 有一种如下情况，在存储的时候，假如属性名是个一个对象的话，会将对象转化为字符串，调用其.toString()方法。
// 所以不管对象存储的是什么，转换完之后都变成了[object Object]
// let a = {}, b = {n:1}, c = {m:2};
// a[b] = 'yu';
// a[c] = 'wang';
// console.log(a[b]) // 'wang'
// console.log(a)    // 可以在控制台看到 他的存储方式为：[object Object]: "wang"
// 延伸问题：Object.protoType.toString / valueOf 

// -----------------------------------------------------
// 接下来聊聊函数，一个有意思的小问题。
// 当函数执行时，会把执行执行上下文压缩入栈。要注意闭包的问题。
// var test = (function (i) {
//     return function () {
//         console.log(i *= 2)
//     }
// })(2)
// test(5)   // 4

// -----------------------------------------------------
// 先不着急说上一个，先看看下一个题。
// var a = 0, b = 0;
// function A(a) {
//     A = function (b) {
//         console.log(a + b++)
//     }
//     console.log(a++)
// }
// A(1);    //1 
// A(2);    //4
// 在A(1)执行时，生成A(1)的执行上下文，但是其中的A并不是该执行上下文私有的，所以需要往上级找，所以会找到global的A，所以在此处就相当于对global的A的引用的重写，所以A(1)的执行上下文不销毁，闭包也就形成了、所以在执行A = function (b) {console.log(a + b++)}时，自身没有a，往上级找，也就是2+2，结果为4


// --------------------------------------------------------------------------------------
// 对象数组的深克隆和浅克隆
// let obj1 = {
//     a: 100,
//     b: [10, 20, 30],
//     c: { x: 10 },
//     d: /^\d+$/
// }
// ------------for in 遍历
// for (let key in obj1) {
//     if (!obj1.hasOwnProperty(key)) {
//         break
//     }
//     obj2[key] = obj1[key]
// }
// console.log(obj1, obj2)
// obj2.c.x = 100;
// obj2.a = 88;
// console.log(obj1.c.x) // 100 ，也跟着obj2.c.x的赋值操作发生了变化。
// console.log(obj1.a) // 100 ，并没有跟着obj2.a的赋值操作发生了变化。
// 所以浅拷贝，只是拷贝的数据的栈引用，并没有拷贝走堆。
// ------------JSON.parse(JSON.stringify(obj))
// 通过转换的确可以实现深拷贝。但是有一点点小问题。
// obj2=JSON.stringify(obj1);
// console.log(obj2) // {"a":100,"b":[10,20,30],"c":{"x":10},"d":{}}
// 我们会发现，正则表达式没有了。其实不只正则，日期，和函数同样会丢失。
// ------------所以还是老老实实的递归吧
// function deepClone(obj) {
//     // 过滤特殊情况
//     if (obj === null) {
//         return obj
//     }
//     if (typeof obj !== 'object') {
//         return obj
//     }
//     // 可能会是正则或者日期
//     if (obj instanceof RegExp) {
//         // 不可直接返回正则，需要新创建一份
//         return new RegExp(obj)
//     }
//     if (obj instanceof Date) {
//         // 不可直接返回正则，需要新创建一份
//         return new Date(obj)
//     }
//     // 不直接let newObj = {}，通过下面方式创建是为了保证克隆前后保持相同的所属类。
//     let newObj = new obj.constructor;
//     for (let key in obj) {
//         if (obj.hasOwnProperty(key)) {
//             newObj[key] = deepClone(obj[key])
//         }
//     }
//     return newObj
// }
// let obj2 = deepClone(obj1)
// console.log(obj2)
// console.log(obj1 === obj2)


// --------------------------------------------------------------------------------------
// 看到的一道题
// function Foo() {
//     getname = function () {
//         console.log(1)
//     }
//     return this
// }
// Foo.getname = function () {
//     console.log(2)
// }
// Foo.prototype.getname = function () {
//     console.log(3)
// }
// var getname = function () {
//     console.log(4)
// }
// function getname() {
//     console.log(5)
// }

// Foo.getname(); 
// getname();
// Foo().getname();
// getname();
// new Foo.getname();
// new Foo().getname();
// new new Foo().getname();

// 首先这是一个变量提升的问题，
// 变量提升：在代码执行前，var和function会被声明，但是不会赋值。
// 所以首先声明Foo，Foo的堆，然后走到var，声明getname，然后继续遇到function getname(){},因为已经对getname进行了声明，所以此步骤会进行赋值，此时全局getname = func->5.变量提升结束。
// Foo.getname =fun->2 ，Foo.prototype.getname =fun->3 所以是在Foo的堆中增加了一个getName:func->2属性，原型属性上也增加了一个 getName:func->3.
// 执行到var getname = func->4,此时进行赋值，则，此时全局getname = func->4，执行结束。
// 搞清楚执行顺序后再看我们的问题
// Foo.getname(); 在Foo的堆中找getname方法，也就是输出2
// getname();  在全局找getname方法，输出4
// Foo().getname(); Foo作为一个普通函数执行，生成一个新的执行上下文，在其中因为getname已经被定义，所以getname = function () {console.log(1)}是对外界全局getname函数的修改，即此时全局getname = func->1。return this.也就是返回的是window，再执行getname()，输出1
// getname();  在全局找getname方法，输出1
// new Foo.getname(); 这里涉及到一个问题，就是执行顺序的问题。有参数new和无参数new的执行优先级是不同的。具体可在MDN查一查,在这种是先进行成员访问，再进行实例化。所以输出2，然后进行实例化。
// new Foo().getname(); 此时成员访问和实例化优先级相同，所以从左向右执行。 所以实例上的getname方法就是原型上的getname方法，即输出3
// new new Foo().getname(); => new xxx.getname()  优先计算成员访问，所以输出3.
// 所以答案是：2411233


// --------------------------------------------------------------------------------------
// var a = {
//     i:1,
//     valueOf(){
//         return this.i++
//     }
// };
// var a = {
//     i: 1,
//     toString () {
//         return this.i++
//     }
// };

// var i =1;
// Object.defineProperty(window,'a',{
//     get(){
//         return i++
//     }
// })

// if (a === 1 && a === 2 && a === 3) {
//     console.log('已运行！')
// }