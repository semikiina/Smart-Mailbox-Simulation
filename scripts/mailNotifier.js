const axios = require('axios');

const apiUrl = 'https://localhost:1080';  // TODO: Change this to the correct API URL



// Send a request to the API
const sendMailNotification = async () => {
  try {
    const response = await axios.post(apiUrl, {
      weight: getRandomWeight(),
      date : new Date().toISOString()
    });
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

// Generate random weight between 70 and 350 grams
const getRandomWeight = () => {
  const min = 70;
  const max = 350;
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
