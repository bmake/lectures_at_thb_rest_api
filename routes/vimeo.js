const axios = require('axios')
const path = require('path')

module.exports = app => {
  const sendResponse = require(path.join(__dirname, '../util/helperFunctions')).sendResponse
  app.get('/v1/vimeo/:videoID',
    (request, response) => {
      const url = new URL(request.params.videoID, 'https://player.vimeo.com/video/').href + '/config'
      console.log(url)
      axios.get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(res => {
          const streams = res.data.request.files.progressive
          let links = streams.map(r => {
            return { quality: r.quality, url: r.url }
          })
          links = links.map(r => ({ ...r, thumbnail: res.data.video.thumbs.base }))
          if (streams.length === 0) {
            sendResponse(response, 404, 'No video was found!', null)
          } else {
            sendResponse(response, 200, null, links)
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
