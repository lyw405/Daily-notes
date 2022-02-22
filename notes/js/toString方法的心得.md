# toString()
### number
toString(radix) 方法返回指定 Number 对象的字符串表示形式。radix指定要用于数字到字符串的转换的基数(从2到36)，默认10。
```javascript
const count = 10;
console.log(count.toString());
// 10
console.log(count.toString(2));
// 1010
```
### string
emm....
### boolean
那布尔值假如调用这个方法呢？
```javascript
const bl = false;
console.log(bl.toString());
// false
console.log(typeof bl)
// boolean
```
可以看出，布尔值在调用之后，还是布尔值，并且仍然有着boolean的特性。

### 对象调用这个方法
```javascript
const obj = {};
console.log(Object.prototype.toString.call(obj))
// [object Object]
```
我们可以看到，这个方法返回的是对这个对象的描述。那数组和函数调用呢？
```javascript
const fun = () => { };
console.log(Object.prototype.toString.call(fun))
// [object Function]
const arr = [];
console.log(Object.prototype.toString.call(arr));
// [object Array]
```
所以我们可以通过这种方式来判断数据的类型，但往往也是经常被我们忽略的。
## 总结一下
```javascript
Object.prototype.toString.call('') ;   // [object String]
Object.prototype.toString.call(1) ;    // [object Number]
Object.prototype.toString.call(true) ; // [object Boolean]
Object.prototype.toString.call(Symbol()); //[object Symbol]
Object.prototype.toString.call(undefined) ; // [object Undefined]
Object.prototype.toString.call(null) ; // [object Null]
Object.prototype.toString.call(()=>{}) ; // [object Function]
Object.prototype.toString.call(new Date()) ; // [object Date]
Object.prototype.toString.call([]) ; // [object Array]
Object.prototype.toString.call(new RegExp()) ; // [object RegExp]
Object.prototype.toString.call(new Error()) ; // [object Error]
Object.prototype.toString.call(document) ; // [object HTMLDocument]
Object.prototype.toString.call(window) ; //[object global] window 是全局对象 global 的引用
```


