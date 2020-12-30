const Twitter = require('twitter');
const axios = require('axios');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = async function (context, myTimer) {
    const timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);

    const nodeList = [
        { url: "http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000", name: "ap-northeast-1" },
        { url: "http://api-01.ap-southeast-1.0.10.0.x.symboldev.network:3000", name: "ap-southeast-1" },
        { url: "http://api-01.eu-central-1.0.10.0.x.symboldev.network:3000", name: "eu-central-1" },
        { url: "http://api-01.eu-west-1.0.10.0.x.symboldev.network:3000", name: "eu-west-1" },
        { url: "http://api-01.us-east-1.0.10.0.x.symboldev.network:3000", name: "us-east-1" },
        { url: "http://api-01.us-west-1.0.10.0.x.symboldev.network:3000", name: "us-west-1" }
    ];

    const twitter = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[getRandomInt(0, nodeList.length)].url;
        context.log(`node: ${node}`);
    
        const isSuccess = await axios
            .get(`${node}/node/storage`, { timeout: 5000 })
            .then((res) => {
                context.log(res.data);
                return res.data
            })
            .then(({numBlocks, numTransactions, numAccounts}) => {
                return new Promise((resolve, reject) => {
                    twitter.post(
                        'statuses/update',
                        {status: `Symbol Testnet\nNum Blocks: ${numBlocks}\nNum Transactions: ${numTransactions}\nNum Accounts: ${numAccounts}`},
                        function(error, tweet, response) {
                            if (error) {
                                context.log.error(error);
                                return reject();
                            };
                            if (process.env.NODE_ENV === 'development') {
                                context.log(tweet);
                                context.log(response);
                            }
                            resolve();
                        }
                    );
                })
            })
            .then(() => {
                return true;
            })
            .catch((e) => {
                context.log.error(e);
                return false;
            });

        if (isSuccess) {
            context.log("success")
            break;
        }
    }
    

};