import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import {v4 as uuidV4} from "uuid"
import { useHistory } from 'react-router'

const Home = () => {
    const [id, setId] = useState("")
    const history= useHistory()
    const handleSubmit= (e)=>{
        e.preventDefault()
        console.log(id)
        history.push(`/documents/${id}`)
    }
    return (
        <div className="bg-blue-300 h-screen m-auto">
            <div className=" max-w-screen-2xl m-auto">
                <div className=" flex flex-col justify-center h-screen items-center">
                    <h1 className=" text-5xl">Spring Docs</h1>
                    <Link to={`/documents/${uuidV4()}`} className="py-3 bg-yellow-400 px-7 rounded-full mt-4 text-gray-100 text-lg"> Create new Document</Link>
                    <p>OR</p>
                    <h2>Open an existing Document</h2>
                    <form action="" onSubmit={handleSubmit} className=" flex flex-col justify-center items-center gap-2 mt-4">
                        <input className=" focus:outline-none px-4 py-3 rounded-full w-80" placeholder="Enter Document ID"
                             type="text" required onChange={(e)=>{setId(e.target.value)}} />
                        <button className="py-2 bg-yellow-400 px-4 w-32 rounded-full text-gray-100" type="submit">Submit</button>
                    </form>
                </div>
            </div>
            
        </div>
    )
}

export default Home
