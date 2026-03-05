"use client"
import { PlusOutlined } from '@ant-design/icons';
import axiosClient from "@/api/aixos.config";
import { Button, message, Modal } from "antd";
import { useEffect, useRef, useState } from "react"
import { getUrlFromFileId } from '@/utils/get-url-from-file-id';

export interface IUploadCCCDData {
    cccdFrontImageId: string;
    cccdBackImageId: string
}

interface IUploadCCCDProps {
    onChange: (data: IUploadCCCDData) => void
}

export function UploadCCCD(props: IUploadCCCDProps) {
    const { onChange } = props;
    const [activeKey, setAcctiveKey] = useState<string>('');
    const [activeCapture, setActiveCapture] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const frameRef = useRef<HTMLDivElement>(null)


    const [payload, setPayload] = useState<IUploadCCCDData>({
        cccdBackImageId: '',
        cccdFrontImageId: ''
    })

    const inputFileRef = useRef<HTMLInputElement>(null);

    const showModal = (key: string) => {
        setAcctiveKey(key);
    };

    const handleCancel = () => {
        setAcctiveKey('');
        setActiveCapture(false);
    };
    const temp = {
        cccdFrontImageId: 'Căn cước công dân mặt trước',
        cccdBackImageId: 'Căn cước công dân mặt sau'
    }

    const MAX_SIZE = 2 * 1024 * 1024 // 2MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

    const uploadFile = async (file: File) => {

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res: any = await axiosClient.post(
                "image/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setPayload({
                ...payload,
                [activeKey]: res.id
            })

        } catch (err) {
            message.error("Tải ảnh thất bại")
            console.error(err)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // check type
        if (!ALLOWED_TYPES.includes(file.type)) {
            alert("Chỉ được upload file ảnh (jpg, png, webp)")
            return
        }

        // check size
        if (file.size > MAX_SIZE) {
            alert("Ảnh phải nhỏ hơn 2MB")
            return
        }

        uploadFile(file)
    }

    const capture = () => {
        const video = videoRef.current!
        const canvas = canvasRef.current!

        if (!video.videoWidth) {
            console.log("video not ready")
            return
        }

        const sw = 320
        const sh = 202

        const sx = (video.videoWidth - sw) / 2
        const sy = (video.videoHeight - sh) / 2

        canvas.width = sw
        canvas.height = sh

        const ctx = canvas.getContext("2d")!

        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh)

        setTimeout(() => {
            canvas.toBlob((blob) => {
                if (!blob) return
                const file = new File([blob], "cccd.jpg", { type: "image/jpeg" })
                uploadFile(file)
            }, "image/jpeg", 0.95)
        }, 0)
    }

    useEffect(() => {
        if (payload.cccdBackImageId.length > 0 || payload.cccdFrontImageId.length > 0) {
            onChange(payload);
            handleCancel();
        }
    }, [payload])

    useEffect(() => {
        async function startCamera() {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment"
                }
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                await videoRef.current.play()
            }
        }

        if (activeCapture) {
            startCamera()
        }
    }, [activeCapture])

    return (
        <div className="flex gap-1">
            {
                Object.entries(temp).map(([val, label]) => {
                    const value = val as keyof IUploadCCCDData;
                    return (
                        <div className="max-w-1/2 w-1/2 h-[180px] max-h-[180px]" key={value} onClick={() => {
                            showModal(value);
                        }}>
                            <div className="cursor-pointer max-w-full h-[180px] max-h-[180x] flex flex-col justify-center items-center gap-1 border">
                                {
                                    !payload[value] ? (
                                        <>
                                            <PlusOutlined className="text-black" />
                                            {label}
                                        </>
                                    ) : (
                                        <img src={getUrlFromFileId(payload[value])} alt="" className='max-w-full max-h-full object-cover' />
                                    )
                                }
                            </div>
                        </div>

                    )
                })
            }
            <Modal
                title={temp[activeKey as keyof IUploadCCCDData]}
                open={activeKey.length > 0}
                footer={null}
                onCancel={handleCancel}
            >
                <div className="flex flex-col gap-2">
                    {
                        activeCapture && (
                            <div className='flex justify-center items-center flex-col gap-2'>
                                <video ref={videoRef} className="w-[320px] h-[202px]" playsInline />
                                <div ref={frameRef} className="cccd-frame" />
                                <canvas ref={canvasRef} className='hidden' />
                                <div className='flex gap-2 items-stretch'>
                                    <Button onClick={() => capture()}>Chụp</Button>
                                    <Button onClick={() => setActiveCapture(false)}>Quay lại</Button>
                                </div>
                            </div>
                        )
                    }
                    {
                        !activeCapture && (
                            <>
                                <Button onClick={() => {
                                    setActiveCapture(true);
                                }}>Chụp ảnh mới</Button>
                                <Button onClick={() => {
                                    inputFileRef.current?.click();
                                }} >Chọn ảnh có sẵng</Button>
                                <input
                                    ref={inputFileRef}
                                    type={'file'}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleChange}
                                />
                            </>
                        )
                    }

                </div>
            </Modal>
        </div>

    )
}

// export function CCCDCamera({ onCapture }: { onCapture: (file: File) => void }) {
//     const videoRef = useRef<HTMLVideoElement>(null)
//     const canvasRef = useRef<HTMLCanvasElement>(null)
//     const frameRef = useRef<HTMLDivElement>(null)

//     useEffect(() => {
//         async function startCamera() {
//             console.log(navigator.mediaDevices)
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 video: {
//                     facingMode: "environment"
//                 }
//             })

//             if (videoRef.current) {
//                 videoRef.current.srcObject = stream
//                 await videoRef.current.play()
//             }
//         }

//         startCamera()
//     }, [])

//     const capture = () => {
//         const video = videoRef.current!
//         const canvas = canvasRef.current!

//         if (!video.videoWidth) {
//             console.log("video not ready")
//             return
//         }

//         const sw = 320
//         const sh = 202

//         const sx = (video.videoWidth - sw) / 2
//         const sy = (video.videoHeight - sh) / 2

//         canvas.width = sw
//         canvas.height = sh

//         const ctx = canvas.getContext("2d")!

//         ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh)

//         setTimeout(() => {
//             canvas.toBlob((blob) => {
//                 if (!blob) return
//                 const file = new File([blob], "cccd.jpg", { type: "image/jpeg" })
//                 onCapture(file)
//             }, "image/jpeg", 0.95)
//         }, 0)
//     }

//     return (
//         <div className="camera-container">
//             <video ref={videoRef} className="camera-video" playsInline />

//             <div ref={frameRef} className="cccd-frame" />

//             <button className="capture-btn" onClick={capture}>
//                 Capture
//             </button>

//             <canvas ref={canvasRef} style={{ display: "none" }} />
//         </div>
//     )
// }
