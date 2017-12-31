/**
 * Created by Vadym Yatsyuk on 31.12.17
 */
const amqp = require('amqplib/callback_api');
const config = require('./config.json');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: rpc_client.js num');
  process.exit(1);
}

amqp.connect(config.AMQP, (err, connection) => {
  connection.createChannel((err, channel) => {
    channel.assertQueue('', { exclusive: true }, (err, queue) => {
      const corr = generateUuid();
      const num = parseInt(args[0]);


      console.log(`[x] Requesting fib(${ num })`);

      channel.consume(queue.queue, msg => {
        if (msg.properties.correlationId === corr) {
          console.log(`[.] Got ${ msg.content.toString() }`);
          setTimeout(() => {
            connection.close();
            process.exit(0);
          }, 500);
        }
      }, { noAck: true });

      channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), { correlationId: corr, replyTo: queue.queue });


    });
  });
});

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}