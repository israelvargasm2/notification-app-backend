const express = require('express');
const app = express();
const port = 8001;
app.use(express.json());

const PushNotificationsService = require('./src/services/push-notifications-service.js');

app.post('/notification/send', (req, res) => {
    const data = req.body;
    const title = data.title;
    const message = data.message;

    const pushNotificationsService = new PushNotificationsService(title, message);

    pushNotificationsService.sendNotification();

    res.json({title: title, message: message});
});

app.get('/notification/list', (req, res) => {
    res.send('Done');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});