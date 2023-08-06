INSERT INTO Groups (Name) 
VALUES ('Assembly');

INSERT INTO Users (Name, GroupId) 
VALUES ('Israel Vargas', 1);

INSERT INTO Subscriptions (Endpoint, P256dh, Auth, RegisteredAt, UserId) 
VALUES ('https://fcm.googleapis.com/fcm/send/fXpCivlW3DU:APA91bGQpG9degNlFzkWz_hRHqS_ZGmVbkbfyo7xBDZCrE-kml06-WPNqoSxcc6GJK4YyuBLBLXHrZPW-UqBgsbOipMDt5SGs8v1ctiUV-m4BA3gayuOleLlpCPj_CCY381VDpbRfm7D', 
'BAc6kLlA8_1iNCXGYOuxQOl7v4Id6Yul9XrXawYHpVeNVw_5gDSvvk95tZaAnT6HkhpdAOT7JU3piL8jLIEH4os',
'04SwkKKmMk3sYB8jrj8IJg',
SYSDATETIMEOFFSET(),
1);