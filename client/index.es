import serialize from 'form-serialize'

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
    body = new FormData(form)
  }

  return fetch(url, {
    method,
    headers,
    body,
  })
}

global.submitByFetch = submitByFetch
