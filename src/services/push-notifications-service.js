const webpush = require('web-push');
const SqlServerService = require('./sql-server-service.js');

class PushNotificationsService {

    constructor(title, message) {
        this.vapidKeys = {
            publicKey: "BOAZ6XA6efCcT6WVjH1E6AQWRNhtpxHWEqSX_fL460AQLaQkEDb4akdpapbr_yIGG3fVZLhk4DejYM-XPitIWko",
            privateKey: "x1F41mAFcOPflpgv-4QVf9uWYCqZgLH9KU_pHcunNiY"
        };
        this.options = {
            vapidDetails: {
                subject: 'mailto:example@yourdomain.org',
                publicKey: this.vapidKeys.publicKey,
                privateKey: this.vapidKeys.privateKey
            },
            TTL: 60
        };
        this.title = title;
        this.message = message;
        this.sql = new SqlServerService();
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

    sendNotification(groupIds) {
        let query = `SELECT * FROM Subscriptions s JOIN Users u ON s.UserId = u.Id JOIN Groups g ON u.GroupId = g.Id WHERE g.Id = ${groupIds[0]}`;
        if (groupIds.length > 1) {
            for (let i=1; i < groupIds.length; i++) {
                query += ` OR g.Id = ${groupIds[i]}`;
            }
        }

        console.log(query)

        this.sql.select(query).then(res => {
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