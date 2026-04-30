"use client"

import {PointerEvent as ReactPointerEvent, useEffect, useRef, useState} from "react";
import {Button, Card, CardBody, Divider, Input} from "@heroui/react";
import UserProfileCard from "@/app/app/profile/ProfilePhoto";
import SettingsSidebar from "@/app/app/component/SettingsSidebar";
import {useUser} from "@/app/providers/UserContext";
import {PlanStatus} from "@/app/app/profile/ProfilePhoto";

const profilePrimaryButtonClass =
    "group h-auto min-h-[54px] rounded-[8px] bg-[#1d84c6] px-5 py-3 text-base font-semibold tracking-normal text-white shadow-[0_16px_32px_-22px_rgba(29,132,198,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#166fa8] hover:shadow-[0_22px_38px_-24px_rgba(29,132,198,0.95)] focus-visible:ring-2 focus-visible:ring-[#72bee9] focus-visible:ring-offset-2";

const profileSecondaryButtonClass =
    "h-auto min-h-[54px] rounded-[8px] border border-[#c9ddec] bg-white px-5 py-3 text-base font-semibold tracking-normal text-[#28516d] shadow-[0_10px_24px_-22px_rgba(34,74,104,0.65)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#79b8e2] hover:bg-[#f2f9ff] hover:text-[#1f75ad]";

const CROP_FRAME_SIZE = 280;
const CROPPED_IMAGE_SIZE = 512;

type CropSource = {
    file: File;
    url: string;
    width: number;
    height: number;
};

