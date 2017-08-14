import connect from 'connect'
import proxy from 'http-proxy-middleware'

import createForm from '../src/index'

const app = connect()

app.use('/favicon.ico', (req, res) => {
  res.writeHead(404)
  res.end()
})

app.use('/', (req, res, next) => {
  res.locals = {
    error: 'Please complete the following information!',
    title: 'test',
  }
  next()
})

app.use('/auth', createForm({
  action: '/login',
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
      name: 'sex',
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
  ],
  optionMap: {
    sex: [{
      value: '1',
      label: 'Male',
    }, {
      value: '2',
      label: 'Female',
    }]
  }
}))

app.use('/', proxy({
  target: 'http://localhost',
  changeOrigin: true,
}))

app.listen(3000)
