const fs = require('fs')
const axios = require('axios')
const querystring = require('querystring')
const apicache = require('apicache')
const cache = apicache.middleware

const onlyStatus200 = (request, response) => request.statusCode === 200
const cacheSuccesses = cache('5 minutes', onlyStatus200)

const sendResponse = (response, status, error, result) => {
  response.status(status).send(JSON.stringify({ status, error, result }))
}

const extractValues = binding => {
  const keys = Object.keys(binding)
  const result = {}
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = binding[keys[i]].value
  }
  return result
}

module.exports = (app) => {
  app.get('/videoLecture/:IRI',
    cacheSuccesses, (request, response) => {
      let query
      query = fs.readFileSync('queries/videoLectureByIRI.rq', 'utf8')
      query = query.replace('%videoLecture%', querystring.escape(request.params.IRI))
      axios.get('http://fuseki:3030/lectures_at_thb/query', {
        params: {
          query: query
        }
      })
        .then(res => {
          const results = res.data.results.bindings
          if (results.length === 0) {
            sendResponse(response, 404, 'No video lecture was found!', null)
          }
          const videoLecture = results.map(r => extractValues(r))
          sendResponse(response, 200, null, videoLecture.length === 1 ? videoLecture[0] : videoLecture)
        })
        .catch(function (error) {
          sendResponse(response, 500, error, null)
        })
    })
}
