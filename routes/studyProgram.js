const fs = require('fs')
const axios = require('axios')
const querystring = require('querystring')
const path = require('path')
const fusekiUrl = require(path.join(__dirname, '..', 'util', 'helperFunctions')).productionFusekiUrl

module.exports = app => {
  const extractValues = require(path.join(__dirname, '../util/helperFunctions')).extractValues
  const sendResponse = require(path.join(__dirname, '../util/helperFunctions')).sendResponse
  app.get('/v1/studyProgram/collegeOrUniversity/:collegeOrUniversityIRI',
    (request, response) => {
      const query = fs.readFileSync('queries/studyProgramByDepartmentIRI.rq', 'utf8')
      const languageRegExp = new RegExp('%language%', 'g')
      let parameterizedQuery = query.replace(
        languageRegExp,
        querystring.escape(request.header('Accept-Language')))
      parameterizedQuery = parameterizedQuery.replace(
        '%department%',
        querystring.escape(request.params.collegeOrUniversityIRI))
      axios.get(fusekiUrl, {
        params: {
          query: parameterizedQuery
        }
      })
        .then(res => {
          const results = res.data.results.bindings
          if (results.length === 0) {
            sendResponse(response, 404, 'No study program was found!', null)
          } else {
            const department = results.map(r => extractValues(r))
            sendResponse(response, 200, null, department)
          }
        })
        .catch(function (error) {
          if (typeof error.response === 'undefined' || error.response.status === 404) {
            sendResponse(response, 503, 'Service Unavailable', null)
          } else {
            sendResponse(response, error.response.status, error.response.statusText, null)
          }
        })
    })
}
