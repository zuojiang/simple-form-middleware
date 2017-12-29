import connect from 'connect'
import bodyParser from 'body-parser'
import proxy from 'http-proxy-middleware'
import Busboy from 'busboy'
import path from 'path'
import os from 'os'
import fs from 'fs'

import createForm from '../src/index'

const app = connect()

app.use('/favicon.ico', (req, res) => {
  res.writeHead(404)
  res.end()
})

app.use('/', (req, res, next) => {
  res.locals = {
    title: 'Test',
    infoMessage: 'Please complete the following information!',
  }
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/login', (req, res, next) => {
  if (req.headers['content-type'] === 'multipart/form-data') {
    return next()
  }
  console.log(req.method, req.body)
  res.writeHead(200, { 'Connection': 'close' })
  res.end('ok')
}, (req, res) => {
  const {headers, method, body} = req

  const busboy = new Busboy({
    headers,
  })

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, filename)
    file.pipe(fs.createWriteStream(path.join(os.tmpDir(), path.basename(fieldname))))
  })

  busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
    console.log(fieldname, val)
  })

  busboy.on('finish', () => {
    res.writeHead(200, { 'Connection': 'close' })
    res.end('ok')
  })

  req.pipe(busboy)
})

app.use('/auth', createForm({
  callbackStr: `function(err, text) {
    alert(err ? err.message : text)
  }`,
  headers: {
    'Content-Type': 'application/json',
  },
  action: '/login',
  // method: 'get',
  fieldset: [
    {
      name: 'user_name',
      value: 'admin',
      'data-label': 'User name',
    },
    {
      name: 'user_pass',
      type: 'password',
      value: '123456',
      'data-label': 'Password',
    },
    {
      name: 'code',
      type: 'captacha',
      required: true,
      'data-url': '/auth/test.png',
    },
    {
      type: 'select',
      name: 'role',
      value: '1',
    },
    {
      type: 'textarea',
      name: 'remark',
    },
    {
      type: 'checkbox',
      value: 1,
      required: true,
      'data-label': 'I confirm!',
    },
    // {
    //   type: 'file',
    //   name: 'attaches'
    // },
  ],
  selectOptions: {
    role: [{
      value: '1',
      label: 'Admin',
    }, {
      value: '2',
      label: 'Guest',
    }],
  },
  // externalScriptUrl: '/auth/printReqInfo.js',
}))

app.use('/', proxy({
  target: 'http://localhost',
  changeOrigin: true,
}))

app.listen(3000)
