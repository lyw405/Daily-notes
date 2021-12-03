## JSX的一些工作机制
### JSX的本质是js的语法扩展，他充分具备js的能力。所以就会有一个问题，JSX如何在JS中生效的的？
JSX会被编译为React.creatrElement(),React.creatrElement()将返回一个叫做ReactElement的JS方法。
编译时由babel完成的。
编译时会React.creatrElement(type，config，child)
既然JSX等价于React.creatrElement(type，config，child)，那为什么不直接用后者创建元素呢？
jsx层次分明，后者太乱了。
### React.creatrElement(type，config，child)的工作机制：
type：用于标识节点的类型。
config：以对象的形式传入，组件所有的属性都会以键值对的方式存储在config对象中。
children：以对象的形式传入：记录的是组件标签间的子节点。
源码拆解：主要分为几个过程：
1. 二次处理key，ref，self，source四个属性值。
2. 遍历config，筛选出可以提进props力的属性。
3. 提取子元素，推入childArray(即prop.children)的数组。
4. 格式化defaultProps。
5. 以上数据作为入参，发起reactElemet的调用。
React.creatrElement(type，config，child)相当于开发者和reactElement之间的数据处理层。这一步中多数都在格式化数据，最后将格式化好的数据传入reactElemet方法。
### ReactElemet的工作机制：
reactElemt的工作就是创建组装，然后返回一个element对象。 
把上一步传进来的数据进行组装，并返回给React.creatrElement，React.creatrElement再返还给开发者。
### 虚拟DOM
一个js对象，是对dom的描述。是JS和DOM之间的一个映射缓存。
1. 挂载阶段，react将结合jsx的描述，构建出虚拟DOM树，然后通过ReactDOM.Render 实现虚拟DOM到真实DOM的转换。
2. 更细阶段，页面的变化会先作用于虚拟DOM，虚拟DOM将在JS层借助算法对比出哪里数据需要改变，然后将这些改变作用于真实DOM。
#### 虚拟dom是如何解决问题的？
新旧两颗虚拟DOM树通过diff算法得出一个补丁集，然后只把补丁打在真实dom处，实现差量更新。
#### 为什么要用虚拟DOM？
1. 性能从来都不是react团队虚拟DOM的原因，而是在于研发体验和研发效率而创造出来的产物，能够提供更爽更高效的研发模式的同时，还保持着不错的性能。虚拟DOM的劣势在于js计算的耗时，DOM操作的能耗和js计算的能耗不在一个量级。常规的操作中出现的最多的就是更新，所以react团队在代码层面也专门把更新的优先级提的最高。
2. 虚拟DOM，是对真实DOM的一层抽象， 如果没有这层抽象，视图层和渲染平台紧密的耦合在一起，为了描述同样的视图内容，我们就得在web端和native端写两套或者多套代码。
### ReactDOM.render(elment，container，callback)
elment：需要渲染的元素。
container：元素挂载的目标容器（一个真实DOM）。
callback：回调函数，可选参数，可以用来处理渲染结束后的逻辑。
### 简而言之：
开发者--JSX--babel转换--React.creatElement调用--ReactElement调用--虚拟DOM--ReactDOM.render()--真实DOM
## 生命周期相关的一些啰嗦
### getDerivedStateFromProps(props，state)
在16.3中新增的这个生命周期并不是原来的componentWillMount的替代品，因为CWM的存在不仅“鸡肋”，而且危险，所以他不值得被替代，而应该被废弃。
getDerivedStateFromProps有且仅有一个用途，就是使用props来派生/更新state，在更新和挂载两个阶段都会用到。
该方法是一个静态方法，所以他不依赖组件的实例而存在，所以访问不到this。
该方法需要一个对象格式的返回值，否则会报错。是因为react需要这个返回值来更新组件的state，所以假如确实用不到使用props来派生state的时候就不要用啦，但是就是那么不听话，那就return null其实也行。
该方法是对state的定向更新，针对某个属性，而不是覆盖式更新。
### 为什么要用getDerivedStateFromProps来替代componentWillReceiveProps？
getDerivedStateFromProps原则上来说能做的变少，能且只能做一件事：基于props派生state。相当于做了合理的减法。
因为定义为static方法，拿不到this，所以很难做一些不合理的操作。增加生命周期更加可预测和可控。
### getSnapshotBeforeUpdate(preProps,prevState)
getSnapshotBeforeUpdate的返回值会作为第三个参数给到componentDidUpdate。
componentDidUpdate(preProps,prevState,valueFromSnapshot)
所以getSnapshotBeforeUpdate想要发挥作用，离不开componentDidUpdate。
它的执行时机实在render方法之后，真实的DOM之前。
同时获取到更新前的真实DOM和更新后的state&props信息。
## fiber架构
从架构角度来讲：fiber是react16对react核心算法的重写，fiber会是原来的同步渲染过程变成异步可中断的。
从编码角度来讲：fiber是react内部所定义的一种数据结构。
从工作流角度讲：fiber节点保存了组件所需要更细拿到状态和副作用。
render阶段可能会被react终止或者重新启动，但是commit阶段是同步的，是不可以被打断的。
因为render阶段对用户来说是不可见的，所以打断重启，影响不大。但是commit阶段真实DOM已经渲染完成。
所以render阶段的生命周期可以被重复执行的，所以危险，例如多次付款，老泪纵横。

