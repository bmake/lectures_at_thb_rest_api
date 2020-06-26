const express = require('express')
const cors = require('cors')
const app = express()

// Enable CORS
app.use(cors())

// Inject routes
require('./routes/videoLecture')(app)

// Listen for REST-Calls
app.listen(3000, () => {
  console.log('API started on port 3000...')
})
