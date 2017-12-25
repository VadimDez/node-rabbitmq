const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  connection.createChannel((err, channel) => {
    const exchangeName = 'logs';
    
    channel.assertExchange(exchangeName, 'fanout', { durable: false });

    channel.assertQueue('', { exclusive: true }, (err, queue) => {
      console.log(`[*] Waiting for messages in ${ queue.queue }. To exit press CTRL+C`);

      channel.bindQueue(queue.queue, exchangeName, '');

      channel.consume(queue.queue, msg => {
        console.log(`[x] ${ msg } `);
      }, { noAck: true });
    });
  });
});