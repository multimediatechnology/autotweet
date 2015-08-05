var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var async = require('async')
var mkdirp = require('mkdirp')
var Twitter = require('twitter')
var EOL = require('os').EOL;
require('dotenv').load()

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

// constants
var SOURCES_PATH = path.join(__dirname, 'sources')
var DATA_PATH = path.join(__dirname, 'data')

var users = fs.readFileSync(path.join(DATA_PATH, 'names.json'), 'utf8')
users = JSON.parse(users)

// take subset
users = users.slice(300, 310)

async.eachLimit(
  users, 10,
  function(user, done) {
    var params = {
      screen_name: user
    }
    console.log('try following "' + user + '"')
    client.post('friendships/create', params, function(err, friend, response) {
      if (err) {
        return done(err)
      }
      console.log('added "' + friend.name + '" as friend')
      done()
    })
  },
  function(err) {
    if (err) {
      return console.error(err)
    }
    console.log('Done')
  }
)
/*
 // extract members from lists
 var lists = fs.readFileSync(path.join(SOURCES_PATH, 'lists.txt'), {encoding: 'utf8'})
 lists = lists.split(EOL)
 var listParams = []

 var extractRegex = /https:\/\/twitter\.com\/(.*)\/lists\/(.*)\/members/g;

 _.forEach(lists, function(list) {
 var results = extractRegex.exec(list)
 if (!_.isArray(results)) {
 return
 }

 var owner = results[1]
 var slug = results[2]

 listParams.push({
 owner: owner,
 slug: slug
 })
 })

 // create dir
 mkdirp(DATA_PATH)

 var list = []

 async.each(listParams, function(listSpec, done) {
 var params = {
 owner_screen_name: listSpec.owner,
 slug: listSpec.slug,
 count: 5000
 }

 client.get('lists/members', params, function(err, members, response) {
 if (err) {
 return done(err)
 }

 _.forEach(members.users, function(user) {
 list.push(user.screen_name)
 })

 done()
 })
 }, function(err) {
 if (err) {
 return console.error(err)
 }

 list = _.unique(list)

 fs.writeFile(
 path.join(DATA_PATH, 'names.json'),
 JSON.stringify(list, null, 2),
 function(err) {
 if (err) {
 return console.error(err)
 }

 console.log('Done')
 })
 })
 */
