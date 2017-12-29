/**
 * Created by Vadym Yatsyuk on 29.12.17
 */
const amqp = require('amqplib/callback_api');
const config = require('./config.json');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

amqp.connect(config.AMQP, (err, connection) => {
  connection.createChannel((err, channel) => {
    const exchangeName = 'topic_logs';

    channel.assertExchange(exchangeName, 'topic', { durable: false });

    channel.assertQueue('', { exclusive: true }, (err, queue) => {
      console.log('[*] Waiting for logs. To exit press CTRL+C');

      args.forEach(key => {
        channel.bindQueue(queue.queue, exchangeName, key);
      });

      channel.consume(queue.queue, msg => {
        console.log(`[x] ${ msg.fields.routingKey }:'${ msg.content.toString() }'`);
      }, { noAck: true });
    });
  });
});