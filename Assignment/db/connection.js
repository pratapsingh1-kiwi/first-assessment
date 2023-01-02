const connection = () => {

    const mongoose = require('mongoose')
    mongoose.set('strictQuery', true)
    mongoose.connect('mongodb+srv://quest100:quest100@cluster0.uopgqay.mongodb.net/test',{useNewUrlParser: true},(err,client) => {
    if(err){
        return console.log("Unable to connect the database", err);
    }
    else
    {

        console.log("Connect correctly");
    }
    
})
}
module.exports.con = connection;