## 组件传值之发布订阅模式
解决通信类问题的万金油！监听事件的位置和触发事件的位置是不受限制的！
例如 socket.io，node.js中许多模块就是以EventEmitter为基类实现的，vue中的全局事件总线EventBus。
### 发布订阅模式的实现方式
事件的监听（订阅）：on() 负责注册事件的监听器，指定事件触发时的回调函数。
事件的触发（发布）：emit() 负责触发事件，可以通过传参让其触发的时候携带数据。
事件的删除：off() 负责删除监听器。
### 事件和监听函数之间的对应关系如何处理？
映射，在js中我们都是用对象做的，所以在全局设置一个对象存储映射关系。
### 如何实现订阅？
具体来说就是把事件和对应的函数写入到eventHome里面去。
### 如何实现发布？
触发安装在某个事件上的监听函数，找到这个事件对应的监听函数队列，将队列中的handler依次执行出队。

## React.createContext
### context的用法：
 const AppContext = React.createContext(defaultValue)
 从创建的AppContext中可以获得Provider和Consumer两个对象。const {Provider,Consumer} = Apptext;
 Provider就是数据的提供者，我们可以用<Provider value={a:xxx,b:xxx}></Provider>对组件树中的根组件进行包裹，然后传入value的属性，这个value就是后续流动的数据。
 Consumer就是数据的消费者，我们可以用<Consumer>一个函数作为子元素，返回一个组件</consumer>
 #### 过时的context有什么问题：
 1. 代码不够优雅。
 2. 无法保证数据在生产者和消费者之间的同步。假如中间层有一个组件的shouldConponentUpdate返回false，那么后代组件不会更新。

## Redux
redux是JS的状态容器，它提供可预测的状态管理。
### Redux的构成
1. store是一个单一的数据源，而且是只读的。
2. action是对变化的描述。```{type:xxx,payload:xxxx}```,属性可以有多个，但是type是必须要传的。
3. reducer负责对变化进行分发和处理。
### Redux工作流程
1. 使用createStore方法创建我们的仓库。```const store = createStore(reducer,initial_state,applyMiddleware(middleware1,middleware2....))```
2. 

## 函数组件和类组件的区别？
dan曾经写了一篇文章，论述两者的不同，但是核心都在讲一句话：函数组件会捕获render内部的状态。函数组件真正的把渲染和数据绑定在了一起。

## hooks
### hooks的局限性
1. HOOKS暂时还不能完全的补齐类组件的能力，react团队官方很早就说要加进来，但是一直都没有。
2. 有时候会在类组件中见到一些方法非常繁多的实例，如果用函数组件解决，业务逻辑的拆分和组织会是一个很大的挑战。
3. hooks在使用层面有着严格的约束。
### hooks为什么不能再循环、条件、嵌套函数中定义hooks？
要保证hooks在每次渲染的时候保持相同的执行顺序。hook对象之间是以单链表的形式存储，这个我在hook部分有专门的讲述。
**mount阶段只要是构建我们的链表并渲染，而update阶段是依次遍历我们的链表并且渲染。**
update阶段会依次遍历链表，读取数据并且渲染，