const config = require('./config')
const jwt = require('jsonwebtoken')

const generateToken = (user) => { // 토큰생성하는 유틸리티 함수
    return jwt.sign({
        _id: user._id, 
        name: user.email,
        userId: user.userId, 
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
    },
    config.JWT_SECRET, // 비밀키
    {
        expiresIn: '1d',
        issuer: 'sunrise'
    }
    )
}
const isAuth = (req, res, next) => { // 사용자 권한 검증하는 미들웨어 
    const bearerToken = req.headers.authorization // 요청헤더의 Authorization 속성
    if(!bearerToken){
        return res.status(401).json({ message: 'Token is not supplied' }) 
    }else{
        const token = bearerToken.slice(7, bearerToken.length) // Bearer 글자 제거하고 토큰만 추출
        jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
            if(err && err.name === 'TokenExpiredError'){
                return res.status(419).json({ code: 419, message: 'token expired!' })
            }else if(err){
                return res.status(401).json({ code: 401, message: 'Invalid Token' }) // 토큰이 위변조가 되어서 복호화를 할수 없는 경우
            }
            req.user = userInfo
            next() // 권한이 있는 사용자의 서비스 허용 
        })
    }
}
const isAdmin = (req, res, next) => { // 관리자 여부 검증하는 미들웨어 
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401).json({ code: 401, message: 'You are not valid admin user!'})
    }
}
const isFieldValid = (req, res, next) => {
    if(req.params.field === 'category' || req.params.field === 'isDone'){
        next()
    }else{
        res.status(400).json()
    }
}
module.exports = {
    generateToken,
    isAuth,
    isAdmin
}