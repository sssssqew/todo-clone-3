const express = require('express')
const Todo = require('../models/Todo')
const expressAsyncHandler = require('express-async-handler')
const { isAuth, isAdmin } = require('../../auth')
const mongoose = require('mongoose')
const { Types: { ObjectId }} = mongoose 

const router = express.Router()

router.get('/', isAuth, expressAsyncHandler(async (req, res, next) => { // /api/todos/
    const todos = await Todo.find({ author: req.user._id }).populate('author', ['name', 'userId'])
    if(todos.length === 0){
        res.status(404).json({ code: 404, message: 'Failed to find todos!'})
    }else{
        res.json({ code: 200, todos })
    }
}))
router.get('/:id', isAuth, expressAsyncHandler(async (req, res, next) => { // /api/todos/{id}
    const todo = await Todo.findOne({
        author: req.user._id, 
        _id: req.params.id // TODO ID 
    })
    if(!todo){
        res.status(404).json({ code: 404, message: 'Todo Not Found' })
    }else{
        res.json({ code: 200, todo })
    }
}))
router.post('/', isAuth, expressAsyncHandler(async (req, res, next) => {
    // 중복체크 - 로그인한 사용자 기준으로 할일목록에서 할일제목이 중복이 되면 저장 x
    const searchedTodo = await Todo.findOne({
        author: req.user._id, // isAuth 에서 전달된 값 
        title: req.body.title 
    })
    if(searchedTodo){
        res.json({ code: 204, message: "Todo you want to create already exists in DB !"})
    }else{
        const todo = new Todo({
            author: req.user._id, // 로그인한 사용자의 ID값 
            title: req.body.title,
            description: req.body.description, 
            category: req.body.category,
            imgUrl: req.body.imgUrl
        })
        const newTodo = await todo.save() // 새로운 할일 DB 생성
        if(!newTodo){
            res.status(401).json({ code: 401, message: 'Failed to save todo !'})
        }else{
            res.status(201).json({
                code: 201,
                message: 'New Todo Created',
                newTodo // 새로운 할일을 팝업창을 띄워서 사용자에게 안내하는 용도
            }) // 201 : created (생성)
        }
    }
}))
router.put("/:id", isAuth, expressAsyncHandler(async (req, res, next) => {
    const todo = await Todo.findOne({
        author: req.user._id, 
        _id: req.params.id
    })
    if(!todo){
        res.status(404).json({ code: 404, message: 'Todo Not Found' })
    }else{
        todo.title = req.body.title || todo.title 
        todo.description = req.body.description || todo.description 
        todo.isDone = req.body.isDone || todo.isDone 
        todo.category = req.body.category || todo.category
        todo.imgUrl = req.body.imgUrl || todo.imgUrl 
        todo.lastModifiedAt = new Date() // 수정시각 업데이트 
        todo.finishedAt = todo.isDone ? todo.lastModifiedAt : todo.finishedAt

        const updatedTodo = await todo.save() // 실제 TODO를 DB 에 업데이트
        res.json({
            code: 200,
            message: 'TODO Updated',
            updatedTodo
        })
    }
}))
router.delete("/:id", isAuth, expressAsyncHandler(async (req, res, next) => {
    const todo = await Todo.findOne({
        author: req.user._id, 
        _id: req.params.id 
    })
    if(!todo){
        res.status(404).json({ code: 404, message: 'Todo Not Foud' })
    }else{
        await Todo.deleteOne({
            author: req.user._id, 
            _id: req.params.id 
        })
        res.status(204).json({ code: 204, message: 'TODO deleted successfully!' })
    }
}))

router.get('/group/:field', isAuth, isAdmin, expressAsyncHandler(async (req, res, next) => {
   
    if(req.params.field === 'category' || req.params.field === 'isDone'){
        const docs = await Todo.aggregate([
            {
                $group: {
                    _id: `$${req.params.field}`,
                    count: { $sum: 1 }
                }
            },
            { $sort : { _id : 1} }
        ])
        console.log(`Number Of Group: , ${docs.length}`) // 그룹 갯수 
        // docs.sort((d1, d2) => d1._id - d2._id) // _id 기준으로 정렬
        res.json({ code: 200, docs })
    }else{
        res.status(400).json({ code: 400, message: 'you gave wrong field to group documents !'})
    }
}))
router.get('/group/mine/:field', isAuth, expressAsyncHandler(async (req, res, next) => { // 사용자 대쉬보드
    if(req.params.field === 'category' || req.params.field === 'isDone'){
        const docs = await Todo.aggregate([
            {
                $match: { author: new ObjectId(req.user._id) } // 내가 작성한 할일목록 필터링
            },
            {
                $group: {
                    _id: `$${req.params.field}`,
                    count: { $sum: 1 }
                }
            },
            { $sort : { _id : 1} }
        ])
        console.log(`Number Of Group: , ${docs.length}`) // 그룹 갯수 
        // docs.sort((d1, d2) => d1._id - d2._id) // _id 기준으로 정렬
        res.json({ code: 200, docs })
    }else{
        res.status(400).json({ code: 400, message: 'you gave wrong field to group documents !'})
    }
}))
router.get('/group/date/:field', isAuth, isAdmin, expressAsyncHandler(async (req, res, next) => {
   
    if(req.params.field === 'createdAt' || 
        req.params.field === 'lastModifiedAt' ||
        req.params.field === 'finishedAt'){
        const docs = await Todo.aggregate([
            {
                $group: {
                    _id: { year: { $year: `$${req.params.field}`}, month: { $month: `$${req.params.field}` }},
                    count: { $sum: 1 }
                }
            },
            { $sort : { _id : 1} }
        ])
        console.log(`Number Of Group: ${docs.length}`) // 그룹 갯수
        // docs.sort((d1, d2) => d1._id - d2._id)
        res.json({ code: 200, docs})
        }else{
        res.status(400).json({ code: 400, message: 'you gave wrong field to group documents !' })
        }
    
}))
router.get('/group/mine/date/:field', isAuth, expressAsyncHandler(async (req, res, next) => {
    if(req.params.field === 'createdAt' || 
           req.params.field === 'lastModifiedAt' ||
           req.params.field === 'finishedAt'){
            const docs = await Todo.aggregate([
                {
                    $match: { author: new ObjectId(req.user._id) }
                },
                {
                    $group: {
                        _id: { year: { $year: `$${req.params.field}`}, month: { $month: `$${req.params.field}` }},
                        count: { $sum: 1 }
                    }
                },
                { $sort : { _id : 1} }
            ])
            console.log(`Number Of Group: ${docs.length}`) // 그룹 갯수
            // docs.sort((d1, d2) => d1._id - d2._id)
            res.json({ code: 200, docs})
           }else{
            res.status(400).json({ code: 400, message: 'you gave wrong field to group documents !' })
           }
}))

module.exports = router 