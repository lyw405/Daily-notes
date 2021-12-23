## 我真的了解npm吗？

有好多细节平时都不太注意，让我们从一个疑问开始，

#### 有时候包明明装了，但是就是查不到版本是为什么？

原因：bulabula -v 这命令是从全局找，找不到你当前的文件夹的，所以找不到。

解决方案：我们可以在读取时加上路径，来读取文件夹里的版本，但是这样有点麻烦呀，所以我们可以写一些脚本。

#### 关于脚本script的一些问题。

同样的查看版本号，我们在package.json文件中添加一个脚本:
```javascript
script：{"dev": "bulabula -v" },
```
此时我们再执行我们的脚本，我们就可以查看到版本。

这是因为脚本的执行查看版本会从全局找，然后从当前文件夹中找。 而如果我们直接 bulabula -v 只会从全局找，不会从当前文件夹中找。
#### 脚本的一些小细节。

```javascript
script：{"dev": "bulabula1 & bulabula2" }       //& : 并行执行（即同时的平行执行），前后两个谁先执行完不一定，哪怕执行的是相同的代码。
script：{"dev": "bulabula1 && bulabula2" }      //&&: 继发执行（即只有前一个任务成功，才执行下一个任务)
```
#### 访问package.json中字段的小坑

我们经常使用在js文件中使用
```javascript
process.env.npm_package_bulabula
```

来访问我们的package文件中的一些值，要注意的是这个在脚本环境中才可以。直接运行js文件是拿不到的。

脚本也可以访问我们package内部的信息，

```javascript
$npm_package_bualbuala。 
```
#### 关于 npm list 

大家都知道，这个命令可以查看我们包的依赖关系。我们可以通过 npm list | grep bulabula  来查看我们的当前环境的包的分支，更简洁一些。
#### npm i --production

这个命令大家应该都知道的，只安装生产环境的包。
#### 关于版本的^、~、*

其实这些都是用来锁定版本的,举个栗子：13.5.7。
这个意思就是
major：13。主版本号：这个版本号的更新一般都是重大的，具有颠覆性的。

minor：5。次版本号。这个版本号就是用于添加新功能，或者特殊的修改，一般用于主版本方向不变的情况。

patch：7。补丁。这个就是日常维护的一些小补丁，一般认为偶数为稳定版本，奇数为不稳定版本。

^ :锁定主版本。在自动安装的时候，会安装主版本下的最新的版本。

~ :锁定主版本和次版本号。

* ：适配最新版本。

空 ：指定版本。
#### 上传自己的包的时候一个小坑。

我们经常会使用淘宝的npm镜像。但是我们上传的时候我们有时候会不太注意这个问题，从而在上传你自己的包的时候出现403 forbidden的现象。

查看npm源：npm config get registry

切换npm源方法一：npm config set registry http://registry.npmjs.org

切换npm源方法二：nrm use npm

### NVM

全称：Node Version Manager，是node的包管理工具。具体使用网上太多教程了，不知道给大家说一些啥。
#### NVM对于新的使用者有一个小坑：

nvm use 版本号，确实可以更改当前的node版本，但是当我们再次打开的时候我们会还是会回到最初的版本。这是因为我们需要对他的默认版本进行修改，nvm alias default 版本号 
#### 安装git上的包

npm i git+ssh://git@github.com/bulabulabula
主要在git+“+”+ssh://git@地址，其中的那个+不可省略
#### 关于cross-env想说的一些

当使用NODE_ENV=production, 来设置环境变量时，大多数Windows命令提示将会阻塞(报错)。（异常是Windows上的Bash，它使用本机Bash。）换言之，Windows 不支持 NODE_ENV=production 的设置方式。所以需要cross-env运行跨平台设置和使用环境变量的脚本。

cross-env可以使用单个命令，而不必担心为平台正确设置或使用环境变量。这个迷你的包(cross-env)能够提供一个设置环境变量的scripts，能够以Unix方式设置环境变量，然后在 Windows 上也能兼容运行。
```javascript
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}   
```
#### npx相关的一些话

npx 的原理很简单，就是运行的时候，会到node_modules/.bin路径和环境变量$PATH里面，检查命令是否存在。

注意，Bash 内置的命令不在$PATH里面，所以不能用。比如，cd是 Bash 命令，因此就不能用npx cd。

$ npx --no-install bualbuala 让 npx 强制使用本地模块，不下载远程模块。

$ npx --ignore-existing bualbuala  忽略本地的同名模块，强制安装使用远程模块。
