const expressRateLimit = require('express-rate-limit')

const limitUsage = expressRateLimit({
    windowMs: 60 * 1000, // 1분 (ms)
    max: 1, // 분당 최대사용횟수 
    handler(req, res){
        res.status(429).json({
            code: 429,
            message: 'You can use this service 1 times per minute'
        })
    }
})

module.exports = {
    limitUsage
}