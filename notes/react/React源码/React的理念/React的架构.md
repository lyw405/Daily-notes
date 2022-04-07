# React
## 我们先来聊一聊老的React架构
### react15所使用的架构
主要组成部分为两部分，一部分决定渲染什么（Reconciler协调器）和将组件渲染到视图中（Renderer渲染器）。

### Reconciler 
这部分会决定什么组件会进行渲染。
每当有更新发生时，Reconciler会做如下工作：
- 调用函数组件、或class组件的render方法，将返回的JSX转化为虚拟DOM
- 将虚拟DOM和上次更新时的虚拟DOM对比
- 通过对比找出本次更新中变化的虚拟DOM
- 通知Renderer将变化的虚拟DOM渲染到页面上
diff算法的官方名称为reconcile。这么说，大概就很明了了。

### Renderer
经过Reconciler决定渲染的组件会交给Renderer来渲染到视图中，因为react支持跨平台，所以不同的平台有不同的Renderer,我们前端最熟悉的应该就是浏览器环境渲染的Renderer ---- ReactDOM。
还有：
- ReactNative 渲染器，渲染App原生组件
- ReactTest 渲染器，渲染出纯Js对象用于测试
- ReactArt 渲染器，渲染到Canvas, SVG 或 VML (IE8)

### React15架构的缺点
react是通过递归来更新我们的子节点，Reconciler和Renderer是交替工作的，假如子节点过多，层级很深，那么用户的交互就会卡顿。根据React的设计理念，假如在这个架构上实现异步可中断的更新，那么我们在渲染一个很长的list的时候，可能会出现部分视图更改了，部分没更改的BUG。所以React重写了架构。

## React16架构
React16架构分为三个部分，相比于React15的架构多了一个Scheduler调度器。

### Scheduler
调度任务的优先级，高优先级的任务有限进入Reconciler。
### Reconciler
协调器从递归变成了可中断的循环过程，每次循环都会调用shouldYield判断当前是否有剩余时间。
```javascript
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```
就像前面说的，中断的时候可能会出现渲染不完全的问题。所以React16中，*Reconciler和Renderer不再是交替工作的*。当Scheduler将任务交给Reconciler后，Reconciler会为变化的虚拟DOM打上标记。这些工作都在内存中完成，当所有的组件都完成Reconciler时才会交给Renderer来进行渲染。
### Renderer
根据Reconciler打的标记，同步执行对应的DOM操作。
所以我们前面举的那个例子，我们会将所有的需要更改的都经过Reconciler打标之后统一渲染出来。
## 省流总结
React15是通过递归的方式，Reconciler和Renderer交替执行来实现组件的更新的。

React16是通过可中断的循环的方式，当所有要更新的的组件都在Reconciler比对，打上标记后，才会统一的交给Renderer来进行同步的渲染。

Scheduler和Reconciler这两个是可以中断的，中断的条件为：
- 有其他更高的优先级的任务需要更新
- 浏览器当前帧的时间不够了，没有剩余时间