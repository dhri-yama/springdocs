import React, {useCallback, useEffect, useState} from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import {io} from "socket.io-client"
import { useParams } from 'react-router'

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]

const Texteditor = () => {
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()
    const {id: documentid} = useParams()
    
    useEffect(() => {
        const s = io("http://localhost:3001")
        setSocket(s)
        return ()=>{
            s.disconnect()
        }
    }, [])

    // save the doc
    useEffect(() => {
        if(socket==null || quill ==null) {
            return
        }
        const interval= setInterval(()=>{
            socket.emit("save-document", quill.getContents())
        },2000)
        return ()=>{
            clearInterval(interval)
        }
    }, [socket,quill])

    // get the document 
    useEffect(() => {
        if(socket==null || quill ==null) {
            return
        }
        socket.once("load-document",data=>{
            quill.setContents(data)
            quill.enable()
        })
        socket.emit('get-document',documentid)
    }, [socket,quill,documentid])

    // send changes
    useEffect(() => {
        if(socket==null || quill ==null) {
            return
        }
        const handler = function(delta, oldDelta, source) {
            if (source === 'api') {
              return
            } else if (source === 'user') {
                socket.emit("send-changes",delta)
            }
          }
        quill.on('text-change',handler)
        return ()=>{
            quill.off('text-changes',handler)
        }
    }, [socket,quill])

    // recieve changes
    useEffect(() => {
        if(socket==null || quill ==null) {
            return
        }
        const handler = function(delta, oldDelta, source) {
            quill.updateContents(delta)
          }
        socket.on("receive-changes",handler)
        
        return ()=>{
            socket.off('receive-changes',handler)
        }
    },[socket,quill])
    
    // quill object
    const wrapperRef=useCallback(wrapper => {
        if(wrapper==null) return 

        wrapper.innerHTML=''
        const editor =document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor,{
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
          })
        q.disable()
        q.setText("Loading...")
        setQuill(q)
    }, [])

    return (
        <div id="container" ref={wrapperRef}>
            </div>
    )
}

export default Texteditor
