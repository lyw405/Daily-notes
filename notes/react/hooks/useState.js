// 这是一个useState的模型，模拟在react中的运行流程。原理和react源码中相同。

// 是否是首次挂载
let isMount = true;
// 正在处理哪个HOOK
let workInProgressHooks = null;

const fiber = {
    // 指向对应的节点
    stateNode: App,
    // 存储hooks中的数据，链表。
    memoizedState: null
}

function useState(initialState) {
    // 我们需要知道调用的是那个hook
    let hook;

    if (isMount) {
        // 当首次渲染的时候我们的memoizedState为null，所以我们要创建一个hook
        hook = {
            memoizedState: initialState,
            next: null,
            // 改变保存的状态
            queue: {
                pedding: null
            }
        }
        if (!fiber.memoizedState) {
            fiber.memoizedState = hook;
        } else {
            workInProgressHooks.next = hook;
        }
        workInProgressHooks = hook;
    } else {
        hook = workInProgressHooks;
        workInProgressHooks = workInProgressHooks.next;
    }
    // 获取我们hook中存在的状态
    let baseState = hook.memoizedState;
    // 判断本次更新是否有新的update需要执行
    if (hook.queue.pedding) {
        // 找到第一个update，因为是环状链表，所以：
        let firstUpdate = hook.queue.pedding.next
        // 遍历update的链表，获取每个action，基于action获取一个新的state；
        do {
            const action = firstUpdate.action;
            baseState = action(baseState)
            firstUpdate = firstUpdate.next;
        }while(firstUpdate !==  hook.queue.pedding.next)
        // 链表计算完毕，清空我们的链表。
        hook.queue.pedding = null;
    }
    hook.memoizedState = baseState;
    return [baseState,disPactchAction.bind(null,hook.queue)]
}

function disPactchAction(queue, action) {
    // 环状链表，因为在真实的react每次更新是有优先级的。
    const update = {
        action,
        next: null
    }
    // 当前hook上还没有需要触发的更新，也就是要触发的第一个更新。这里要实现一个环状链表
    if (queue.pedding === null) {
        // u0 -> u0
        update.next = update;
    } else {
        // queue.pedding保存着最后一个update
        // u0 -> u1 
        update.next = queue.pedding.next;
        // u1 -> u0
        queue.pedding.next = update;
    }
    // queue.pedding保存最后一个update
    queue.pedding = update;
    schedule();
}

function schedule() {
    // 没发生一次更新，我们需要将我们的指针指向最初始的位置。
    workInProgressHooks = fiber.memoizedState;
    isMount = false;
    const app = fiber.stateNode();
    return app
}

function App() {
    const [num, setNum] = useState(0)

    return {
        onclick() {
            setNum(num + 1)
        }
    }
}

window.app = schedule();