# JavaScript
## 写在前面的话
最近在读《js高级程序设计》，准备在2月20日之前读完，有挺多的小知识点平时用的相对较少，但是感觉有用的记录下来，
## 在HTML中使用javascript
### <script>元素
1. 如果没有async defer，浏览器将立即运行脚本，然后再渲染脚本标签下方的元素。
2. 使用async（异步），浏览器将继续加载 HTML 页面并呈现它，同时浏览器同时加载和执行脚本。
3. 使用defer，浏览器将在页面完成解析时运行脚本。
#### defer和async的区别
具有async属性的脚本将在下载后执行。而具有defer属性的脚本将在完成 DOM 解析后执行。
加载的脚本async不保证任何顺序。使用defer属性加载的脚本保持它们在 DOM 上出现的顺序。
#### <noscript>元素
这个标记当浏览器不支持脚本，或者浏览器支持脚本，但是脚本被禁用的时候触发。
## 基本概念
1. 数值、布尔值、对象、字符串值都有toString()方法，但是undefined和null没有，所以在调用toString()方法时，可以先用转型函数String()。
2. 在调用数值的toString()方法时，可以传递一个参数：输出数值的基数，默认为10。
```javascript
var num = 10;
console.log(num.toString(2)); // "1010"
```
3. 在布尔值进行加减运算的时候，会先把false转为数字0，把true转为1，然后再执行运算。
4. 在对象进行加减运算的时候，先调用对象的valueof方法以取得一个可供操作的值.
5. 位操作符：
~ : 按位非。 -(x + 1)
& : 按位与。 25 & 3 === 1; 转二进制，同位都为1则为1。
| : 按位或。 25 | 3 === 27； 转二进制，同位有1则为1。
^ : 按位异或。 25 ^ 3 === 26; 转二进制，同位不同则为1。
<< : 左移。 2 << 5 === 64; 转二进制，左移几位就是相当于乘2的几次方。
(>>): 有符号的右移操作,(>>>) : 无符号右移操作。注意：负数的无符号右移操作和正数2的32次方-1的的有符号右移操作会出问题。
6.  ! && || 很多新的在之前的一片文章中有写。
7.  加法中：

    infinity + infinity 结果为 infinity

    -infinity + -infinity 结果为 -infinity
    
    -infinity + infinity  结果为 NaN
8. 减法中：

    infinity - infinity 结果为NaN

    -infinity - -infinity 结果为NaN

    -infinity - infinity 结果为-infinity 

    infinity - -infinity 结果为infinity
9. 逗号操作符。 let num = (1, 2, 3);   // num ===3.逗号操作符总会返回表达式的最后一项。



