const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const OpenApiValidator = require('express-openapi-validator').OpenApiValidator
const apicache = require('apicache')
apicache.options({appendKey: (req, res) => req.header('Accept-Language')})
const cache = apicache.middleware
const onlyStatus200 = (request, response) => response.statusCode === 200
const cacheSuccesses = cache('5 minutes', onlyStatus200)

// Parser for JSON
app.use(cacheSuccesses)
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: false }))

// Enable CORS
app.use(cors())

new OpenApiValidator({
  apiSpec: 'util/OpenAPIContract.yaml',
  validateRequests: true,
  validateResponses: true
}).install(app).then(() => {
  app.use((err, req, res, next) => {
    res.status(err.status).json({
      status: 400,
      message: 'Bad Request',
      errors: err.errors
    })
  })

  // Inject routes
  require('./routes/docs')(app)
  require('./routes/collegeOrUniversity')(app)
  require('./routes/studyProgram')(app)
  require('./routes/module')(app)
  require('./routes/videoLecture')(app)

  // Listen for REST-Calls
  app.listen(3000, () => {
    console.log('API started on port 3000...')
  })
})
