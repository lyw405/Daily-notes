### TypeError: Cannot read property ‘tap’ of undefined
今天在使用html-webpack-plugin的时候报的一个错误，原因就是插件和webpack的版本不对应，例如webpack4，但是plugin却是5版本的。
### webpack require.context
我们引入一个模块，经常会使用
```javascript
import A from 'B';
```
这样的引入当模块变的特别多的时候，就要写多次这个语句。例如有个文件夹下有20个模块需要我们引入，我们就得写20次。所以我们可以采用require.context()方法。
```javascript
require.context(
  directory,
  (useSubdirectories = true),
  (regExp = /^\.\/.*$/),
  (mode = 'sync')
);
// 参数分别为：路径，是否检索子目录，匹配的正则，导入的方式。
```
这个方法将会返回一个webpackContext函数（下面示例中的requireModules函数），这个函数有一个keys方法，其中饱含着我们需要的文件名。
```javascript
const requireModules = require.context(
  directory,
  ture,
  /.js$/
);
console.log(requireModules.keys())  // 文件名组成的数组
// 参数分别为：路径，是否检索子目录，匹配的正则，导入的方式。
```
我们可以遍历我们得到的这个数组，然后将文件名传入我们的webpackContext函数，就可以得到文件,文件导出的内容位于default字段。
```javascript
requireModules.keys().reduce((modules,modulesPath)=>{
    console.log(requireModules(modulesPath).default) //对应路径下文件的内容
})
```
最后我们接收一下上面函数的返回值，我们就可以拿到所有的modules。
由此我们只要在这个文件夹下创建的新的模块都会被自动的引入。
这种方式常见的使用场景就是实现组件的自动化全局注册，自动化引入路由。




