const renderApi = require('@api/render-api');

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const apiKey = 'rnd_bjNQ7Hz3he3zIx7Nq4QZtsWGeYay'; 
renderApi.auth('rnd_bjNQ7Hz3he3zIx7Nq4QZtsWGeYay');
renderApi.listServices({includePreviews: 'true', limit: '20'})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));
  
app.get('/services', async (req, res) => {
  try {
    const response = await axios.get('https://api.render.com/v1/services', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('שגיאה בעת בקשת השירותים:', error);
    res.status(500).json({ message: 'שגיאה בעת בקשת השירותים' });
  }
});

app.listen(port, () => {
console.log("the server is running..............")
});
