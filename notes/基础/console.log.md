# console.log
一般我们会用它来向Web控制台输出一条消息。但是有的时候会发现很多门户网站的控制台花里胡哨的。
## %c
可以使用%c为打印内容定义样式。
```javascript
// MDN上搬来的例子，打印一句话，然后设置样式。
console.log("This is %cMy stylish message", "color: yellow; font-style: italic; background-color: blue;padding: 2px");
```
所以由此我们可以这样给控制台加一些花里胡哨的内容，好像加文字问题不大，但是该如何加图片呢？
## 添加图片该怎么加呢？
既然我们可以可以控制台的输出添加样式，这个图片加到背景不就好了？通常我们的图片都是从服务器拿到然后展示出来的，所以我们应该在图片加载完成时触发打印。具体实现。
```javascript
const style = `
        padding: 122px 217px;
        background-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwaeKeZE0h_GidJW1icQNkQ2fWtpK5Mptz16rMYylG4YBmU7cqrx9MrEcyPnFJdPiIzjo&usqp=CAU);
        background-size: contain;
        background-repeat: no-repeat;
        color: transparent;`
console.log('%c图片显示', style);
```
## 不止于此
除了%c还有%s（字符串），%d 或者 %i（整数），%f（浮点数），%o（可展开的DOM），%O（列出DOM的属性）。

举例：
```javascript
console.log("打印的字符串是：%s", "JavaScript很简单");
console.log("打印的整数是：%d", 123.456);
console.log("打印的浮点数是：%f", 123.456);
console.log("%o",document.body);
console.log("%O",document.body);
```
