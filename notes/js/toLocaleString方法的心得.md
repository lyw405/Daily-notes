# toLocaleString
## Number.prototype.toLocaleString()
### 没有参数的情况
MDN上给出的描述为：toLocaleString() 方法返回这个数字在特定语言环境下的表示字符串。
举例：
```javascript
const num =12345678.9;
console.log(num.toLocaleString());
// 12,345,678.9
```
这种每3个一个逗号的表示方法还是很常见的。很多人对这个方法的理解也基本上就到这里了，但是他的参数是什么呢？有什么作用呢？
### 有参数的情况
直接举例子：
```javascript
const num =12345678.9;
console.log(num.toLocaleString('zh', { style: 'currency', currency: 'cny' }));
//¥12,345,678.90
```
第一个参数为：指定本地参数中存在的语言类型。

第二个参数为：指定字符串的显示格式。

```javascript
const num =12345678.9;
console.log(num.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }));
// ￥12,345,679
```
很明显我们可以看出，在日语的环境下，他格式化后的金钱不再保留小数，并且存在四舍五入的情况。

style有四个值，
* “decimal” 用于纯数字格式；(默认)
* “currency” 用于货币格式；
* “percent” 用于百分比格式;
* “unit”   用于单位格式;
```javascript
const num =12345678.9;
console.log(num.toLocaleString('zh', { style: 'currency', currency: 'cny', currencyDisplay: 'code' }));
// CNY 12,345,678.90
console.log(num.toLocaleString('zh', { style: 'currency', currency: 'cny', currencyDisplay: 'name' }));
// 12,345,678.90人民币
```
currency的值就多了，主要货品的种类太多了，这里要标注货币格式化中使用的货币符号。例如：美元（USD），欧元（EUR），人民币（CNY）等等吧，这个假如涉及了，查一查就行。

currencyDisplay是为了如何在货币格式化中显示货币，值：
* symbol 使用本地化的货币符号，默认。
* code 使用国际标准组织的货币代码。
* name 使用本地化的货币名称

还有很多其他的参数，例如:maximumSignificantDigits(使用的有效数字的最大数量),maximumFractionDigits(使用的小数位数的最大数目),useGrouping(是否使用分组分隔符)等等，有兴趣可以去搜搜看。

## Date.prototype.toLocaleString()
返回该日期对象的字符串，该字符串格式因不同语言而不同。
### 没有参数的情况
没有指定语言环境时，返回一个使用默认语言环境和格式设置的格式化字符串。

每个日期时间组件的默认值都是undefined, 但是如果 weekday, year, month, day, hour, minute, second 属性都是 undefined, 那么 year, month, day, hour, minute 和 second 的值都被认为是 "numeric".

### 有参数的情况
参数不是所有的浏览器都支持。locales和options使程序能够指定使用哪种语言格式化规则。这里就不过多的展开了。

## Array.prototype.toLocaleString()
MDN上给出的描述：toLocaleString() 返回一个字符串表示数组中的元素。数组中的元素将使用各自的 toLocaleString 方法转成字符串，这些字符串将使用一个特定语言环境的字符串（例如一个逗号 ","）隔开。
所以就不分开讨论了，不知道说什么了，感觉MDN上写得相当清楚了，\(^o^)/~
## bigInt.prototype.toLocaleString()
大整数的用法和number的用法差不多，虽然用的少，毕竟我很难有那么多的钱。
```javascript
const bigint = 123456789123456789n;
console.log(bigint.toLocaleString('zh', { style: 'currency', currency: 'cny' }));
// ¥123,456,789,123,456,789.00
console.log(bigint.toLocaleString('zh', { style: 'currency', currency: 'cny', currencyDisplay: 'name' }));
// 123,456,789,123,456,789.00人民币
```
既然这样，那就补充这聊聊这第一个参数吧，这第一个参数，这个参数可以指定语言环境，而且可以扩展使用，例如中文大写十进制：
```javascript
const bigint = 123456789123456789n;
console.log(bigint.toLocaleString('zh-u-nu-hanidec', { style: 'currency', currency: 'cny' }));
// ¥一二三,四五六,七八九,一二三,四五六,七八九.〇〇
```
## Object.prototype.toLocaleString()
```javascript
const obj = {};
console.log(obj);
//[object Object]
```
返回一个该对象的字符串表示。

