const express = require('express')
const User = require('../models/User') // 데이터 CRUD 용도
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')

const router = express.Router() // 라우터 모듈

router.post('/register', expressAsyncHandler(async (req, res, next) => { // /api/users/register
    console.log(req.body)
    const user = new User({
        name: req.body.name, 
        email: req.body.email, 
        userId: req.body.userId, 
        password: req.body.password
    })
    const newUser = await user.save() // 사용자정보 DB 저장 
    if(!newUser){
        res.status(400).json({ code: 400, message: 'Invalid User Data'})
    }else{
        const {name, email, userId, isAdmin, createdAt } = newUser
        res.json({
            code: 200,
            token: generateToken(newUser), // 사용자 식별 + 권한검사를 위한 용도 
            name, email, userId, isAdmin, createdAt // 사용자에게 보여주기 위한 용도
        })
    }
}))
router.post('/login', expressAsyncHandler(async (req, res, next) => { // /api/users/login
    console.log(req.body)
    const loginUser = await User.findOne({
        email: req.body.email, 
        password: req.body.password 
    })
    if(!loginUser){
        res.status(401).json({ code: 401, message: 'Invalid Email or Invalid Password '})
    }else{
        const { name, email, userId, isAdmin, createdAt } = loginUser 
        res.json({
            code: 200, 
            token: generateToken(loginUser),
            name, email, userId, isAdmin, createdAt
        })
    }
}))
router.post('/logout', (req, res, next) => {
    res.json("로그아웃")
})
router.put('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id) // 회원인지 검사
    if(!user){
        res.status(404).json({ code: 404, message: 'User Not Founded '})
    }else{
        user.name = req.body.name || user.name 
        user.email = req.body.email || user.email 
        user.password = req.body.password || user.password 
        const updatedUser = await user.save() // 실제 사용자정보 수정을 DB 에 반영
        const { name, email, userId, isAdmin, createdAt } = updatedUser 
        res.json({
            code: 200,
            token: generateToken(updatedUser), 
            name, email, userId, isAdmin, createdAt
        })
    }
}))
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if(!user){
        res.status(404).json({ code: 404, message: 'User Not Found' })
    }else{
        res.status(200).json({ code: 204, message: 'User deleted successfully!'})
    }
}))
module.exports = router 