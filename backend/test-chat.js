const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

async function test() {
  try {
    const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET || 'studybuddy_secret_2024', { expiresIn: '1h' });

    // We can't easily send multipart/form-data with native fetch without boundary headers manually constructed or an external lib,
    // so let's just make it a JSON request to test the controller logic! 
    // Wait, the router expects upload.single('file'), which requires multipart/form-data.
    // Let's just create a quick Express route bypass to test the controller.
  } catch (error) {
    console.error(error);
  }
}
test();
