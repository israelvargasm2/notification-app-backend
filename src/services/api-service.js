const express = require('express');
const app = express();
const port = 8001;

app.use(express.json());


class ApiService {
    constructor() {
        this.run();
    }

    postPushNotification() {
        app.post('notification/send', (req, res) => {
            const data = req.body;
            const title = data.title;
            const message = data.message;

            res.json({title: title, message: message});
        })
    }

    run() {
        app.listen(port, () => {
            console.log(`Server is running on localhost:${port}`);
        })
    }
}