const express = require('express');
const twilio = require('./Twilio');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require ('./utils/Jwt');
const app = express();
const server = http.createServer(app);
//const io = socketIo(server); //agregado para solucion cap 18
const io = socketIo(server, {
  cors: {
      origin: '*',
      methods: ['*'],
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
  });
});

app.use(bodyParser.json());
app.use(cors());

const PORT = 3001;

app.get('/test',(req, res) => {
    res.send('Welcome to Twilio');
});

//Seccion 3 clase 6
//Crear endpoint para recibir mobile number y verification code

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

//Seccion 3 clase 6
//console.log(process.env.MOBILE);

server.listen(PORT,() => {
    console.log(`Listening on PORT: ${PORT}`);
    
});