
var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({origin: true});



//var serviceAccount = require("./pwagram-fb-key.json");

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "todolist-f7963",
    "private_key_id": "c1369d166cf3877100436db45dfc4b25924c8f08",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDN3dBlV5IJocGe\nFs8CaqiBizeYqsCB0Thb2n0wgsXVpi4NnHcOHoZ38V3HiOisARKhxWTe9/tRKGWR\nEZ/tPKmWBrlX365cUhsyR1fuldL+12clvROds2fsL4bioefEhajmeSzRARxqShCv\nsbS/+G2JWWdi1wwY00mwTKJ+lkFDNoh0U/l8bbqIuLEe3rqxdzzU2l5tyz5nu/eO\nHcBcoQPGzGKycti3LK34dHjCzIQxzUzZUduuiDNvWtJrd+8zm10Z9jYL/qRaUSRh\npOvYWB3s0D+hfJwA3PTTE5v1qDJB5jqxZaaRsGWAb17wc9IcEDm1vf3d4omSrf1u\nBTIMQ0xTAgMBAAECggEAMPjBKDpqrQvjqR235NVGfHqHoTONU9RXWdJh0XZqZWaA\nshA0ahFs3391VZAF+VTP/9ebJUdMa4P2lUniB2dU2DGFSZgWPDPz8EP0cPcHGERZ\nbyrJTcxtvkuYBLWLEr7Q7PKKbLWc8tPnoEPfwYLxW6j+5Q5O/GDWuK+iQAayQ7B5\ncpjFQ7EuvKOE5Ov/aatf1WQNGiDnd6KKYV89jvhLLa5vzAfy9YLcBcNgdK+N0Ooy\nlfVUjYuKWyjNuFG5sScs5kF/4nlD8M/Gqah3LkmSfGCkzwyLqM22qEINOGoofg9n\nLL7SqkEwPjEzRO339/eHVMZ+2UgRWC1AsVf1UMQ/0QKBgQD/TvARttUfSuIyCPE5\nmLxVdOjswwRZweVof7YBDA7Vbl9nwA+bnWbkNwV7IIxPhBHFTUTpow0nLwj+h+VN\ncmkdfbNmncec4Jt5bHbbVf5DjPU0tZeGOB4ksPxdW6v6ZPOCutacHvEkLQk/5F6D\nxt3Slm+PZu6COFePRNz9vnuxlQKBgQDObJZRxt6eGglPXBAMUUU1MlxmoR8UUyz/\nYDhGpr/tSWP9gDOijqA5mo8bMK88IEA3tOgnj+3dFEr7cdGWxWspfAlvCn00bywR\n/bNBj+b15YCT185yFGPI+WNyDnwFzxc32II+Bk6AfYLNAcAqeIrsICnA7vlfImYM\ncoOwqbXcRwKBgGWuFZSogWbOFxogT5pFxzQttJqe7Lumqmwc+Oqf18SPCbYzWsP6\nQ0E+3JL2GouMqNswc/Ks+o8Rf36Htv5KQ6z4JBwJWLeVCLaqSQf/zp0upXXRoMBW\n10J7rnasDOlTjVwSd2iENjvXJ+jnVfEbobq+KT4um20HbW/k2DLCy1alAoGAc8v+\nV0mUQGSirF4csow0oq7pnrjr0l8GcwvrBdcs+1OcP+zXCm2v/CBz/vDEnJoK7DUT\ntn3LFaX4mi0zQbzlbJQkRqI/slZbBoynLjQnf/GKu2Tobp55i5g67RSrBicyAyX1\nig3Ho9TEt3Qv9KNCa0tvoMduJKwLSxhCP6w0VKkCgYA8EmEiv09m1cRkFQkLu5Zt\ndpeoS4HawHKSEaQ3VJf4DDFCFy3gEJSvJlIfeLSmOplrUX4m0PoFtXRiSPe/wLxh\n+kwDk0oDcwk6POxg+lzqvvc9lq9rGVtMkdt3gz2WOdOtBxiRUt3Ra8sxBlypzW4g\nraOvQZvSxdQT18iMrwo7rQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-reyb0@todolist-f7963.iam.gserviceaccount.com",
    "client_id": "114178636126840420094",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-reyb0%40todolist-f7963.iam.gserviceaccount.com"
  }),
  databaseURL: 'https://todolist-f7963.firebaseio.com/'
});

exports.addTodo = functions.https.onRequest(function(request, response) {
 cors(request, response, function() {
   admin.database().ref('todoList').push({
     id: request.body.id,
     task: request.body.task
   })
     .then(function() {
       response.status(200).json({message: 'Data stored', id: request.body.id});
     })
     .catch(function(err) {
       response.status(500).json({error: err});
     });
 });
});
