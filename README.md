## simple-form-middleware

### Description

A simple form middleware.

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
    'X-Requested-With': 'Fetch',
  },
  callbackStr: `function(err, text) {
    alert(err ? err.message : text)
  }`,
))

app.listen(3000)
```

### License

MIT
