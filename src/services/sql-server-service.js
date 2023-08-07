const sql = require('mssql');

class SqlServerService {
    constructor() {
        this.config = {
            user: 'notificationapp',
            password: '123',
            server: 'DESKTOP-GSG8CCK',
            database: 'NotificationApp',
            options: {
                encrypt: false,
                trustServerCertificate: false
            }
        };
    }

    async select(query) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(query);
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    async insert(query) {
        try {
            await sql.connect(this.config);
            await sql.query(query);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = SqlServerService;