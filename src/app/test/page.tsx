'use client'
import { useRef, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, message, Modal } from "antd";
import axiosClient from "@/api/aixos.config";
import { UploadCCCD } from "@/components/cccd-camera";

export default function Test() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const inputFileRef = useRef<HTMLInputElement>(null);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [payload, setPayload] = useState({});
    const [cccdBackImageId, setCccdBackImageId] = useState()
    const videoRef = useRef<HTMLVideoElement>(null)

    const temp = [{
        value: 'a',
        label: 'Căn cước công dân mặt trước'
    }, {
        value: 'b',
        label: 'Căn cước công dân mặt sau'
    }];

    const MAX_SIZE = 2 * 1024 * 1024 // 2MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

    const uploadFile = async (file: File) => {

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axiosClient.post(
                "image/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

        } catch (err) {
            message.error("Tải ảnh thất bại")
            console.error(err)
        }
    };

    const onFile = (file: File) => {

        handleCancel();
    }

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

        onFile(file)
    }

    return (
        <UploadCCCD onChange={() => {

        }} />

    )
}