"use client"

import { useEffect, useRef, useState } from "react"

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState('')
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  useEffect(() => {
    let stream: MediaStream | null = null

    async function initCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error(err)
        setError('Could not access camera')
      }
    }

    initCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [facingMode])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<string | null>(null)

  function handleCapture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/png')
        setImage(dataUrl)
      }
    }
  }

  function handleAgain() {
    setImage(null)
  }

  return {
    image,
    captureImage: handleCapture,
    again: handleAgain,
    videoRef,
    canvasRef,
    error,
    facingMode,
    setFacingMode
  }
}
