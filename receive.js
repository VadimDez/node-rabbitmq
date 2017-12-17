const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, channel) => {
        const q = 'hello';
        
        channel.assertQueue(q, { durable: false });
    });
});