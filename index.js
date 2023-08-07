const express = require('express');
const app = express();
const port = 8001;
app.use(express.json());

const PushNotificationsService = require('./src/services/push-notifications-service.js');
const SqlServerService = require('./src/services/sql-server-service.js');
const sql = new SqlServerService();

app.post('/notification/send', (req, res) => {
    const data = req.body;
    const title = data.title;
    const message = data.message;
    const groupIds = data.groupIds;

    const pushNotificationsService = new PushNotificationsService(title, message);

    pushNotificationsService.sendNotification(groupIds);

    sql.insert(`INSERT INTO Notifications (Title, Message, Ts, GroupId) VALUES ('${title}', '${message}', SYSDATETIMEOFFSET(), 1)`);

    res.json({ title: title, message: message, groupIds: groupIds, test: data.test });
});

app.get('/notification/list', (req, res) => {
    res.send('Done');
});

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});