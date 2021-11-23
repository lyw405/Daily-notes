// 在这里，我们把uesCallback和useMemo放在一起说。因为两者的实现逻辑一毛一样。
// 下面的代码摘自react源码：

function mountCallback(callback, deps) {
    // 和其他hook相同，首先找到正在执行的hook。
    const hook = mountWorkInProgressHook();
    // 把我们的依赖项保存在hook中并返回的callback，不执行。
    // *这也是两者唯一的区别。
    const nextDeps = deps === undefined ? null : deps;
    hook.memoizedState = [callback, nextDeps];
    return callback;
}

function mountMemo(nextCreate, deps) {
    // 和其他hook相同，首先找到正在执行的hook。
    const hook = mountWorkInProgressHook();
    const nextDeps = deps === undefined ? null : deps;
    // 把我们的依赖项保存在hook中并返回的callback，并执行。
    const nextValue = nextCreate();
    hook.memoizedState = [nextValue, nextDeps];
    return nextValue;
}

function updateCallback(callback, deps) {
    const hook = updateWorkInProgressHook();
    const nextDeps = deps === undefined ? null : deps;
    const prevState = hook.memoizedState;
    if (prevState !== null) {
        if (nextDeps !== null) {
            const prevDeps = prevState[1];
            // 对于两个依赖项进行比较，这里的实质上是一个浅比较。Object.is()
            if (areHookInputsEqual(nextDeps, prevDeps)) {
                return prevState[0];
            }
        }
    }
    // 和updateMemo()的唯一区别就是是否会对传入的函数进行调用。
    hook.memoizedState = [callback, nextDeps];
    return callback;
}

function updateMemo(nextCreate, deps) {
    const hook = updateWorkInProgressHook();
    const nextDeps = deps === undefined ? null : deps;
    const prevState = hook.memoizedState;
    if (prevState !== null) {
        if (nextDeps !== null) {
            const prevDeps = prevState[1];
            if (areHookInputsEqual(nextDeps, prevDeps)) {
                return prevState[0];
            }
        }
    }
    const nextValue = nextCreate();
    hook.memoizedState = [nextValue, nextDeps];
    return nextValue;
}