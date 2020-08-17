var express = require('express');
var router = express.Router();
var config = require('./../config.json')
const fs = require('fs');
let lastRequest = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'mini' });
});

/* GET forwarding page. */
router.get('/*', function(req, res, next) {
  let currentShorts = require('./../shortened.json');
  if(currentShorts[req.params[0]]) 
    return res
      .set("Cache-Control", `max-age=${config.expiration * 3600},public`)
      .redirect(currentShorts[req.params[0]].longURL, 301);
  return res.sendStatus(404)
});

/* POST API shorten. */
router.post('/shorten', function(req, res, next) {
  try{
    if (req.body.urlToShort.length >= 1000) return res.sendStatus(413);
    if (!validateURL(req.body.urlToShort)) return res.sendStatus(406);

    let remoteIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (lastRequest[remoteIP] && ((new Date() - lastRequest[remoteIP]) / 1000 < (config.cooldown || 60))) return res.sendStatus(429);

      let urlID = getID();
      lastRequest[remoteIP] = new Date();
      
      let currentShorts = require('./../shortened.json');
      currentShorts[urlID] = {
        longURL: req.body.urlToShort,
        created: {
          at: new Date(),
          remoteIP
        }
      }
      fs.writeFileSync('./shortened.json', JSON.stringify(currentShorts));
    

    res.set('Content-Type', 'application/json')
    res.status(200).send({
      id: urlID,
      url: config.baseURL + urlID
    });
  } catch(err){
    console.log(err);
    return res.sendStatus(500);
  }
});

module.exports = router;

function validateURL(inp) { 
  let urlReg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ // thanks to https://urlregex.com
  return urlReg.test(inp);
}

function getID(){
  return Math.floor((1 + Math.random()) * 0x1000000)
    .toString(16)
    .substring(1);
}