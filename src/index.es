import serveStatic from 'serve-static'
import pug from 'pug'
import path from 'path'
import url from 'url'

const render = pug.compileFile(path.join(__dirname, '..', 'pug', 'form.pug'), {
  pretty: true,
})

export default function ({
  method = 'post',
  enctype,
  fieldset = [],
  selectOptions = {},
  headers,
  callbackStr,
  ...others,
}) {
  if (!enctype) {
    enctype = fieldset.find(({type}) => type === 'file')
      ? 'multipart/form-data'
      : 'application/x-www-form-urlencoded'
  }

  const serve = serveStatic(path.join(__dirname, '..', 'public'))

  return (req, res, next) => {
    serve(req, res, () => {

      const {
        locals = {},
      } = res

      const {
        pathname,
        query,
      } = url.parse(req.originalUrl || req.url, true)

      const fields = fieldset.map(attr => {
        let value = locals[attr.name] || query[attr.name]
        if (value) {
          return {
            ...attr,
            value,
          }
        }
        return attr
      })

      Object.keys(query).forEach(name => {
        if (!fields.find(attr => attr.name === name)) {
          fields.push({
            name,
            value: query[name],
          })
        }
      })

      if (headers) {
        if (!callbackStr) {
          callbackStr = `function(err, body){
            document.write(err ? err.message : body)
            document.close()
          }`
        }
      } else {
        headers = {}
      }

      res.end(render({
        ...locals,
        ...others,
        baseUrl: pathname,
        method,
        enctype,
        fields,
        selectOptions,
        headers,
        callbackStr,
      }))
    })
  }
}
