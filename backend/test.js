const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/ai/process', {
      type: 'summary',
      text: 'This is a test'
    }, {
      headers: {
        'Content-Type': 'application/json'
        // Missing token will cause 401, but auth middleware checks for token.
      }
    });
    console.log(res.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

test();
