"use client"
import Image from "next/image";
import { useState } from "react";
import addTodo from "../public/addTodos.svg"
import circle from "../public/circle.svg"
import cross from "../public/cross.svg"
import { api } from "../lib/axios";
import { useRouter } from "next/navigation";

interface InputTodoProp {
    date?: string;
}

export function InputTodo({date}: InputTodoProp) {

    const router = useRouter() 

    const [comment, setComment] = useState("")
    const [priority, setPriority] = useState<"normal" | "high" | "medium" | "low">("normal")
    const [selectPriority, setSelectPriority] = useState(false)
    const [loadind, setLoading] = useState(false)


    async function submit() {
        setLoading(true)
        try {

            if( comment.length < 5 ) return

            const res = await api.post(`/api/todo/add`, {
                title: comment,
                date,
                priority
            })

            if( res.status === 201 ) {
                setComment("")
                setPriority("normal")

                router.refresh()
            }
            
        } catch (error) {
            
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="w-full fixed bottom-0 bg-white">
                {selectPriority && <div className="m-1 bg-white p-2 flex items-center justify-center gap-3">
                    <button 
                        onClick={() => {
                            setPriority("high")
                            setSelectPriority(false)
                        }}
                        className="w-6 rounded-2xl bg-red-600 text-red-600"
                    >.</button>
                    <button 
                        onClick={() => {
                            setPriority("medium")
                            setSelectPriority(false)
                        }}
                        className="w-6 rounded-2xl bg-yellow-400 text-yellow-400"
                    >.</button>
                    <button 
                        onClick={() => {
                            setPriority("low")
                            setSelectPriority(false)
                        }}
                        className="w-6 rounded-2xl bg-green-500 text-green-500"
                    >.</button>
                    <button 
                        onClick={() => {
                            setPriority("normal")
                            setSelectPriority(false)
                        }}
                        className="w-6 rounded-2xl ring-1 ring-black bg-white text-white"
                    >.</button>
                </div>}
                <div className="rounded-xl shadow-md p-3 m-3">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    maxLength={100}
                    rows={1}
                    className="w-full resize-none bg-transparent text-base text-black outline-none placeholder:text-[#9CA3AF]"
                />

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-base text-[#9CA3AF]">
                    {comment.length}/100
                    </span>

                    <div className="flex items-center gap-1.5">
                
                        <button onClick={() => setSelectPriority(!selectPriority)} className={`${priority === "high" && !selectPriority ? "bg-red-600" : priority === "medium" && !selectPriority ? "bg-yellow-400" : priority === "low" && !selectPriority ? "bg-green-500" : "bg-none"} rounded-2xl`}>
                            {selectPriority ? <Image src={cross} alt="" /> : <Image src={circle} alt="" />}
                        </button>
                        <button
                        type="button"
                        onClick={submit}
                        disabled={!comment.trim() || loadind}
                        className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-80"
                        >
                        <Image src={addTodo} alt="" />
                        </button>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}