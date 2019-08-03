const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
let globalCounter = 1;

app.use(bodyParser.json());

app.listen(port, () => console.log('Listening on :' + port));

const checkMsgLimitMiddleware = (req, res, next) => {
  if (globalCounter <= 5) {
    globalCounter += 1;
    console.log('Logging the text property of the body: ', req.body.text);
    res.json({ 'message': 'Message received loud and clear' });
  } else {
    res.status(429).end();
  }
};

app.post('/messages', (req, res, next) => {
  if (req.body.text === '' || req.body.hasOwnProperty('text') === false) {
    res.status(400).end();
  } else {
    checkMsgLimitMiddleware(req, res, next);
  }
});
