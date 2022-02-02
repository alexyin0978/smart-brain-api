const handleProfileGet = (db) => (req,res) => {
    const {id} = req.params;
    db.select('*').from('users')
    .where({id: id}) //篩選id,也可destructure成.where({id})
    .then(user => {
        res.json(user[0])
    })
    .catch(err => res.status(400).json('Not found'))
}

module.exports = {
    handleProfileGet
}