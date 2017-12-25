const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  connection.createChannel((err, channel) => {
    const exchangeName = 'logs';
    const msg = process.argv.slice(2).join(' ') || 'Hello World!';

    channel.assertExchange(exchangeName, 'fanout', { durable: false });
    channel.publish(exchangeName, '', Buffer.from(msg));
    console.log(`Sent ${ msg }`);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});