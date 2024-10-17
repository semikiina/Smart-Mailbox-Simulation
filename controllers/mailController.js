const Mail = require('../models/Mail');

exports.getAllMail = async (req, res) => {

    const userId = req.user.id; // Get the user ID from the request object

  try {
    const mails = await Mail.findAll();
    res.render('mails', { mails });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
