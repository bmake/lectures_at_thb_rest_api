const fs = require('fs')
const axios = require('axios')
const querystring = require('querystring')
const path = require('path')
const fuseki_url = require(path.join(__dirname, '..','util', 'helperFunctions')).production_fuseki_url

module.exports = app => {
  const extractValues = require(path.join(__dirname,'../util/helperFunctions')).extractValues
  const sendResponse = require(path.join(__dirname,'../util/helperFunctions')).sendResponse
  app.get('/v1/lectureCodes',
    (request, response) => {
      const query = fs.readFileSync('queries/allLectureCodes.rq', 'utf8')
      //const languageRegExp = new RegExp('%language%', 'g')
      //let parameterizedQuery = query.replace(languageRegExp, querystring.escape(request.header('Accept-Language')))
      //parameterizedQuery = parameterizedQuery.replace( '%department%',querystring.escape(request.params.collegeOrUniversityIRI))
      axios.get(fuseki_url, {
        params: {
          query: query
        }
      })
        .then(res => {
          const results = res.data.results.bindings
          if (results.length === 0) {
            sendResponse(response, 404, 'No lecture was found!', null)
          } else {
            const lectureCodes = results.map(r => extractValues(r))
            sendResponse(response, 200, null, lectureCodes)
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
