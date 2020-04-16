// This is the API key from your Trefle account page.
// Make sure to replace it with your own.
const USER_API_KEY = 'N1NhQ2lHUFA3RUx3eHA4c1RhdTQ5QT09'
const ORIGIN = ''
var TOKEN // This is the token we get each time through the POST request in order to actually access the API.

var express = require('express')
var app = express()
var https = require('https')

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

// Start reading the code after this function (at line 63,) and come back to this.
// This function basically makes sure we have a valid token every time we make a request to Trefle.

const checkOrUpdateToken = function(callback) {
  // First, we check if we have a TOKEN, and if it's still active.
  // The TOKEN is still active if its expiration date is in the future.

  var nowTimeInSeconds = Date.now() / 1000 // The expiration we get in the token object is in seconds.
  // Date.now() returns a timestamp in milliseconds, so we divide by 1000.

  if (TOKEN && TOKEN.expiration > nowTimeInSeconds) {
    // This means we have an active token, and don't need to update it.
    console.log('TOKEN VERIFICATION: We already have a valid token!')
    callback()
    return
  } else {
    console.log('TOKEN VERIFICATION: Requesting a new token...')
    // We need to request a new token from the /api/auth/claim endpoint. 
    // This http request code is taken from Shawn's example here: 
    // https://itp.nyu.edu/classes/nm-sp2020/ajax-with-jquery-using-web-services/
    // (REQUESTING WITH NODE.JS AND JAVASCRIPT section)
    https.request({
      host: 'trefle.io',
      path: '/api/auth/claim?token=' + USER_API_KEY + '&origin=' + ORIGIN,
      method: 'POST'
    }, function(response) {
        // This string will contain everything back from the server but it will come in chunks
        var str = '';
        // Got a chunk
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function () {
          // This is where our HTTP request for a Trefke token is complete. str will contain all the results.
          // We need to convert str into an object, and that is our token!
          var responseObject = JSON.parse(str)
          TOKEN = responseObject

          // Now that we've updated the TOKEN, we can invoke the callback,
          // which means we return to actually executing our code in app.get('/kingdom').
          callback()
          console.log('TOKEN VERIFICATION: Done acquiring new token!')
        });
    }).end()
  }
}

app.get('/', function (req, res) {
  res.render('index.ejs', {});
})

app.get('/kingdom', function(req, res) {
  checkOrUpdateToken(function() {
    // When we're inside of this function, we have the guarantee of a valid TOKEN.
    // checkOrUpdateToken only calls its callback once it ensures that the current TOKEN is functional.
    
    // This means we can actually go ahead and make our request.

    var kingdomId = 1 // Just using this for a test, in your app you'll likely take these 
    // parameters from a user input, etc.
  
    https.request({
      host: 'trefle.io',
      path: '/api/kingdoms/' + kingdomId + '?token=' + TOKEN.token,
      method: 'GET'
    }, function(response) {
        // This string will contain everything back from the server but it will come in chunks
        var str = '';
        // Got a chunk
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function () {
          // This is where our HTTP request to Trefle is complete. str will contain all the results.
          // We need to convert str into an object, and that is the data we're looking for!
          var kingdomData = JSON.parse(str)          

          // We can return the kingdomData to our frontend Javascript.
          res.send(kingdomData)          
        });
    }).end()
  })
})

// I just added one more example without the comments, for you to see it's not that long.
// The thing to notice is that we're using the checkOrUpdateToken again, as a wrapper.
// Our code should go inside of its callback. That's how we make sure there's a valid token
// every time we make a request to Trefle. 

app.get('/families', function(req, res) {
  checkOrUpdateToken(function() {
    var familyId = 1
    https.request({
      host: 'trefle.io',
      path: '/api/families/' + familyId + '?token=' + TOKEN.token,
      method: 'GET'
    }, function(response) {
        var str = '';
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function () {
          var familyData = JSON.parse(str)          
          res.send(familyData)          
        });
    }).end()
  })
})

app.get('/plants', function(req, res) {
  checkOrUpdateToken(function() {
    var familyId = 1
    https.request({
      host: 'trefle.io',
      path: '/api/plants/' + plantId + '?token=' + TOKEN.token,
      method: 'GET'
    }, function(response) {
        var str = '';
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function () {
          var plantData = JSON.parse(str)          
          res.send(plantData)          
        });
    }).end()
  })
})