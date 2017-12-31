/**
 * Created by Vadym Yatsyuk on 31.12.17
 */
const amqp = require('amqplib/callback_api');
const config = require('./config.json');

amqp.connect(config.AMQP, (err, connection) => {
  connection.createChannel((err, channel) => {
    const queueName = 'rpc_queue';

    channel.assertQueue(queueName, { durable: false });
    channel.prefetch(1);

    console.log('[x] Awaiting RPC requests');

    channel.consume(queueName, msg => {
      const n = parseInt(msg.content.toString(), 10);

      console.log(`[.] fib(${ n })`);

      const r = fibonacci(n);

      channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), { correlationId: msg.properties.correlationId });

      channel.ack(msg);
    })
  });
});

function fibonacci(n) {
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}