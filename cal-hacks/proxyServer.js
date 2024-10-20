const express = require('express');
const axios = require('axios');
const cors = require('cors');
const WebSocket = require("ws");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 5000;

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

function setupDeepgramWebsocket(text) {
    const ws = new WebSocket('wss://agent.deepgram.com/agent', {
        headers: { authorization: `token ${DEEPGRAM_API_KEY}` }
    });

    ws.binaryType = 'arraybuffer';

    return new Promise((resolve, reject) => {
        ws.on("open", function open() {
            console.log('Deepgram Voice Agent API: Connected');
            ws.send(JSON.stringify({
                type: "SettingsConfiguration",
                audio: {
                    input: {
                        encoding: "linear16",
                        sample_rate: 16000
                    },
                    output: {
                        encoding: "linear16",
                        sample_rate: 16000,
                        container: "none",
                    }
                },
                agent: {
                    listen: {
                        model: "nova-2"
                    },
                    think: {
                        provider: {
                            type: "open_ai"
                        },
                        model: "gpt-4o-mini",
                        instructions: "You are Nikola Tesla the famous inventor! You insist on telling people about all your amazing inventions. Ask people about what ideas they might have and once they tell you, downplay their ideas and start talking about one of your other better ideas."
                    },
                    speak: {
                        model: "aura-helios-en"
                    }
                }
            }));
        });

        ws.on("message", function message(data, isBinary) {
            resolve(data);
        });

        ws.on('close', function close() {
            console.log('Deepgram Voice Agent API: Disconnected from the WebSocket server');
        });

        ws.on('error', function error(error) {
            console.log("Deepgram Voice Agent API: error received");
            console.error(error);
            reject(error);
        });
    });
}

app.post('/transcribe', async (req, res) => {
    try {
        const { audioBuffer } = req.body;

        if (!audioBuffer) {
            return res.status(400).send('No audio buffer provided.');
        }

        const response = await axios.post('https://api.deepgram.com/v1/listen', audioBuffer, {
            headers: {
                'Authorization': `Token ${DEEPGRAM_API_KEY}`,
                'Content-Type': 'audio/wav',
            },
        });

        const transcribedText = response.data.results.channels[0].alternatives[0].transcript;

        const audioData = await setupDeepgramWebsocket(transcribedText);
        res.json({ audioData });
    } catch (error) {
        console.error('Error occurred:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal server error. Check the logs for more details.');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});