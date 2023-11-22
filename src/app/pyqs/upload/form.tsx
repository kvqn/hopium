"use client"

import uploadPYQ from "@/server/uploadPyq"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

export default function Form() {
  const { data: session } = useSession()
  let formRef = useRef<HTMLFormElement>(null)

  async function upload(data: FormData) {
    data.append("user_email", session?.user?.email || "")
    const resp = await uploadPYQ(data)
    if (resp.error) toast.error(resp.error)
    if (resp.pyq) toast.success(`Uploaded PYQ #${resp.pyq.fileId}`)
  }

  return (
    <div className="mx-[25%] my-40 border pt-8 px-8 pb-4">
      <div className="flex justify-center text-xl p-4">Upload PYQ</div>
      <form
        action={upload}
        className="flex flex-col items-center gap-2"
        ref={formRef}
      >
        <input
          className="border p-4 rounded-xl hover:border-slate-500 transition-all w-full"
          type="file"
          name="file"
        />
        <input
          className="border p-4 transition-all hover:border-slate-500 rounded-xl w-full"
          type="text"
          name="subject_code"
          placeholder="Subject Code"
        />
        <input
          className="border p-4 transition-all hover:border-slate-500 rounded-xl w-full"
          type="text"
          name="subject_name"
          placeholder="Subject Name"
        />
        <input
          className="border p-4 transition-all hover:border-slate-500 rounded-xl w-full"
          type="number"
          name="year"
          placeholder="Year"
        />
        <select
          name="type"
          className="p-4 rounded-xl border hover:border-slate-500 transition-all w-full"
        >
          <option value="MID_TERM_QUESTIONS">Mid Term Questions</option>
          <option value="END_TERM_QUESTIONS">End Term Questions</option>
          <option value="MID_TERM_ANSWERS">Mid Term Answers</option>
          <option value="END_TERM_ANSWERS">End Term Answers</option>
        </select>
        <button
          className="border py-2 px-4 w-fit rounded-xl bg-blue-200 hover:bg-blue-300 transition-colors"
          type="submit"
        >
          Upload
        </button>
      </form>
      <div className="flex justify-center">
        <div
          className="text-white hover:text-black cursor-pointer hover:underline"
          onClick={() => {
            console.log(formRef)
            formRef.current?.reset()
          }}
        >
          Clear
        </div>
      </div>
    </div>
  )
}