export default function ProfilePage() {
    const {userProfile, setUserProfile, updateUserProfile, me, setAvatarFile, avatarFile} = useUser()

    const [cropSource, setCropSource] = useState<CropSource | null>(null)
    const [cropZoom, setCropZoom] = useState(1)
    const [cropOffset, setCropOffset] = useState({x: 0, y: 0})
    const [isCropping, setIsCropping] = useState(false)
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null)

    const dragStateRef = useRef<{pointerId: number; startX: number; startY: number; originX: number; originY: number} | null>(null)

    useEffect(() => {
        return () => {
            if (cropSource?.url) {
                URL.revokeObjectURL(cropSource.url)
            }
            if (previewAvatarUrl) {
                URL.revokeObjectURL(previewAvatarUrl)
            }
        }
    }, [cropSource?.url, previewAvatarUrl])

    const clampOffset = (nextOffset: {x: number; y: number}, zoom: number, source: CropSource) => {
        const baseScale = Math.max(CROP_FRAME_SIZE / source.width, CROP_FRAME_SIZE / source.height)
        const renderedWidth = source.width * baseScale * zoom
        const renderedHeight = source.height * baseScale * zoom

        return {
            x: Math.min(0, Math.max(CROP_FRAME_SIZE - renderedWidth, nextOffset.x)),
            y: Math.min(0, Math.max(CROP_FRAME_SIZE - renderedHeight, nextOffset.y)),
        }
    }

    const centerCrop = (source: CropSource, zoom: number) => {
        const baseScale = Math.max(CROP_FRAME_SIZE / source.width, CROP_FRAME_SIZE / source.height)
        const renderedWidth = source.width * baseScale * zoom
        const renderedHeight = source.height * baseScale * zoom

        return {
            x: (CROP_FRAME_SIZE - renderedWidth) / 2,
            y: (CROP_FRAME_SIZE - renderedHeight) / 2,
        }
    }

    const handlePhotoSelected = (file: File) => {
        const url = URL.createObjectURL(file)
        const image = new window.Image()

        image.onload = () => {
            const source = {
                file,
                url,
                width: image.naturalWidth || image.width,
                height: image.naturalHeight || image.height,
            }

            setCropZoom(1)
            setCropOffset(centerCrop(source, 1))
            setCropSource(source)
        }

        image.onerror = () => {
            URL.revokeObjectURL(url)
        }

        image.src = url
    }

    const closeCropper = () => {
        if (cropSource?.url) {
            URL.revokeObjectURL(cropSource.url)
        }
        setCropSource(null)
        setCropZoom(1)
        setCropOffset({x: 0, y: 0})
        dragStateRef.current = null
    }

    const handleCropZoomChange = (value: number) => {
        if (!cropSource) return
        setCropZoom(value)
        setCropOffset((current) => clampOffset(current, value, cropSource))
    }

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!cropSource) return

        dragStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            originX: cropOffset.x,
            originY: cropOffset.y,
        }

        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!cropSource || !dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) return

        const nextOffset = {
            x: dragStateRef.current.originX + (event.clientX - dragStateRef.current.startX),
            y: dragStateRef.current.originY + (event.clientY - dragStateRef.current.startY),
        }

        setCropOffset(clampOffset(nextOffset, cropZoom, cropSource))
    }

    const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragStateRef.current?.pointerId === event.pointerId) {
            dragStateRef.current = null
            event.currentTarget.releasePointerCapture(event.pointerId)
        }
    }

    const handleConfirmCrop = async () => {
        if (!cropSource) return

        setIsCropping(true)

        try {
            const baseScale = Math.max(CROP_FRAME_SIZE / cropSource.width, CROP_FRAME_SIZE / cropSource.height)
            const displayScale = baseScale * cropZoom
            const sourceSize = CROP_FRAME_SIZE / displayScale
            const sourceX = Math.max(0, Math.min(cropSource.width - sourceSize, -cropOffset.x / displayScale))
            const sourceY = Math.max(0, Math.min(cropSource.height - sourceSize, -cropOffset.y / displayScale))

            const image = new window.Image()
            image.src = cropSource.url

            await new Promise<void>((resolve, reject) => {
                image.onload = () => resolve()
                image.onerror = () => reject(new Error("Unable to load selected image."))
            })

            const canvas = document.createElement("canvas")
            canvas.width = CROPPED_IMAGE_SIZE
            canvas.height = CROPPED_IMAGE_SIZE

            const context = canvas.getContext("2d")
            if (!context) {
                throw new Error("Canvas is not available in this browser.")
            }

            context.drawImage(
                image,
                sourceX,
                sourceY,
                sourceSize,
                sourceSize,
                0,
                0,
                CROPPED_IMAGE_SIZE,
                CROPPED_IMAGE_SIZE
            )

            const outputType = cropSource.file.type === "image/png" || cropSource.file.type === "image/webp"
                ? cropSource.file.type
                : "image/jpeg"

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((result) => {
                    if (result) {
                        resolve(result)
                        return
                    }
                    reject(new Error("Unable to create cropped image."))
                }, outputType, 0.92)
            })

            const fileExtension = outputType === "image/png" ? "png" : outputType === "image/webp" ? "webp" : "jpg"
            const croppedFile = new File(
                [blob],
                cropSource.file.name.replace(/\.[^.]+$/, "") + `-cropped.${fileExtension}`,
                {type: outputType}
            )

            setAvatarFile(croppedFile)
            setPreviewAvatarUrl((current) => {
                if (current) {
                    URL.revokeObjectURL(current)
                }
                return URL.createObjectURL(croppedFile)
            })
            closeCropper()
        } finally {
            setIsCropping(false)
        }
    }

    const activeAvatar = previewAvatarUrl ?? me?.image_url

    const cropStyles = cropSource ? (() => {
        const baseScale = Math.max(CROP_FRAME_SIZE / cropSource.width, CROP_FRAME_SIZE / cropSource.height)
        const renderedWidth = cropSource.width * baseScale * cropZoom
        const renderedHeight = cropSource.height * baseScale * cropZoom

        return {
            width: `${renderedWidth}px`,
            height: `${renderedHeight}px`,
            transform: `translate(${cropOffset.x}px, ${cropOffset.y}px)`,
        }
    })() : null

    return (
            <div className="app app-wrapper min-h-screen bg-white">
                <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-10 sm:px-8 lg:px-10 sm:pt-12 lg:pt-16">
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                        <div className="w-full min-w-0">
                            <div className="mb-8">
                                <p className="text-sm font-semibold uppercase tracking-normal text-[#4b9cdc]">
                                    Account Settings
                                </p>
                                <h1 className="mt-3 text-[40px] font-light leading-tight tracking-normal text-[#202020] sm:text-[48px]">
                                    My Profile
                                </h1>
                                <p className="mt-3 text-lg font-light leading-7 text-[#4e4e4e]">
                                    Manage your profile details and keep your account identity up to date.
                                </p>
                            </div>

                            <Card className="border border-[#dbe7f3] bg-white shadow-[0_28px_64px_-48px_rgba(22,54,88,0.46)]">
                                <CardBody className="px-5 py-6 sm:px-6">
                                    <UserProfileCard
                                        key={activeAvatar ?? "profile-avatar"}
                                        name={me?.name}
                                        email={me?.email}
                                        plan={me?.plan?.name as PlanStatus}
                                        avatar={activeAvatar}
                                        onPhotoSelected={handlePhotoSelected}
                                    />
                                </CardBody>
                            </Card>

                            <Card className="mt-5 border border-[#dbe7f3] bg-white shadow-[0_28px_64px_-48px_rgba(22,54,88,0.46)]">
                                <CardBody className="px-5 py-6 sm:px-7">
                                    <div className="border-b border-[#e7edf4] pb-4">
                                        <p className="text-sm font-semibold uppercase tracking-normal text-[#738496]">
                                            Personal details
                                        </p>
                                        <h2 className="mt-1 text-xl font-semibold text-[#24323f]">
                                            Profile Information
                                        </h2>
                                    </div>
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        updateUserProfile.mutate({ userProfile: userProfile ?? {}, avatarFile })
                                    }}>
                                        <div className="mt-6 grid w-full gap-4 md:grid-cols-2">
                                            <div className="w-full">
                                                <Input
                                                  isRequired
                                                  label="First Name"
                                                  labelPlacement="outside"
                                                  name="name"
                                                  placeholder="Enter your first name"
                                                  value={userProfile?.fname ?? ""}
                                                  onValueChange={(v) => setUserProfile((prev) => ({...prev, fname: v}))}
                                                  radius="sm"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <Input
                                                  isRequired
                                                  label="Last Name"
                                                  labelPlacement="outside"
                                                  name="name"
                                                  placeholder="Enter your last name"
                                                  value={userProfile?.lname ?? ""}
                                                  onValueChange={(v) => setUserProfile((prev) => ({...prev, lname: v}))}
                                                  radius="sm"
                                                />
                                            </div>
                                        </div>

                                        <Divider className="my-6 bg-[#e7edf4]" />

                                        <div className="flex w-full flex-col justify-between gap-3 md:flex-row md:items-center">
                                            <Button
                                                className={profileSecondaryButtonClass}
                                                disableRipple
                                                disableAnimation
                                                size="md"
                                            >Change Email</Button>
                                            <Button type="submit" className={profilePrimaryButtonClass} size="md">Save Changes</Button>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="w-full min-w-0">
                            <SettingsSidebar />
                        </div>
                    </div>
                </div>
                {cropSource && cropStyles ? (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#163658]/55 px-4 py-6 backdrop-blur-sm">
                        <div className="w-full max-w-[560px] rounded-[16px] border border-[#dbe7f3] bg-white p-6 shadow-[0_32px_80px_-40px_rgba(22,54,88,0.55)]">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-normal text-[#4b9cdc]">
                                    Adjust Photo
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold text-[#24323f]">
                                    Drag to position your profile image
                                </h2>
                                <p className="mt-2 text-sm font-light leading-6 text-[#526271]">
                                    Move the image until the part you want fits inside the frame, then save the crop.
                                </p>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <div
                                    role="presentation"
                                    className="relative h-[280px] w-[280px] overflow-hidden rounded-full bg-[#eaf3fb] shadow-inner touch-none select-none"
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerEnd}
                                    onPointerCancel={handlePointerEnd}
                                    onPointerLeave={handlePointerEnd}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={cropSource.url}
                                        alt="Crop preview"
                                        draggable={false}
                                        className="absolute left-0 top-0 max-w-none"
                                        style={cropStyles}
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center justify-between text-sm font-medium text-[#526271]">
                                    <span>Zoom</span>
                                    <span>{cropZoom.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={cropZoom}
                                    onChange={(event) => handleCropZoomChange(Number(event.target.value))}
                                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#dbe7f3]"
                                />
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    className={profileSecondaryButtonClass}
                                    disableRipple
                                    disableAnimation
                                    onPress={closeCropper}
                                    isDisabled={isCropping}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    className={profilePrimaryButtonClass}
                                    onPress={handleConfirmCrop}
                                    isLoading={isCropping}
                                >
                                    Save Photo
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
    )
}
