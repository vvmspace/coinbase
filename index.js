const Gdax = require('gdax');

let tickers = {};

const websocket = new Gdax.WebsocketClient(
    ['BTC-USD'],
    'wss://ws-feed.pro.coinbase.com'
  );

websocket.on('message', data => {
    if (!data.product_id) {
        return;
    }
    tickers[data.product_id] = data.price;
    console.log(tickers);
});

const parseMessage = message => {
    if (message == 'quit') {
        process.exit();
    }
    const [token, command] = message.split(' ');
    
    console.log(token);
    if (command == 's') {
        websocket.subscribe({
            product_ids: [token],
            channels: ['ticker']
        });
    }
    if (command == 'u') {
        websocket.unsubscribe({
            product_ids: [token],
            channels: ['ticker']
        });
    }
};

websocket.on('open', () => parseMessage('LTC-USD s'))

setTimeout(() => parseMessage('quit'), 30000);