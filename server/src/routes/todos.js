const express = require('express')
const Todo = require('../models/Todo')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const router = express.Router()

router.get('/', (req, res, next) => { // /api/todos/
    res.json("전체 할일목록 조회")
})
router.get('/:id', (req, res, next) => { // /api/todos/{id}
    res.json("특정 할일 조회")
})
router.post('/', (req, res, next) => {
    res.json("새로운 할일 생성")
})
router.put("/:id", (req, res, next) => {
    res.json("특정 할일 변경")
})
router.delete("/:id", (req, res, next) => {
    res.json("특정 할일 삭제")
})
module.exports = router 