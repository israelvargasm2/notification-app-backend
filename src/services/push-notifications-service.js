const webpush = require('web-push');
const SqlServerService = require('./sql-server-service.js');

class PushNotificationsService {
    vapidKeys = {
        "publicKey": "BOAZ6XA6efCcT6WVjH1E6AQWRNhtpxHWEqSX_fL460AQLaQkEDb4akdpapbr_yIGG3fVZLhk4DejYM-XPitIWko",
        "privateKey": "x1F41mAFcOPflpgv-4QVf9uWYCqZgLH9KU_pHcunNiY"
    };

    options = {
        vapidDetails: {
            subject: 'mailto:example@yourdomain.org',
            publicKey: this.vapidKeys.publicKey,
            privateKey: this.vapidKeys.privateKey
        },
        TTL: 60
    };

    constructor(title, message) {
        this.title = title;
        this.message = message;
    }

    getSubscriptions() {
        const subscriptions = [
            {
                endpoint: 'https://fcm.googleapis.com/fcm/send/fXpCivlW3DU:APA91bGQpG9degNlFzkWz_hRHqS_ZGmVbkbfyo7xBDZCrE-kml06-WPNqoSxcc6GJK4YyuBLBLXHrZPW-UqBgsbOipMDt5SGs8v1ctiUV-m4BA3gayuOleLlpCPj_CCY381VDpbRfm7D',
                expirationTime: null,
                keys: {
                    p256dh: 'BAc6kLlA8_1iNCXGYOuxQOl7v4Id6Yul9XrXawYHpVeNVw_5gDSvvk95tZaAnT6HkhpdAOT7JU3piL8jLIEH4os',
                    auth: '04SwkKKmMk3sYB8jrj8IJg'
                    
                }
            }
        ];
        return subscriptions;
    }

    buildNotificationPayload() {
        const payload = {
            notification: {
                title: this.title,
                body: this.message,
                icon: 'assets/icons/icon-384x384.png',
                actions: [
                    { action: 'bar', title: 'Focus last' },
                    { action: 'baz', title: 'Navigate last' },
                ],
                data: {
                    onActionClick: {
                        default: { operation: 'openWindow' },
                        bar: {
                            operation: 'focusLastFocusedOrOpen',
                            url: '/signin',
                        },
                        baz: {
                            operation: 'navigateLastFocusedOrOpen',
                            url: '/signin',
                        },
                    },
                },
            },
        };
        return payload;
    }

    sendNotification() {
        const sql = new SqlServerService();
        sql.select('SELECT * FROM Subscriptions').then(res => {
            const results = res.recordset.map(res => [
                {
                    endpoint: res.Endpoint,
                    expirationTime: res.ExpirationTime,
                    keys: {
                        p256dh: res.P256dh,
                        auth: res.Auth
                    }
                }
            ]);
            
            let subscriptions = [];

            for (let result of results) {
                subscriptions.push(result[0]);
            }

            Promise.all(subscriptions.map(sub => webpush.sendNotification(
                sub, JSON.stringify(this.buildNotificationPayload()), this.options)))
                .then((_) => {
                    console.log('SENT!');
                    console.log(_);
                })
                .catch(err => {
                    console.error("Error sending notification, reason: ", err);
                });
        });
    }
    generateVAPIDKeys() {
        console.log(webpush.generateVAPIDKeys());
    }
}





module.exports = PushNotificationsService;