const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  connection.createChannel((err, channel) => {
    const exchangeName = 'direct_logs';
    const args = process.argv.slice(2);
    const msg = args.slice(1).join(' ') || 'Hello World!';
    const severity = (args.length > 0) ? args[0] : 'info';

    channel.assertExchange(exchangeName, 'direct', { durable: false });
    channel.publish(exchangeName, severity, Buffer.from(msg));
    console.log(`Sent ${ msg }`);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});