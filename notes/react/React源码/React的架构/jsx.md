# JSX
## JSX与Fiber的关系。
我们知道，我们平时写的JSX是会经过babel的，那么babel会给我们编译成什么呢？可以在[babel的在线页面](https://babeljs.io/),打开try it out 在线编辑器。
- 我们直接输入JSX会报错，因为他并不知道我们的输入要按照哪种来进行编译。
- 所以要在左下角添加插件，@babel/plugin-transform-react-jsx
### 举栗子
例如我们输入
```javascript
<div abc='1'>1</div>
```
经过编译后我们会发现,我们所写的jsx编译为：
```javascript
/*#__PURE__*/
React.createElement("div", {
  abc: "1"
}, "1");
```
也就是说，他会调用react的createElement方法，第一个参数为type，第二个参数为config，第三个参数为当前对象的children。验证一下子：
```javascript
<div abc='1'>
    <div efg='2'>
        2
    </div>
    <p efg='3'>
        3
    </p >
    4
</div>
```
经过编译后我们会发现,我们所写的jsx编译为：
```javascript
/*#__PURE__*/
React.createElement("div", {
  abc: "1"
}, /*#__PURE__*/React.createElement("div", {
  efg: "2"
}, "2"), /*#__PURE__*/React.createElement("p", {
  efg: "3"
}, "3"), "4");
```
结果显然意见，但是有一点需要注意，假如有多个child，那么为第三个参数开始，所有的都是child。
### 调用这个方法然后呢？源码中是怎么写的
```javascript
export function createElement(type, config, children) {
  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;

      if (__DEV__) {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }
    if (hasValidKey(config)) {
      if (__DEV__) {
        checkKeyStringCoercion(config.key);
      }
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (__DEV__) {
    if (key || ref) {
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```
如前面所说，这个函数接收三个参数，type，config，children。下面剖析这个函数。
- 首先他定义了一些key，ref等变量，这些都是我们在react中经常使用的。
- 接下来他会检查config是否为null
- 如果存在config，他会对ref，key进行检查合法性然后进行赋值。
- 对config进行for in遍历，对除了保留属性（RESERVED_PROPS）以外的其他属性放在props里面。保留属性会作为单独的参数传递。
- 对于defaultProps的处理
- 最后调用ReactElement方法，把我们前面解析的参数传递给ReactElement方法。
### ReactElement是干啥子的？
```javascript
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };

  if (__DEV__) {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false,
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self,
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source,
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
```
这个函数把我们传入的参数组装成一个element对象，然后进行返回。__DEV__是开发环境才会进入的。但是多了一个属性*$$typeof*，这是用来判断是否为一个合法的React Element对象。
在React中判断是否为一个合法的React Element对象是用isValidElement方法。
```javascript
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```
我们可以看到首先要是个对象，并且不是null，而且$$typeof属性为REACT_ELEMENT_TYPE。

综上所述，我们经过createElement返回的element都是一个合法的React element。

### 回到问题，jsx与Fiber的关系。
首次渲染时，我们在创建workInProgress Fiber树的每个节点的依据就是返回的jsx对象。
而在更新时，在生成workInProgress Fiber树时，会将返回的Jsx对象和current Fiber树上对应的节点（对应节点alternate）进行对比（diff），根据对比的结果生成当前的workInProgress Fiber节点。