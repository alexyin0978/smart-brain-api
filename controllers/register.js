const handleRegister = (db,bcrypt) => (req,res) => {
    const {name,email,password} = req.body;  //destructure incoming user info
    if(!name || !email || !password){
        return res.status(400).json('Incorrect Form Submission')  //security check
    }
    const hash = bcrypt.hashSync(password);  //將password轉乘hash
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email  //id為serial,不用另外定義
        })
        .into('login') //將上面insert插入db-login
        .returning('email') //returning login裡的email給.then
        .then(loginEmail => {
            return trx('users')
            .insert({
                name: name,
                email: loginEmail[0].email, //將login內email與user內email綁定
                joined: new Date()
            })
            .returning('*') //回傳user得到的資料
            .then(user => {
                //重要!在register.js裡寫res.json(user)的user我們預設為object
                //而在這裡db回傳為1個array -> [userObj]
                //in order to get userObj, remember to do [0]
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
        //全部成功,執行trx.commit,才算結束
        //若中間有fail,則會跳到trx.rollback
    })
    .catch(err => res.status(400).json("Not Working"))
}

module.exports = {
    handleRegister
}