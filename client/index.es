import serialize from 'form-serialize'
import urlencode from 'form-urlencoded'

function submitByFetch(form, headers = {}) {
  let url = form.getAttribute('action')
  let method = form.getAttribute('method')
  let enctype = form.getAttribute('enctype')
  let contentType = headers['Content-Type'] || headers['content-type']
  let body = {}

  if (/^get$/i.test(method)) {
    url = url +'?'+ serialize(form)
  } else if (enctype === 'multipart/form-data') {
    body = new FormData()
    for (let input of form.elements) {
      if (input.type === 'file') {
        for (let file of input.files) {
          body.append(input.name, file)
        }
      } else {
        body.append(input.name, input.value)
      }
    }
  } else if (contentType === 'application/json') {
    body = JSON.stringify(serialize(form, {
      hash: true,
    }))
  } else {
    delete headers['content-type']
    headers['Content-Type'] = contentType || 'application/x-www-form-urlencoded; charset=UTF-8'
    body = urlencode(serialize(form, {
      hash: true,
    }))
  }

  return fetch(url, {
    credentials: 'same-origin',
    method,
    headers,
    body,
  })
}

global.submitByFetch = submitByFetch
