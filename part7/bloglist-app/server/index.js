const app = require('./app')
const http = require('http')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

mongoose.connection.asPromise()
  .then(() => {
    server.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`)
    })
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  })