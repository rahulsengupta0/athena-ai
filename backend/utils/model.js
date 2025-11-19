// Use the actual API details for o1-mini-2024-09-12
const axios = require('axios');
async function callModel(prompt) {
    const response = await axios.post('MODEL_ENDPOINT_URL', {
        prompt,
        // add auth, version etc.
    });
    return response.data.result; // Format depends on the model
}
module.exports = { callModel };
