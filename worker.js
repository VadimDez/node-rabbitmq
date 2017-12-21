const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, channel) => {
    const q = 'task_queue';
    
    channel.assertQueue(q, { durable: true });
    channel.prefetch(1);

    console.log(`[*] Waiting for messages in ${ q }. To exit press CTRL+C`);

    channel.consume(q, msg => {
      console.log(`[x] Received ${ msg.content.toString() }`);
      const seconds = getSecondsFromString(msg.content.toString());

      setTimeout(() => {
        console.log('[x] Done');
        channel.ack(msg);
      }, 1000 * seconds);
    }, { noAck: false });
  });
});

function getSecondsFromString(string) {
  return string.split('.').length - 1;
}