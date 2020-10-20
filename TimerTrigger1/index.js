const Twitter = require('twitter');

module.exports = async function (context, myTimer) {
    const timeStamp = new Date().toISOString();

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    client.post(
        'statuses/update',
        {status: 'Now: ' + new Date()},
        function(error, tweet, response) {
            if(error) throw error;
            console.log(tweet);
            console.log(response);
        }
    );
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
};