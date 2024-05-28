const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
// const mime = require('mime')

const mime = {
  map: {
    'html': 'text/html',
    'xhtml': 'application/xhtml+xml',
    'xml': 'text/xml',
    'js': 'application/javascript',
    'wasm': 'application/wasm',
    'map': 'magnus-internal/imagemap',
    'css': 'text/css',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'ico': 'image/vnd.microsoft.icon'
  },
  getType: function (ext) {
    let conType = this.map[ext]
    return conType || 'text/plain'
  }
}

const httpServer = http.createServer()

httpServer.on('request', (req, res) => {
  console.log(`[receive request] ${req.method} ${req.url}`)

  const urlJson = url.parse(req.url)
  let { pathname } = urlJson
  let ext = pathname.split('.').pop()
  // all
  // res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  // res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  // just page file
  if (ext === 'html' || ext === 'xhtml'|| ext === 'js') {
    //跨域隔离
	res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    res.setHeader('Access-Control-Allow-Origin', 'https://resource.eziot.com')
	//影响报告
	//res.setHeader('Cross-Origin-Embedder-Policy-Report-Only', 'require-corp')
    //res.setHeader('Cross-Origin-Opener-Policy-Report-Only', 'same-origin')
  }

  let contentType = mime.getType(ext)
  res.setHeader('Content-Type', contentType)

  fs.readFile(path.resolve(__dirname, pathname.substr(1)), (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found.')
    } else {
      res.writeHead(200)
      res.end(data)
    }
  })
})

const PORT = 9090
httpServer.listen(9090, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
