var fs      = require('fs')
var express = require('express')
var cors    = require('cors')
var http    = require('http')
var path    = require('path')
var low     = require('lowdb')
var utils   = require('./utils')
var routes  = require('./routes')

low._.createId = utils.createId

var server = express()

var apiPrefix = server.get('apiPrefix') || process.env.API_PREFIX || ''

server.set('apiPrefix', apiPrefix)

server.set('port', process.env.PORT || 3000)
server.use(express.logger('dev'))
server.use(express.json())
server.use(express.urlencoded())
server.use(express.methodOverride())

if (fs.existsSync(process.cwd() + '/public')) {
  server.use(express.static(process.cwd() + '/public'));
} else {
  server.use(express.static(path.join(__dirname, './public')));
}

server.use(cors())
server.use(server.router)

if ('development' == server.get('env')) {
  server.use(express.errorHandler());
}

server.get(   apiPrefix + '/db'                          , routes.db)
server.get(   apiPrefix + '/:resource'                   , routes.list)
server.get(   apiPrefix + '/:parent/:parentId/:resource' , routes.list)
server.get(   apiPrefix + '/:resource/:id'               , routes.show)

server.post(  apiPrefix + '/:resource'                   , routes.create)

server.put(   apiPrefix + '/:resource/:id'               , routes.update)
server.patch( apiPrefix + '/:resource/:id'               , routes.update)

server.delete(apiPrefix + '/:resource/:id'               , routes.destroy)

server.low = low

module.exports = server
