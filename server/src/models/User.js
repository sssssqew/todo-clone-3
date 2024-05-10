const mongoose = require('mongoose')
const moment = require('moment')

const { Schema } = mongoose 

const userSchema = new Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String, 
        required: true, 
        unique: true, // unique: 색인(primary key) email 중복불가 
    },
    userId: {
        type: String,
        required: true 
    },
    password: {
        type: String, 
        required: true
    },
    isAdmin: {
        type: Boolean, 
        default: false 
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    },
    lastModifiedAt: {
        type: Date, 
        default: Date.now 
    }
})
// .co.kr .gov .com 
userSchema.path('email').validate(function(value){
    return /^[a-zA-z0-9]+@{1}[a-z]+(\.[a-z]{2})?(\.[a-z]{2,3})$/.test(value)
}, 'email `{VALUE}`는 잘못된 이메일 형식입니다.')

// 숫자, 특수문자 최소 1개 포함하기 (7~15자)
userSchema.path('password').validate(function(value){
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}/.test(value)
}, 'password `{VALUE} 는 잘못된 비밀번호 형식입니다.`')

userSchema.virtual('status').get(function(){
    return this.isAdmin ? "관리자" : "사용자"
})

userSchema.virtual('createdAgo').get(function(){
    return moment(this.createdAt).fromNow()
})

userSchema.virtual('lastModifiedAgo').get(function(){
    return moment(this.lastModifiedAt).fromNow() 
})

const User = mongoose.model('User', userSchema)
module.exports = User

// user 데이터 생성 테스트
// const user = new User({
//     name: '태양',
//     email: 'sun@gmail.com',
//     userIdn: 'sunrise',
//     password: '1234567890',
//     isAdmin: true 
// })
// user.save().then(() => console.log('회원가입 성공!'))