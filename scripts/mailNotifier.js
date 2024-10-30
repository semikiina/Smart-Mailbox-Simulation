const axios = require('axios');

const apiUrl = 'https://localhost:1080';  // TODO: Change this to the correct API URL

const mailNotification = {
  message: "A new mail has arrived in the mailbox!"
};

// Send a request to the API
const sendMailNotification = async () => {
  try {
    const response = await axios.post(apiUrl, mailNotification);
    console.log('Notification sent: ', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};

// Generate random time intervals between 1 and 5 minutes
const getRandomInterval = () => {
  const min = 1 * 60 * 1000; 
  const max = 5 * 60 * 1000; 
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Random notification process
const startRandomNotifications = () => {
  const interval = getRandomInterval();

  console.log(`Next mail notification will be sent in ${interval / 1000 / 60} minutes...`);

  setTimeout(async () => {
    await sendMailNotification();

    // Loop the process
    startRandomNotifications();
  }, interval);
};

// Start the process
startRandomNotifications();

// module.exports = {getRandomInterval};
