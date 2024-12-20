const next = require('next')
const { createServer } = require('http')

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT || '3001', 10)
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on port ${port}`)
  })
})