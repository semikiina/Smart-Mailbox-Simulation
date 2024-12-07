const { initializeMqtt } = require('../mqtt/mqttConnection');
const http = require('http');
const Mailbox = require('../models/Mailbox');


const client = initializeMqtt();

const MAILBOX_CAPACITY = 2000;

let currentWeight = 0;

const receivedMails = [];

let isMailboxFull = false;
let isResetting = false;

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString({
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};


const initializeMailController = () => {
  console.log('Mail Controller initialized and listening to MQTT messages');

  client.removeAllListeners('message');

  //subscribing
  client.subscribe('mailbox/weight', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to mailbox/weight topic');
    }
  });


  client.on('message', async (topic, message) => {
    if (isResetting) return;

    if (topic === 'mailbox/weight') {
      const payload = JSON.parse(message.toString());
      const { weight, timestamp } = payload;

      if (isMailboxFull) {
        console.log('Mailbox is full, ignoring new mail data.');
        return;
      }

      receivedMails.push({
        weight,
        timestamp: formatDate(timestamp),
      });

      currentWeight += weight;
      const mailCount = Math.floor(currentWeight / 20);

      console.log(`Received new mail at ${timestamp}:`);
      console.log(`  - Weight of current mail: ${weight} grams`);
      console.log(`  - Total number of letters: ${mailCount}`);
      console.log(`  - Total weight in mailbox: ${currentWeight} grams`);


      const mailEntry = new Mailbox({
        weight,
        timestamp: new Date(timestamp),
        totalWeight: currentWeight,
        mailCount,
      });

      mailEntry.save().then(() => {
        console.log('Mail entry saved to database.');
      }).catch((error) => {
        console.error('Error saving mail entry:', error);
      });

      if (currentWeight >= MAILBOX_CAPACITY) {
        console.log('Mailbox is now full!');
        isMailboxFull = true;

        client.publish('mailbox/full', JSON.stringify({
          message: 'Mailbox is full, please empty it',
          currentWeight,
          timestamp: new Date().toISOString(),
        }), { qos: 1 });
      }
    }
  });
};

const emptyMailbox = () => {
  if (isResetting) return;

  console.log('Emptying mailbox...');
  isResetting = true;

  currentWeight = 0;
  receivedMails.length = 0;
  isMailboxFull = false;


  client.publish('mailbox/cleared', JSON.stringify({
    message: 'Mailbox has been emptied',
    timestamp: new Date().toISOString(),
  }), { qos: 1 });

  setTimeout(() => {
    isResetting = false;
  }, 500);

  return {
    currentWeight,
    mailCount: 0,
    isFull: false,
    receivedMails,
  };
};

// HTTP-Server for mailbox data
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Expires', '0');
  res.setHeader('Pragma', 'no-cache');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/mailbox') {
    const mailCount = Math.floor(currentWeight / 20);
    const isFull = currentWeight >= MAILBOX_CAPACITY;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        currentWeight,
        mailCount,
        isFull,
        receivedMails,
      })
    );
  } else if (req.method === 'POST' && req.url === '/empty-mailbox') {
    const updatedMailboxData = emptyMailbox();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedMailboxData));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// start HTTP-Server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});


module.exports = { initializeMailController };
