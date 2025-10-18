"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { IconUpload, IconRefresh, IconTrash } from "@tabler/icons-react"
import { apiFetch } from "@/app/api/fetcher"
import { generateDefaultAvatar, getUserInitials } from "@/lib/utils/avatar"

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  userEmail: string
  onAvatarChange?: (newAvatar: string) => void
}

export function AvatarUpload({ currentAvatar, userName, userEmail, onAvatarChange }: AvatarUploadProps) {
  const [avatar, setAvatar] = useState(currentAvatar || generateDefaultAvatar(userEmail))
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await apiFetch('/api/v1/users/me/avatar', {
        method: 'POST',
        body: formData,
      })

      if (response.success && response.data?.avatar) {
        setAvatar(response.data.avatar)
        onAvatarChange?.(response.data.avatar)
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleGenerateAvatar = async () => {
    setIsUploading(true)
    try {
      const response = await apiFetch('/api/v1/users/me/avatar/generate', {
        method: 'POST',
        body: JSON.stringify({ style: 'avataaars' }),
      })

      if (response.success && response.data?.avatar) {
        setAvatar(response.data.avatar)
        onAvatarChange?.(response.data.avatar)
      }
    } catch (error) {
      console.error('Failed to generate avatar:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteAvatar = async () => {
    setIsUploading(true)
    try {
      const response = await apiFetch('/api/v1/users/me/avatar', {
        method: 'DELETE',
      })

      if (response.success) {
        const defaultAvatar = generateDefaultAvatar(userEmail)
        setAvatar(defaultAvatar)
        onAvatarChange?.(defaultAvatar)
      }
    } catch (error) {
      console.error('Failed to delete avatar:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatar} alt={userName} />
        <AvatarFallback className="text-2xl">{getUserInitials(userName)}</AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          <IconUpload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <Button
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={handleGenerateAvatar}
        >
          <IconRefresh className="w-4 h-4 mr-2" />
          Generate
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={handleDeleteAvatar}
        >
          <IconTrash className="w-4 h-4 mr-2" />
          Remove
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Upload a custom image or generate a random avatar
      </p>
    </div>
  )
}

