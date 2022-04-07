# react
## fiber
fiber最高的React官方解释是其核心成员Andrew 在2016年的博文。fiber的含义：
- 作为架构来说：V15的Reconciler是stack Reconciler,因为他的数据都保存在调用栈中。而v16的Reconciler是fiber Renconciler。
- 作为一个静态数据结构来说：每个fiber节点对应一个React elment，保存着这个节点的所有信息。
- 作为一个动态的工作单元来说：每个fiber节点保存了本次更新中该组件改变的状态，要执行的副作用工作。
## fiber的结构
```javascript
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag; // 组件类型 func class
  this.key = key;  
  this.elementType = null;
  this.type = null;  // elementType和type多数时候都是一样的，但是也有不同的时候，例如被React.memo()包裹时.
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0; //多个同级fiber节点的位置索引
  this.ref = null;

  // 作为动态的工作单元的属性,保存本次更新造成的状态改变相关的信息。
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

## fiber的结构
当我们首次调用ReactDOM.render()方法时，会创建一个整个应用FiberRootNode节点，我们可以将不同的应用挂在不同的DOM节点下，所以这些应用都有自己的根节点RootFIber。他们与FiberRootNode之间是用current来进行链接。在一个应用中可以有多个RootFiber，但是只能有一个FiberRootNode来管理这些RootFiber。
挂载的组件会有自己的fiber节点，然后其内部的嵌套又会有新的fiber节点，这些之间会用return、subling、child属性来标注互相之间的关系。
### 为什么用return而不是parent
沿用了react v15

## fiber架构的工作原理
react中采用的是双缓存，在内存中绘制我们的当前帧，然后完成后直接通过FiberRootNode的current指针从current fiber树指向我们内存中的workInProgress fiber树。完成视图的更新。这两颗树之间通过alternate属性进行链接。
```javascript
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```
### 初次渲染
可以理解为是一次完全的更新。
首先执行ReactDOM.render时，会创建FiberRoot和RootFiber。
由于是首屏渲染，页面中没有任何的DOM，所以FiberRoot的current指向的RootFiber是没有任何子节点的。
然后再内存中根据jsx来依次创建我们的fiber节点，并连接成fiber树，也就是我们的workInProgress Fiber。创建时也会根绝alternate属性来看是否可以复用当前节点（diff算法）。
当我们的workInProgress Fiber树在commit阶段渲染到页面。fiberRootNode的current指针指向workInProgress Fiber使其变为current树

### 应用更新
参照初次渲染。