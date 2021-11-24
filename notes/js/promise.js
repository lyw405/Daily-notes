// Promise.all中有一个请求失败了，如何能得到其余正确的请求结果？
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
