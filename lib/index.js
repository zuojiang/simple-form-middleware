'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref) {
  var action = _ref.action,
      _ref$method = _ref.method,
      method = _ref$method === undefined ? 'post' : _ref$method,
      enctype = _ref.enctype,
      _ref$fieldset = _ref.fieldset,
      fieldset = _ref$fieldset === undefined ? [] : _ref$fieldset,
      _ref$selectOptions = _ref.selectOptions,
      selectOptions = _ref$selectOptions === undefined ? {} : _ref$selectOptions,
      headers = _ref.headers,
      callbackStr = _ref.callbackStr;

  if (!enctype) {
    enctype = fieldset.find(function (_ref2) {
      var type = _ref2.type;
      return type === 'file';
    }) ? 'multipart/form-data' : 'application/x-www-form-urlencoded';
  }

  var serve = (0, _serveStatic2.default)(_path2.default.join(__dirname, '..', 'public'));

  return function (req, res, next) {
    serve(req, res, function () {
      var _res$locals = res.locals,
          locals = _res$locals === undefined ? {} : _res$locals;
      var title = locals.title,
          error = locals.error;

      var _url$parse = _url2.default.parse(req.originalUrl || req.url, true),
          pathname = _url$parse.pathname,
          query = _url$parse.query;

      var fields = fieldset.map(function (attr) {
        var value = locals[attr.name] || query[attr.name];
        if (value) {
          return _extends({}, attr, {
            value: value
          });
        }
        return attr;
      });

      Object.keys(query).forEach(function (name) {
        if (!fields.find(function (attr) {
          return attr.name === name;
        })) {
          fields.push({
            name: name,
            value: query[name]
          });
        }
      });

      if (headers) {
        if (!callbackStr) {
          callbackStr = 'function(err, body){\n            document.write(err ? err.message : body)\n            document.close()\n          }';
        }
      } else {
        headers = {};
      }

      res.end(render({
        baseUrl: pathname,
        title: title,
        error: error,
        action: action,
        method: method,
        enctype: enctype,
        fields: fields,
        selectOptions: selectOptions,
        headers: headers,
        callbackStr: callbackStr
      }));
    });
  };
};

var _serveStatic = require('serve-static');

var _serveStatic2 = _interopRequireDefault(_serveStatic);

var _pug = require('pug');

var _pug2 = _interopRequireDefault(_pug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var render = _pug2.default.compileFile(_path2.default.join(__dirname, '..', 'pug', 'form.pug'), {
  pretty: true
});