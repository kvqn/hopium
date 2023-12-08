"use client"

import { PDFViewer } from "@/components/PDFViewer"
import { SimpleTooltip } from "@/components/Tooltip"
import { prisma } from "@/prisma"
import { getFile } from "@/server/getFile"
import {
  faDownload,
  faLink,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Prisma } from "@prisma/client"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useState } from "react"

export function FileViewer({ url, type }: { url: string; type: string }) {
  const [scale, setScale] = useState(1)
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between bg-gray-200 px-4 py-2">
        <div className="flex items-center gap-4">
          <SimpleTooltip
            trigger={
              <FontAwesomeIcon
                icon={faMagnifyingGlassPlus}
                className="cursor-pointer text-neutral-700 transition-colors hover:text-neutral-950"
                onClick={() => {
                  setScale(scale + 0.1)
                }}
              />
            }
            content="Zoom In"
          />
          <div className="border-black">{scale.toFixed(2)}</div>
          <SimpleTooltip
            trigger={
              <FontAwesomeIcon
                icon={faMagnifyingGlassMinus}
                className="cursor-pointer text-neutral-700 transition-colors hover:text-neutral-950"
                onClick={() => {
                  setScale(scale - 0.1)
                }}
              />
            }
            content="Zoom Out"
          />
        </div>
        <div className="flex items-center gap-4">
          <SimpleTooltip
            trigger={
              <a href={url} target="_blank">
                <FontAwesomeIcon
                  icon={faLink}
                  className="text-neutral-700 transition-colors hover:text-neutral-950"
                />
              </a>
            }
            content="Open in new tab"
          />

          <SimpleTooltip
            trigger={
              <a href={url} download>
                <FontAwesomeIcon
                  icon={faDownload}
                  className="text-neutral-700 transition-colors hover:text-neutral-950"
                />
              </a>
            }
            content="Download"
          />
        </div>
      </div>
      <div className="relative h-full w-full overflow-auto">
        <div
          style={{
            scale: scale,
          }}
        >
          {type === "PDF" ? (
            <PDFViewer url={url} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt="Image"
              style={{
                height: "100%",
                width: "100%",
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function FileViewerUsingId({ id }: { id: number }) {
  const { data: session } = useSession()
  const [file, setFile] = useState<Prisma.fileGetPayload<{}> | null>()
  const [loading, setLoading] = useState(true)

  async function fetchFile() {
    setLoading(true)
    setFile(await getFile(id, session))
    setLoading(false)
  }

  useEffect(() => {
    fetchFile()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Loading</p>
      </div>
    )
  }

  if (!file)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div>File not found</div>
        <button onClick={() => fetchFile()} className="hover:underline">
          Retry?
        </button>
      </div>
    )

  const url = `/api/pyq/${id}`
  const type = file.type

  return <FileViewer url={url} type={type} />
}
