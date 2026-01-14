const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const axios = require('axios')
const app = express();

dotenv.config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const basePath = process.env.BASEPATH || '';

app.set('public', path.join(`${__dirname}`, 'public'));
app.set('assets', path.join(`${__dirname}`, 'public', 'assets'));
app.set('classes', path.join(`${__dirname}`, 'classes'));
app.set('system', path.join(`${__dirname}`, 'system'));

app.use(express.static(app.get('public')));
app.use(`/assets`, express.static(app.get('assets')));
app.use(`/classes`, express.static(app.get('classes')));
app.use(`/system`, express.static(app.get('system')));

// Route pour obtenir des données d'une chaîne Twitch
app.get(`${basePath}/stream/:username`, async (req, res) => {
    try{
        const username = req.params.username;
    
        // Obtenir le token d'accès
        const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
    
        const accessToken = tokenResponse.data.access_token;
    
        // Requête vers l'API Twitch pour obtenir des données de stream
        const streamResponse = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`,
            }
        });
    
        res.json(streamResponse.data); // Renvoyer les données au client
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Nouvelle route pour obtenir les followers d'une chaîne Twitch
app.get(`${basePath}/followers/:userId`, async (req, res) => {
    try{
        const userId = req.params.userId;

        // Obtenir le token d'accès
        const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        const accessToken = tokenResponse.data.access_token;

        // Requête vers l'API Twitch pour obtenir la liste des followers
        const followersResponse = await axios.get(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        res.json(followersResponse.data); // Renvoyer les données des followers au client
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.get(`${basePath}/`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
