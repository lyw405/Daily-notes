# localStorage
作为一个前端开发，对于这个存储的方式并不陌生，但是并没有细细的研究过。
## localStorage是如何存储的?
localStorage的存储方式键和值都是采用的UTF-16 DOMString格式。
## 最大为5M，那么这个5M的单位是什么？
单位是字符串的长度。
## localStorage的键占不占存储空间呢？
占。
```javascript
//创建一个名称有5M长度的键名，加上键值就超过5M了，假如键名占内存，那么就会超过5M报错。键入不占内存，就会正常的存储打印时间。
const count = 5 * 1024 * 1024;
const key = new Array(count).fill('a').join('');
localStorage.clear();
try {
    console.time('localStorage');
    localStorage.setItem(key, '1');
    console.timeEnd('localStorage');
} catch (e) {
    console.log('err', e.message)
}
```
## 如何计算现有的localStorage的存储空间呢？
```javascript
//因为数据都    是以键值对的形式存储的，所以通过遍历然后再拼接起来看长度就可以了。
const sizeOfLocalStorage = () => {
        return Object.entries(localStorage).map(v => v.join('')).join('').length;
    }
localStorage.clear();
localStorage.setItem('aaa', '111');
localStorage.setItem('bbb', 222);
console.log('localStorage',Object.entries(localStorage));
console.log('size', sizeOfLocalStorage());
```



