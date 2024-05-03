const mongoose = require('mongoose')

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