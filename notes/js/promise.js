// 一、为什么要使用promise？
// 1.指定的回调更加灵活。之前我们处理异步任务的时候都是在得到结果之前就需要把回调函数写好，例如ajax。但是promise允许我们在得到结果之后再指定我们的回调函数。
// 2.支持链式操作，解决回调地域问题。
// 3.对于异常的处理，只需要最后处理一次。


// 超级重要的核心：then执行哪个回调函数是由调用then的proomise的状态决定的，then执行后返回的promise的结果是由执行的回调结果决定的。
// 如果抛出异常，为reject。
// 如果返回的是一个非promise的任意值，则为resolved。
// 如果返回一个新的promise，那么这个新的promise的状态决定后面then的执行。
// 因为异常是可以穿透的，所以如果想要中断promise链，可以在中间的then的第二个参数给他一个promise，一直让其处于pendding状态，从而实现中断的我们的穿透链。

// 要点： 1.定义变量。 2. 同步执行执行器。 3. 改变状态的三个方法。

(function (window) {
    function DIYPromise(executor) {
        // 保存状态
        this.status = 'pendding';
        // 保存数据
        this.data = undefined;
        // 保存回调函数
        this.callbacks = []; // [{onResolved,onRejected}]
        // 将promise状态改为resolved，赋值结果,调用回调。
        function resolve(value) {
            if (this.status !== 'pendding') {
                return
            }
            this.status = 'resolved'
            this.data = value
            if (this.callbacks.length >= 0) {
                setTimeout(() => {
                    this.callbacks.forEach(callback => {
                        callback.onResolved(value)
                    })
                })
            }
        }
        // 将promise状态改为rejected，赋值结果,调用回调。
        function reject(reason) {
            if (this.status !== 'pendding') {
                return
            }
            this.status = 'rejected'
            this.data = reason
            if (this.callbacks.length >= 0) {
                setTimeout(() => {
                    this.callbacks.forEach(callback => {
                        callback.onRejected(value)
                    })
                })
            }
        }
        // 同步执行执行器，并且及时抛出错误。
        try {
            executor(resolve.bind(this), reject.bind(this))
        } catch (error) {
            reject(error)
        }
    }
// 要点：
    // 1.返回的是一个promise对象。
    // 2.onResolved和onRejected有可能调用，也可能保存起来，根据状态决定。
    // 3.返回的promise结果由onResolved和onRejected的结果决定
    //   (1)执行抛出异常，promise状态为resolved
    //   (2)执行结果非promise，返回的promise状态时resolved
    //   (3)执行结果是一个promise，返回的promise的状态由这个结果的promise决定。
    // 4.注意this的指向问题。
    DIYPromise.prototype.then = function (onResolved, onRejected) {
        let self = this;
        onResolved = typeof onResolved === 'function' ? onResolved : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : value => value
        return new DIYPromise((resolve, reject) => {
            function handdle(callback) {
                try {
                    let result = callback(self.data);
                    if (result instanceof DIYPromise) {
                        result.then(val => {
                            resolve(val);
                        }, reason => {
                            reject(reason);
                        })
                    } else {
                        resolve(result)
                    }
                } catch (error) {
                    reject(error)
                }
            }
            if (self.status === 'pedding') {
                // 此时还没有处理的结果。
                self.callbacks.push[{
                    onResolved: () => {
                        handdle(onResolved)
                    }, onRejected: () => {
                        handdle(onRejected)
                    }
                }]
            } else if (self.status === 'resolved') {
                setTimeout(() => {
                    handdle(onResolved)
                }, 0)
            } else {
                setTimeout(() => {
                    handdle(onRejected)
                }, 0)
            }

        })

    }


    DIYPromise.prototype.catch = function (onRejected) {
        return this.then(undefined, onRejected)
    }

    // 接受一个value，而且这个value可能是一个非promise的任意值，也可能是一个promise
    DIYPromise.resolve = function (value) {
        return new DIYPromise((resolve, reject) => {
            if (value instanceof DIYPromise) {
                value.then((val) => {
                    resolve(val)
                }, (val) => {
                    reject(val)
                })
            } else {
                resolve(value)
            }
        })
    }

    DIYPromise.reject = function (reason) {
        return new DIYPromise((resolve, reject) => {
            reject(reason)
        })
    }
    // 要点：
    // 1.返回一个promise
    // 2.循环传入的promise数组，定义一个数组装处理的结果
    // 3.用计数器来统计是否所有的promise都成功
    DIYPromise.all = function (promises) {
        const len = promises.length;
        let count = 0;
        const result = new Array(len);
        return new Promise((resolve, reject) => {
            if (len === 0) {
                resolve(result);
            }
            promises.foreach((promise, index) => {
                promise.then(
                    data => {
                        result[index] = data;
                        count++;
                        if (count === len) {
                            resolve(result);
                        }
                    }, reason => {
                        reject(reason);
                    })
            })

        })
    }
    // 要点：返回一个promise，promise的结果由第一个完成(失败和成功都算)的promise决定
    DIYPromise.race = function (promises) {
        return new DIYPromise((resolve, reject) => {
            promises.forEach(promise => {
                promise.then(val => {
                    resolve(val)
                }, reason => {
                    reject(reason)
                })
            })

        })
    }
    window.DIYPromise = DIYPromise

})(window)


// Promise.all中有一个请求失败了，如何能得到其余正确的请求结果？
// 核心想法：catch方法返回值会被promise.reslove()包裹，所以可以用catch先捕获这个异常，然后再进行处理。
// Promise.all(
//         [
//             Promise.reject({
//                 code: 500,
//                 msg: "服务异常"
//             }),
//             Promise.resolve({
//                 code: 200,
//                 list: []
//             }),
//             Promise.resolve({
//                 code: 200,
//                 list: []
//             })
//         ]
//         .map(p => p.catch(e => e))
//     )
//     .then(res => {
//         console.log("res=>", res);
//     })
//     .catch(error => {
//         console.log("error=>", error);
//     });
// 核心想法：catch方法返回值会被promise.reslove()包裹，所以可以用catch先捕获这个异常，然后再进行处理！
Promise.all(
        [
            Promise.reject({
                code: 500,
                msg: "服务异常"
            }),
            Promise.resolve({
                code: 200,
                list: []
            }),
            Promise.resolve({
                code: 200,
                list: []
            })
        ]
        .map(p => p.catch(e => e))
    )
    .then(res => {
        console.log("res=>", res);
    })
    .catch(error => {
        console.log("error=>", error);
    });
