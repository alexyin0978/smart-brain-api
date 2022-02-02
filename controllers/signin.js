const handleSignin = (db,bcrypt) => (req,res)=>{
    const {email, password} = req.body; //destructure 登入的email與password
    if(!email || !password){
        res.status(400).json('Incorrect Submission')
    }
    db.select('email','hash').from('login') //在db-login撈出該user的email與hash以供與登入資料比對
      .where({'email': email}) //另一寫法 -> .where('email', '=', email)
      .then(data => {
          const isValid = bcrypt.compareSync(password, data[0].hash) //isValid is a boolean
          if(isValid){
              //with 'if', always add 'return' inside and an else-statement after it
              //若密碼比對正確,回傳該user資料到front-end
              return db.select('*').from('users')
                .where('email','=',email)
                .then(user=>{
                    //重要!在sign.js裡寫res.json(user)的user我們預設為object
                    //而在這裡db回傳為1個array -> [userObj]
                    //in order to get userObj, remember to do [0]
                    res.json(user[0])
                    console.log(user[0])
                })
                .catch(err => res.status(400).json("Unable to find user"))
          }else{
            res.status(400).json("Wrong credential")
          }
      })
      .catch(err => res.status(400).json("Wrong credential"))
}

module.exports = {
    handleSignin
}