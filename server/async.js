const asyncFunction = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ message: 'success' })
      }, 3000);
    })
  }

const wrap = (asyncFn, response) => {
    return (async (req, res, next) => {
        try{
          await asyncFn()
          return res.json(response)
        }catch(error){
            return next(error)
        }
    })
}
module.exports = {
    wrap,
    asyncFunction
}