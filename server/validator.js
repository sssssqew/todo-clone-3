const { body } = require('express-validator')

const isFieldEmpty = (field) => { // Form 필드가 비어있는지 검사 
    return body(field)
           .not()
           .isEmpty()
           .withMessage(`user ${field} is required`)
           .bail() // bail() 메서드 앞쪽 부분이 false 이면 더이상 뒷쪽의 데이터검증은 안함
           .trim() // 공백제거 
}

const validateUserName = () => {
    return isFieldEmpty("name")
           .isLength({ min: 2, max: 20 }) // 회원명 (2~20자)
           .withMessage("user name length must be between 2~20 characters")
}

const validateUserEmail = () => {
    return isFieldEmpty("email")
           .isEmail() // 이메일 형식에 맞는지 검사 
           .withMessage("user email is not valid")
}

const validateUserPassword = () => {
    return isFieldEmpty("password")
           .isLength({ min: 7 })
           .withMessage("password must be more than 7 characters")
           .bail()
           .isLength({ max: 15 }) 
           .withMessage("password must be lesser than 15 characters")
           .bail()
           .matches(/[A-Za-z]/)
           .withMessage('password must be at least 1 alphabet')
           .matches(/[0-9]/)
           .withMessage("password must be at least 1 number")
           .matches(/[!@#$%^&*]/)
           .withMessage("password must be at least 1 special character")
           .bail() // value: 요청본문에서 전달된 비밀번호 
           .custom((value, { req }) => req.body.confirmPassword === value) // filter 메서드처럼 동작
           .withMessage("Password don't match")
}

module.exports = {
    validateUserName,
    validateUserEmail,
    validateUserPassword
}