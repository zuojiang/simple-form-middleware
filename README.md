## simple-form-middleware

### Description

A simple form middleware.

![screenshot](https://raw.githubusercontent.com/zuojiang/simple-form-middleware/master/screenshots/screenshot-1.3.0.png)

### Usage
```sh
$ npm install simple-form-middleware
```

```js
import connect from 'connect'
import createForm from 'simple-form-middleware'

const app = connect()

app.use('/auth', createForm({
  action: '/login',
  method: 'post',
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
      type: 'select',
      name: 'role',
      value: '1',
    },
    {
      name: 'code',
      type: 'captacha',
      'data-url': '/auth/test.png',
      required: true,
    },
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
  headers: {
    'Content-Type': 'application/json',
  },
  callbackStr: `function(err, text) {
    alert(err ? err.message : text)
  }`,
  // externalScriptUrl: '/auth/printReqInfo.js',
))

app.listen(3000)
```

### License

MIT
