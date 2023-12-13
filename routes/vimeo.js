const axios = require('axios')
const path = require('path')

module.exports = app => {
  const sendResponse = require(path.join(__dirname, '../util/helperFunctions')).sendResponse
  app.get('/v1/vimeo/:videoID',
    (request, response) => {
      const url = new URL(request.params.videoID, 'https://api.vimeo.com/videos/').href;
      console.log(url)
      axios.get(url, {
        headers: {
          'Authorization': 'Bearer 87dd0bc7206a05b9c716b853db535a47'
        }
      })
    .then(res => {
      const streams = res.data.play.progressive;
      console.log(streams)
      let links = streams.map(r => {
        return {'quality': r.rendition, 'url': r.link}
      });
      links = links.map(r => ({ ...r, thumbnail: res.data.pictures.base_link }));
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
