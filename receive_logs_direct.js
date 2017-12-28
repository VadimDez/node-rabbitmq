const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

amqp.connect('amqp://localhost', (err, connection) => {
  connection.createChannel((err, channel) => {
    const exchangeName = 'direct_logs';
    
    channel.assertExchange(exchangeName, 'direct', { durable: false });

    channel.assertQueue('', { exclusive: true }, (err, queue) => {
      console.log(`[*] Waiting for messages in ${ queue.queue }. To exit press CTRL+C`);

      args.forEach(severity => {
        channel.bindQueue(queue.queue, exchangeName, severity);
      });

      channel.consume(queue.queue, msg => {
        console.log(`[x] ${ msg.content } `);
      }, { noAck: true });
    });
  });
});