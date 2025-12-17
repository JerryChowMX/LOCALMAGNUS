const https = require('https');
require('dotenv').config();

const apiKey = process.env.GOOGLE_AI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        const response = JSON.parse(data);
        if (response.error) {
            console.error('API Error:', JSON.stringify(response.error, null, 2));
        } else {
            console.log('Available Models:');
            if (response.models) {
                response.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name}`);
                    }
                });
            } else {
                console.log('No models listing found in response:', data);
            }
        }
    });
}).on('error', (e) => {
    console.error('Request Error:', e);
});
