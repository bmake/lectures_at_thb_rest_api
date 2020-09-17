const fs = require('fs')
const axios = require('axios')
const querystring = require('querystring')
const path = require('path')

module.exports = app => {
  const extractValues = require(path.join(__dirname,'../util/helperFunctions')).extractValues
  const sendResponse = require(path.join(__dirname,'../util/helperFunctions')).sendResponse
  app.get('/v1/module/studyProgram/:studyProgramIRI',
    (request, response) => {
      const query = fs.readFileSync('queries/moduleByStudyProgramIRI.rq', 'utf8')
      const languageRegExp = new RegExp('%language%', 'g')
      let parameterizedQuery = query.replace(
        languageRegExp,
        querystring.escape(request.header('Accept-Language')))
      parameterizedQuery = parameterizedQuery.replace(
        '%studyProgram%',
        querystring.escape(request.params.studyProgramIRI))
      axios.get('http://localhost:3030/lectures_at_thb/query', {
        params: {
          query: parameterizedQuery
        }
      })
        .then(res => {
          const results = res.data.results.bindings
          if (results.length === 0) {
            sendResponse(response, 404, 'No module was found!', null)
          } else {
            const department = results.map(r => extractValues(r))
            sendResponse(response, 200, null, department)
          }
        })
        .catch(function (error) {
          if (error.response.status === 404) {
            sendResponse(response, 503, 'Service Unavailable', null)
          } else {
            sendResponse(response, error.response.status, error.response.message, null)
          }
        })
    })
}
