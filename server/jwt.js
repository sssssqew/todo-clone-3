const jwt = require('jsonwebtoken')

// HS256 암호화 알고리즘 -> 대칭키 알고리즘
const token = jwt.sign({ email: "test@gmail.com" }, "비밀키", { expiresIn: '1d' })
console.log(token) // jwt 토큰 혹은 시그니쳐(signiture) -> base64 형식의 문자열

// 사용자 식별(권한검사) + 사용자정보 위변조 여부 검사 + 로그인여부 판별
const decodedResult = jwt.verify('aaa'+token, '비밀키')
console.log(decodedResult)


