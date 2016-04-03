var config = module.exports
var PRODUCTION = process.env.NODE_ENV === 'production'

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: '127.0.0.1'
}

config.mongodb = {
  port: process.env.MONGODB_PORT || 27017,
  host: process.env.MONGODB_HOST || 'localhost',
  db: 'test',
  user: null,
  password: null
}

config.mailer = {
    service: 'Gmail',
    auth: {
        user: 'anthony.moynet2@gmail.com',
        pass: '11Caca11'
    }
}

if (PRODUCTION) {
  config.express.ip = '0.0.0.0'
}
