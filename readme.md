#### Overview
Notificania is a tool which allows you to communicate with your clients or customers by sending almost any kind of message like normal email, firebase push notification, etc.

###### Note: The tool is in currently early stage of development where you can find some issues we are working to fix those timely.

#### Supported messages:
1. Emails 📧
2. Firebase Push Notifications 🔔  (In Development)
3. Apple Push Notification 🔔 (In Next Release)
4. SMS 💬 

we will add support for further message categories in future releases.

#### Tool Requirements:
1. Any Relational Database (Tested for MySQL v8.0.31).
2. Redis cache (Tested for v7.4.1).
3. Message Broker (Tested for Apache Kafka v3.4.0).
4. Nodejs Environment installed on machine (Tool tested for v16.18.0).

#### Tool Supportable stack:

###### Databases Supported

| Database | Status |
| -------- | ------ |
| MySQL | Tested ✅ |
| Postgres | Not Tested Yet ❌ |
| MariaDB | Not Tested Yet ❌ |
| Microsoft SQL Server | Not Tested Yet ❌ |
| SQLite | Not Tested Yet ❌ |

###### Caches Supported

| CacheName | Status |
| --------- | ------ |
| Redis | Tested ✅ |

###### Message Broker Supported

| BrokerName | Status |
| --------- | ------ |
| Apache Kafka | Tested ✅ |
| AWS SQS | In future release 🎁 |

###### Dataware Housing Tools Supported

| ToolName | Status |
| --------- | ------ |
| Apache Cassandra | Tested ✅ |

#### How to use the tool:
1. Clone the repository on your system.
2. Go to the project in system
3. You should have nodejs installed on the machine (Tested for v16.18.0).
4. run command `npm i`.
5. rename the file `sample-config.json` to `config.json` by making the changes for the credentials and other related stuffs in the same file.
6. Whatever database you use you must have a schema (or database) name `notificania` before using the application.
7. Message Broker like Apache Kafka, Caches like Redis should be running before using the application.
8. After complete setup run below command to start the server. `npm start`


#### Performance

Jmeter Load testing of Send Mail feature for
12000 requests at 506.2 req/sec
![Load testing for send mail]([https://raw.githubusercontent.com/your-username/your-repo/main/path-to-image.png](https://github.com/themockingjester/notificania/blob/master/src/resources/otherAssets/send_mail_load_test.png))

