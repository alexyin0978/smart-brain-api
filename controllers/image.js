const Clarifai = require('clarifai')

const app = new Clarifai.App({
    apiKey: 'de735808e67442479cbaf53f4eb36f60'
    //載入Clarifai.App, api key是用來解鎖face detection這個外掛
  });

//faceRecoginition api
const handleImageUrl = (req,res) => {
    if(!req.body.input){
        return res.status(400).json("Wrong Url format")
    }
    app.models.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
    //Clarifai.FACE_DETECT_MODEL應該可換為'53e1df302c079b3db8a0a36033ed2d15'
    .then(resp => res.json(resp))
    .catch(err => res.status(400).json(""))
}

const handleImage = (db) => (req,res) => {
    const {id} = req.body;
    db('users')
    .where('id','=',id) //另一種寫法 -> .where({id: id}) or .where({id})
    .increment('entries',1)
    .returning('entries')
    .then(entryCount =>{
        res.json(entryCount[0].entries)
    }).catch(err => res.status(400).json("Not working!"))
}

module.exports = {
    handleImage,
    handleImageUrl
}