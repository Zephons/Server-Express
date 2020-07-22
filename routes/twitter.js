var express = require('express');
var Sentiment = require('sentiment');
var Twitter = require('twitter');
var router = express.Router();
var moment = require('moment');

var sentiment = new Sentiment();

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var tw, arr = [];

router.get('/:username', function (req, res, next) {
    var params = { screen_name: req.params.username };
    client.get('statuses/user_timeline', params, (error, tweets, response) => {
        if (!error && tweets != null) {
            tw = tweets;
            arr = [];
        }
        tw.forEach(function (item) {
            obj = {
                'userfullname': item.user.name,
                'username': item.user.screen_name,
                'tweet_text': item.text,
                'created_at': moment(item.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'CET').format('DD/MM/YYYY, HH:mm A'),
                'sentiment': sentiment.analyze(item.text)
            };
            arr.push(obj);
        });
        res.send(arr);
    });
});

module.exports = router;