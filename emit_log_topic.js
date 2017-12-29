/**
 * Created by Vadym Yatsyuk on 29.12.17
 */
const amqp = require('amqplib/callback_api');
const config = require('./config.json');

amqp.connect(config.AMQP, (err, connection) => {

  connection.createChannel((err, channel) => {
    const exchangeName = 'topic_logs';
    const args = process.argv.slice(2);
    const key = (args.length > 0) ? args[0] : 'anonymous.info';
    const msg = args.slice(1).join(' ') || 'Hello World!';

    channel.assertExchange(exchangeName, 'topic', { durable: false });
    channel.publish(exchangeName, key, Buffer.from(msg));

    console.log(`[x] Sent ${ key }:'${ msg }'`);
  });


  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});