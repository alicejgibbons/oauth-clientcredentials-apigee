const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const port = 3000;
const resourceURL = "https://34.120.61.27.nip.io/v1/samples/oauth-client-credentials/resource";

// Echo the auth headers passed in
app.get('/echo', (req, res) => {
    var text = req.query.text;    
    console.log("Echoing: " + text);
    res.send("Access token: " + req.headers["authorization"] + " Text: " + text); 
});

// Route to fetch data from the resource server
app.get('/fetch-resource', async (req, res) => {
    try {
        console.log("Accessing resource from server at: " + resourceURL);
        const token = req.headers["authorization"];
        const response = await axios.get(resourceURL, {
            headers: {
                Authorization: token, // Include the Bearer token
            },
        });

        console.log("Retrieved response successfully: " + response.data.message);

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching resource:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch resource' });
    }
});

app.listen(port, () => console.log(`Node App listening on port ${port}!`));