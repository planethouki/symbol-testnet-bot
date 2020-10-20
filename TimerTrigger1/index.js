const Twitter = require('twitter');
const axios = require('axios');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = function (context, myTimer) {
    const timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);

    const nodeList = process.env.NODES_CSV.split(",");
    const node = nodeList[getRandomInt(0, nodeList.length)]
    context.log(`node: ${node}`);
    axios.defaults.baseURL = node;

    const twitter = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
    
    axios.get("/node/storage").then((res) => {
        context.log(res.data);
        return res.data
    }).then(({numBlocks, numTransactions, numAccounts}) => {
        twitter.post(
            'statuses/update',
            {status: `Num Blocks: ${numBlocks}\nNum Transactions: ${numTransactions}\nNum Accounts: ${numAccounts}`},
            function(error, tweet, response) {
                if (error) {
                    context.log(error);
                };
                if (process.env.NODE_ENV === 'development') {
                    context.log(tweet);
                    context.log(response);
                }
                context.done();
            }
        );
    }).catch((e) => {
        context.log(e);
        context.done();
    })

};