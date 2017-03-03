const shorten = (ony,url,cb) => {
  ony.shorten(url, function(result) {
      if (!result.error) {
          cb(null,"https://www."+result.shorturl)
      } else {
          cb(result.error)
      }
  });
}

module.exports = {
  shorten : shorten
}
