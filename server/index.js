'use strict'
/*jshint node:true*/

const http = require('http')
const ws = require('ws')
const mongoServer = require('amelisa/mongo-server')
const amelisaServer = require('amelisa/server')

const port = process.env.PORT || 4201
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/ember-amelisa'

const storage = new mongoServer.MongoStorage(mongoUrl)
const options = {
  version: 1,
  storage,
  collections: {
    items: {
      client: true
    }
  },
  projections: {},
  clientStorage: true,
  saveOps: false
}

let store = new amelisaServer.Store(options)

store.init()

let server = http.createServer()
let wsServer = new ws.Server({server})

wsServer.on('connection', store.onConnection)

server.listen(port, (err) => {
  if (err) {
    console.error('Can\'t start server, Error:', err)
  } else {
    console.info(`${process.pid} listening. Go to: http://localhost:${port}`)
  }
})

module.exports = function (app) {

}
