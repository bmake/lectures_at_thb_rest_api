const fs = require('fs')
const axios = require('axios')
const querystring = require('querystring')
const path = require('path')
const fuseki_url = require(path.join(__dirname, '..','util', 'helperFunctions')).production_fuseki_url

module.exports = app => {
  const extractValues = require(path.join(__dirname,'../util/helperFunctions')).extractValues
  const sendResponse = require(path.join(__dirname,'../util/helperFunctions')).sendResponse
  const languageRegExp = new RegExp('%language%', 'g')
  const videoLectureRegExp = new RegExp('%videoLecture%', 'g')
  const durationRegExp = new RegExp(/PT([0-9]+)M([0-9]+)S/, 'g')

  app.get('/v1/videoLecture/:IRI', (request, response) => {
    (async function () {
      try {
        const videoLectureQuery = fs.readFileSync('queries/videoLectureByIRI.rq', 'utf8')
        let parameterizedVideoLectureQuery = videoLectureQuery.replace(
          languageRegExp,
          querystring.escape(request.header('Accept-Language')))
        parameterizedVideoLectureQuery = parameterizedVideoLectureQuery.replace(videoLectureRegExp, querystring.escape(request.params.IRI))
        const videoLectureResult = await axios.get(fuseki_url, {
          params: {
            query: parameterizedVideoLectureQuery
          }
        })
        const videoObjectDurationQuery = fs.readFileSync('queries/videoObjectDurationByVideoLectureIRI.rq', 'utf8')
        let parameterizedVideoObjectDurationQuery = videoObjectDurationQuery.replace(
          languageRegExp,
          querystring.escape(request.header('Accept-Language')))
        parameterizedVideoObjectDurationQuery = parameterizedVideoObjectDurationQuery.replace(videoLectureRegExp, querystring.escape(request.params.IRI))
        const videoObjectDurationResult = await axios.get(fuseki_url, {
          params: {
            query: parameterizedVideoObjectDurationQuery
          }
        })
        const videoLectureBindings = videoLectureResult.data.results.bindings
        const videoObjectDurationBindings = videoObjectDurationResult.data.results.bindings
        let videoLecture
        if (videoLectureBindings.length === 0) {
          sendResponse(response, 404, 'No video lecture was found!', null)
        } else {
          videoLecture = videoLectureBindings.map(extractValues)
          const videoObjectDurations = videoObjectDurationBindings.map(extractValues)
          let duration = videoObjectDurations.map(o => o.duration).reduce((acc, cur) => {
            const matches = cur.matchAll(durationRegExp).next().value
            let seconds = parseInt(matches[1]) * 60
            seconds += parseInt(matches[2])
            return acc + seconds
          }, 0)
          sendResponse(response, 200, null, videoLecture.map(v => {
            return { ...v, duration}
          })[0])
        }
      } catch(error) {
        if (typeof error.response === 'undefined' || error.response.status === 404) {
          sendResponse(response, 503, 'Service Unavailable', null)
        } else {
          sendResponse(response, error.response.status, error.response.statusText, null)
        }
      }
    })()
  })

  app.get('/v1/videoLecture/module/:moduleIRI', (request, response) => {
    const query = fs.readFileSync('queries/videoLectureByModuleIRI.rq', 'utf8')
    const parameterizedQuery = query.replace('%module%', querystring.escape(request.params.moduleIRI))
    axios.get(fuseki_url, {
      params: {
        query: parameterizedQuery
      }
    })
      .then(res => {
        const results = res.data.results.bindings
        if (results.length === 0) {
          sendResponse(response, 404, 'No video lecture was found!', null)
        } else {
          const videoLecture = results.map(extractValues)
          sendResponse(response, 200, null, videoLecture)
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

  app.get('/v1/videoLecture/:videoLectureIRI/videoObjects', (request, response) => {
    const query = fs.readFileSync('queries/videoObjectsByVideoLectureIRI.rq', 'utf8')
    let parameterizedQuery = query.replace(videoLectureRegExp, querystring.escape(request.params.videoLectureIRI))
    console.log(parameterizedQuery)
    axios.get(fuseki_url, {
      params: {
        query: parameterizedQuery
      }
    })
      .then(res => {
        const results = res.data.results.bindings
        if (results.length === 0) {
          sendResponse(response, 404, 'No video lecture was found!', null)
        } else {
          const videoLecture = results.map(extractValues)
          sendResponse(response, 200, null, videoLecture)
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
