const mongoose = require('mongoose')

const { Schema } = mongoose 
const { Types: { ObjectId }} = Schema
// ObjectId : MONGODB ID 값의 자료형 (data type)

const todoSchema = new Schema({ // 스키마 정의
    author: {
        type: ObjectId,
        required: true, 
        ref: 'User' // User 라는 데이터 모델 -> 조금 있다가 정의 (사용자 ID값 )
    },
    title: {
        type: String,
        required: true,
        trim: true // 문자열 양쪽 공백 제거 
    },
    description: {
        type: String,
        trim: true
    },
    isDone: {
        type: Boolean, 
        default: false // 브라우저에서 전송된 값이 없으면 자동 설정
    },
    createdAt: {
        type: Date, 
        default: Date.now // 현재시간 
    },
    lastModifiedAt: {
        type: Date, 
        default: Date.now 
    },
    finishedAt: {
        type: Date, 
        default: Date.now 
    }
    // 아주 복잡한 몽고 db 필드 더 추가되어야 됨 
})

// 스키마 -> 컴파일 (몽고 db 가 인식할 수 있는 데이터 구조로 변환) -> 모델 
const Todo = mongoose.model('Todo', todoSchema) // 컬렉션 이름 : Todo 에서 첫번째 글자를 소문자로 변경하고 맨 끝에 s 붙임 -> todos
module.exports = Todo

// todo 데이터 생성 테스트 
// const todo = new Todo({
//     author: '111111111111111111111111', // 몽고 db 의 고유 ID값 (24자리 문자열)
//     title: '주말에 공원 산책하기',
//     description: '주말에 집 주변 공원에 가서 1시간동안 산책하기'
// })
// todo.save().then(() => console.log("할일 생성 성공!")) // 실제 데이터베이스에 저장

