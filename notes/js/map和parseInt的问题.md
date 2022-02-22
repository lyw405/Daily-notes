# map和parseInt
## 从一道面试题开始
```javascript
const arr = ['1', '2', '3'];
console.log(arr.map(parseInt));
//[ 1, NaN, NaN ]
```
map的三个参数和parseInt的两个参数就不多赘述了，产生这样结果的原因其实是执行了以下的代码：
```javascript
parseInt('1',0);
parseInt('2',1);
parseInt('3',2);
```
第一个参数为遍历的值，第二个参数为序号index。

在MDN中有表示，第二个值为0，undefined或者未指定，那么进制默认为10进制。
所以
```javascript
parseInt('1',0);
// 1
```
因为进制只有2-36，所以1是不认识的，所以
```javascript
parseInt('2',1);
// NaN
```
而第三个，3显然不在2进制内，所以也无法转换的。
```javascript
parseInt('3',2);
// NaN
```
## 验证一下
```javascript
const arr = ['1', '2', '3', '3', '2', '2', '1'];
console.log(arr.map(parseInt));
//[1, NaN, NaN, NaN,2,   2,   1]
```
