const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const axios = require('axios')
const usersRouter = require('./src/routes/users')
const todosRouter = require('./src/routes/todos')
const config = require('./config')
const {asyncFunction, wrap} = require('./async')

// fs and https 모듈 가져오기
const https = require("https");
const fs = require("fs");

// certificate와 private key 가져오기
// ------------------- STEP 2
// const options = {
//   key: fs.readFileSync("./config/cert.key"),
//   cert: fs.readFileSync("./config/cert.crt"),
// };


const corsOptions = {
    origin: '*', // 해당 URL 주소만 요청을 허락함 
    credentials: true // 사용자 인증이 필요한 리소스를 요청할 수 있도록 허용함
}


mongoose.connect('mongodb://127.0.0.1:27017/sunrise') // 프로미스 
.then(() => console.log("데이터베이스 연결 성공!"))
.catch(e => console.log(`데이터베이스 연결 실패 !!!: ${e}`))

/******************** 공통 미들웨어 **********************************/
app.use(cors(corsOptions)) // cors 설정 미들웨어 
app.use(express.json()) // 요청본문 (request body) 파싱(해석)을 위한 미들웨어
app.use(logger('tiny')) // 로거설정
/* ****************************************************************** */

/* ******************** REST API 미들웨어 *****************************/
app.use('/api/users', usersRouter) // User 라우터
app.use('/api/todos', todosRouter) // Todo 라우터
/* ****************************************************************** */

app.get('/children', async (req, res) => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
    const open_url = 'https://e-childschoolinfo.moe.go.kr/api/notice/basicInfo2.do?key=ff96b6a8a0a04839b3a6e5974cecd3d7&sidoCode=27&sggCode=27140'
    const result = await fetch(open_url)
    const data = await result.json()
    // console.log(data)
    res.json({msg: '연결성공', data})
})

app.get('/hello', (req, res) => {
    res.json('서버에서 보낸 응답!!!')
})
app.post('/hello', (req, res) => {
    console.log(req.body)
    res.json({ userId: req.body.userId, email: req.body.email })
})
app.get('/error', (req, res) => {
    throw new Error('서버에 치명적인 에러가 발생하였습니다.')
})
app.get('/fetch', async (req, res) => {
    // OPEN API 데이터 요청 
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
    console.log(response)
    res.send({todos: response.data})
})

app.get('/async-function', wrap(asyncFunction))

// 폴백 핸들러 (fallback handler)
app.use((req, res, next) => {
    res.status(404).send("페이지를 찾을수 없습니다!")
})
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send("서버에러 발생!")
})

app.listen(5000, () => {
    console.log('server is running on port 5000...')
})
// https 의존성으로 certificate와 private key로 새로운 서버를 시작
// https.createServer(options, app).listen(443, () => {
//     console.log(`HTTPS server started on port 5001`);
//   });