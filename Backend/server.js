const express = require('express');
const twilio = require('./Twilio');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require ('./utils/Jwt');
const { twiml } = require('twilio');
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
      origin: '*',
      methods: ['*'],
  },
});

io.use((socket, next) => {
  console.log('Socket middleware');
  if(socket.handshake.query && socket.handshake.query.token){
    const { token } = socket.handshake.query;
    try{
      const result = jwt.verifyToken(token);
      console.log('Token Accepted');
      if (result.username) return next();
    } catch(error){
      console.log(error);
    }
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const PORT = 3001;

app.get('/test',(req, res) => {
    res.send('Welcome to Twilio');
});

app.post('/check-token', (req, res) => {
  const {token} = req.body;
  let isValid = false;
  try{
    isValid = jwt.verifyToken(token);
  } catch(error){
    console.log(error);
  }
  res.send({ isValid });
});

app.post('/login', async (req, res) => {
    console.log('loging in');
    const {to, username, channel} = req.body;
    const data = await twilio.sendVerifyAsync(to, channel);
    res.send('Sent Code');
});

app.post('/verify', async(req, res) => {
    console.log('Verifing code');
    const { to, code, username } = req.body;
    const data = await twilio.verifyCodeAsync(to, code);
    if(data.status === 'approved'){
      const token = jwt.createJwt(username);
      return res.send({token})
    }
    res.status(401).send('Invalid token');
});

app.post('/call-new', (req, res) => {
  console.log('receive a new call');
  io.emit('call-new', {data: req.body});
  const response = twilio.voiceResponse('Gracias por llamar. Lo pondremos en espera, hasta que un agente esté disponible.');
  res.type('text/xml');
  res.send(response.toString());
});

app.post('/call-status-changed', (req, res) => {
  console.log('Call status changes');
  res.send('ok');
});

app.post('/enqueue', (req, res) => {
  const response = twilio.enqueueCall('Customer Service');
  console.log('Enqueuing Call');
  io.emit('enqueue', { data: req.body });
  res.type('text/xml');
  res.send(response.toString());
});

server.listen(PORT,() => {
    console.log(`Listening on PORT: ${PORT}`);
});