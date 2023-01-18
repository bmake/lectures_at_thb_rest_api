const _ = require('lodash')

const extractValues = binding => {
  const keys = Object.keys(binding)
  const result = {}
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === 'iri') {
      result[keys[i]] = _.last(_.split(binding[keys[i]].value, '/'))
    } else {
      result[keys[i]] = binding[keys[i]].value
    }
  }
  return result
}

const sendResponse = (response, status, error, result) => {
  response.status(status).send(JSON.stringify({ status, error, result }))
}

module.exports = {
  extractValues,
  sendResponse,
  develop_fuseki_url: '//localhost:3030/lectures_at_thb/query',
  production_fuseki_url: '//fuseki:3030/lectures_at_thb/query'
}