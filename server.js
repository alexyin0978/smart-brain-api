const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profileGetId = require('./controllers/profileGetId.js')
const image = require('./controllers/image')

const app = express();

//連結到database
const db = knex({
    client: 'pg', //postgresql
    connection: {
      connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false
          }
      }
  })

//parse進來的json檔
app.use(express.json());
//解決frontend, backend不同源問題
//在frontend向不同源的api送出req時,會因為不同源(origin),而在frontend端收到res時被擋下來
//origin -> scheme(protocol) + host + port
//而我們的project裡,frontend與server差別在於port不同(3001front - 3000back),因此屬不同源
//為解決server.js與frontend不同源的問題,可以使用cors()這個middleware,讓Res Headers內顯示Access-Control-Allow-Origin: *
//意味著信任這個server送出的res
app.use(cors())


//root
app.get('/', (req,res) => {
    res.send('working good!')
})

//signin
app.post('/signin',signin.handleSignin(db,bcrypt))

//register
app.post('/register',register.handleRegister(db,bcrypt))

//profileGetId
app.get('/profile/:id',profileGetId.handleProfileGet(db))

//image
//若frontend向/image傳來put req,比對id,然後req entries++
app.put('/image',image.handleImage(db))

//imageUrl
//把clarifai放到這裡
//用在frontend送出url input的req到server時,回傳location info
//把api key資訊留在server,以免外流
app.post('/imageurl',image.handleImageUrl)

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port:${process.env.PORT}`)
})

