# React
## 代数效应（Algebraic Effects）
react的核心成员Sebastian Markbåge曾说过：”我们再React中做的就是践行代数效应“。代数效应是函数式办成的一个概念，用于将副作用从函数调用中分离。
## 代数效应与React的关系，最明显的就是Hooks。
对于useState、useReducer等等hook。我们并不需要关注组件对值如何保存的，React会为我们处理。
## 在v15 - v16Reconciler从同步递归到异步可中断。我们很容易想到一个东西Generator，为什么v16没有用？
- 类似于async，Generator函数是有传染性的。上下文其他函数都要做出对应的更改。
- Generator执行中间状态是上下文关联的。如果引入全局变量保存我们的中间状态，那么这个复杂度就会变高了。
## 代数效应与fiber
fiber，纤程。

React内部实现的一套状态更新机制，支持任务不同优先级，可中断与恢复。并且恢复之后可以复用之前的中间状态。
每一个任务更新单元为React Element对应的Fiber节点。