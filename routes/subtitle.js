const axios = require('axios')
const path = require('path')
const fs = require('fs')

module.exports = app => {
  const sendResponse = require(path.join(__dirname, '../util/helperFunctions')).sendResponse
  app.get('/v1/vimeo/subtitle/:videoID',
    (request, response) => {
      //const bURL = new URL(request.params.videoID + '/texttracks', 'https://api.vimeo.com/videos/')

      const url = new URL(request.params.videoID + '/texttracks', 'https://api.vimeo.com/videos/').href;
      console.log(url)
      axios.get(url, {
        headers: {
          'Authorization': 'Bearer 87dd0bc7206a05b9c716b853db535a47'
        }
      })
        .then(res => {
          const data = res.data.data
          if (data.length > 0) {
            let subtitleLink = data[0].link;
            return axios.get(subtitleLink)
          } else {
            return ''
          }
        })
        .then(res => {
          if(res.toString() === '') {
            sendResponse(response, 404, 'No subtitle was found!', null)
          } else {
            fs.writeFile('/subtitles/' + request.params.videoID + '.vtt', res.data, err => {
              if (err) {
                console.error(err);
              }
            });
            sendResponse(response, 200, null, 'file written successfully')
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
