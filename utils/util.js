var fs = require('fs')
var Promise = require('bluebird')
var cloudinary = require('cloudinary')
cloudinary.config({ 
  cloud_name: 'dnfhsjz8u', 
  api_key: '468518681239655', 
  api_secret: 'vzjsuIZ9Q00eRGQyjQTljRkBc18' 
})

exports.readFileAsync = function(fpath, encoding) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fpath, encoding, function(err, content) {
      if (err) reject(err)
      else resolve(content)
    })
  })
}

exports.uploadPromise = function(picURL) {
  return new Promise((resolve, reject) => {
  	cloudinary.v2.uploader.upload(picURL,
    function(error, result){
    	if(error) reject(error)
    	else resolve(result)
    })
  })
}