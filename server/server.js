const mongoose = require("mongoose")
const Document = require("./Document")

mongoose.connect('mongodb://localhost/gdocs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

mongoose.connection.once('open',()=>{
    console.log("connected to DB")
  })

const io= require('socket.io')(3001,{
    cors:{
        origin:"http://localhost:3000",
        methods:["Get","POST"]
    }
})

io.on("connection",socket => {

    socket.on("get-document",async documentid => {
        const doc = await findDocument(documentid)

        socket.join(documentid)
        socket.emit("load-document",doc.data)
        
        socket.on("send-changes",delta =>{
            socket.broadcast.to(documentid).emit("receive-changes",delta)
        })

        socket.on("save-document", async data =>{
            await Document.findByIdAndUpdate(documentid, {data})
        })
    })
})

const findDocument = async id =>{
    if(id==null)return
    const doc= await Document.findById(id)
    if(doc){
        return doc
    }
    return await Document.create({_id:id, data: ""})
}