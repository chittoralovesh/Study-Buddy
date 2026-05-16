const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function test() {
  try {
    const formData = new FormData();
    formData.append('type', 'plan');
    formData.append('text', 'Provide a general study plan for computer science.');
    formData.append('purpose', 'Ace final exams');
    formData.append('subject', 'Computer Science');
    formData.append('duration', '7');

    const res = await axios.post('http://localhost:5000/api/ai/process', formData, {
      headers: formData.getHeaders() // Mock no token since we can bypass auth for a quick test if we comment out protect, wait, no, I need a token!
    });
    console.log(res.data);
  } catch (error) {
    console.error("HTTP ERROR:", error.response ? error.response.data : error.message);
  }
}
test();
