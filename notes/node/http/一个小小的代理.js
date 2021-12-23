const http = require('http');
const https = require('https');
// 做一个简单的代理
const server = http.createServer((request, response) => {
    let data = '';
    https.get('https://tk.d.mi.com/app/dcv2?format=json', (result) => {
        result.on('data', (chunk) => {
            data += chunk
        })
        result.on('end', () => {
            response.writeHead(200, { 'content-type': 'text/plain' })
            response.write(data)
            response.end()
        })
    })
})
server.listen(8080, () => {
    console.log('服务器已启动')
})