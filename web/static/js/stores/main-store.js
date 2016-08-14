if (process.env.NODE_ENV === 'production') {
  module.exports = require('./main-store.prod')
} else {
  module.exports = require('./main-store.dev')
}