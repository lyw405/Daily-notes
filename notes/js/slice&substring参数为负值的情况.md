# slice()&substring()
```javascript
const str = 'abcdefghijk'
console.log(str.slice(3))       // defghijk
console.log(str.substring(3))   // defghijk           
console.log(str.slice(3, 7))    // defg
console.log(str.substring(3, 7))// defg
```
大家应该都知道，这两个方法第一个参数指定的是截取的开始位置（包含），第二个参数指定的是截取的结束位置（不包含）。但是当值为负值时就不太一样了。
```javascript
const str = 'abcdefghijk'
console.log(str.slice(-3))       // ijk   
console.log(str.slice(-3, -7))    // 空字符串
console.log(str.slice(3, -7))    // d
console.log(str.slice(-3, 7))    // 空字符串
```
slice()方法会将传入的负值与字符串长度相加，也就是str.slice(-3) = str.slice(str.length + (-3)) 
这里就想抬杠了，万一加完还是负数呢？
```javascript
const str = 'abcdefghijk'
console.log(str.slice(-13，5))       // abcde
```
所以我们可以看出，slice()方法只会将传入的负值与字符串相加一次，如果相加之后还是负值，就当0处理。
```javascript
console.log(str.substring(-3))   // abcdefghijk   
console.log(str.substring(-3, -7))// 空字符串
console.log(str.substring(3, -7))// abc
console.log(str.substring(-3, 7))// abcdefg
```
很明显，substring()方法会将负数直接转化为0处理。但是有一个小点：str.substring(3, -7)，转化完之后就变为了str.substring(3, 0)，substring()方法会取参数的较小者作为开始位置，取较大者作为结束位置。slice()方法不会。

##### substr()没有严格被废弃 (as in "removed from the Web standards"), 但它被认作是遗留的函数并且可以的话应该避免使用。它并非JavaScript核心语言的一部分，不做赘述。
