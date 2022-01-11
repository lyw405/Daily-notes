# react
#### 我们都知道有函数组件和类组件这两种，那么我们如何区分呢？
```javascript
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
```
这段代码是react源码中关于Component的一部分，我们可以看到，在创建了构造函数后，作者给原型上添加了一个属性isReactComponent，所以我们可以通过对这个属性的存在与否来判断是否是类组件。
#### setState相关一些事情
```javascript
Component.prototype.setState = function(partialState, callback) {
  if (
    typeof partialState !== 'object' &&
    typeof partialState !== 'function' &&
    partialState != null
  ) {
    throw new Error(
      'setState(...): takes an object of state variables to update or a ' +
        'function which returns an object of state variables.',
    );
  }

  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```
从源码中我们可以看到，我们在传入的改变值是一个对象或者是一个函数，并且把这些融合到一个enqueueSetState的函数中，这里就涉及到了react的协调，整个setState的逻辑是非常复杂的，所以另起一篇来细讲。updater这个对象是react在这个组件实例化之后挂在上去的。
#### forceUpdate
```javascript
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```
强制更新，在原理上讲，这个和setState还是挺像的，准确来说，都是可以出发组件更新嘛，但是forceUpdate没有参数的限制。
#### PureComponent
PureComponent和Component其实没太大的不同，PureComponent多了一个生命周期shouldComponentUpdate。

### 说完了组件，接下来说渲染，旧版本的ReactDOM.render()。
鉴于主流现在还是react18版本以下为主流，所以暂时先不说ReactDOM.createRoot()，这个额外另起一片介绍。
```javascript
export function render(
  element: React$Element<any>,
  container: Container,
  callback: ?Function,
) {
    // 不太重要的部分，主要就是在dev环境下的一些提示和对container的判断。
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}
```
剔除不太重要的部分，我们可以看到我们他的返回值调用了legacyRenderSubtreeIntoContainer函数，这个函数干啥的嘞？
```javascript
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function,
) {
  if (__DEV__) {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback(callback === undefined ? null : callback, 'render');
  }

  let root = container._reactRootContainer;
  let fiberRoot: FiberRoot;
  if (!root) {
    // Initial mount 
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    flushSync(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}
```
因为我们渲染可能是初次渲染也可能是再次渲染，初次渲染没什么好说的了，按部就班，但是再次渲染的时候我们需要生成一个新的虚拟DOM节点，然后和老的DOM节点进行diff，找到最小的真实DOM节点需要改变的量。

所以上面的源码就很好理解了。其实就是一个关于是否存在老节点root进行判断。

有个点我们可以看到，更新阶段和初次加载阶段其实调用的都是相同的updateContainer方法，不同的是初次更新时，调用了flushSync进行了同步更新整棵树。更新阶段和react开发者有写道“Initial mount should not be batched.”为了保证更新效率和用户体验，要尽快的把我们的初次渲染渲染好，所以不用批量更新。
