import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
dotenv.config()
 
const MongoClient = mongodb.MongoClient

const port = process.env.port || 5000

MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        poolsize: 50,
        wtimeout: 2500,
        useNewUrlParse: true
    }
).catch(err=>{
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})