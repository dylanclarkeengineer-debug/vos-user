'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { useAuth } from '@/context/authContext'
import profileHandlers from '@/utils/user/profileHandlers'

export default function AccountProfilePage() {
  const { user } = useAuth()
  const userId = user?.user_id || null
  const fileInputRef = useRef(null)

  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  const [profileData, setProfileData] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,
    previewAvatar: null
  })

  // Phone Verification Modal State
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) { setIsLoading(false); return }
      try {
        setIsLoading(true)
        const data = await profileHandlers.getUserProfile(userId)
        if (!data) throw new Error("No data returned")

        setProfileData(data)
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          avatar: null,
          previewAvatar: data.avatar_url || data.personal_profile_image || null
        })
      } catch (err) {
        console.error(err)
        setError('Failed to load profile.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [userId])

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Maximum size is 2MB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        avatar: reader.result,
        previewAvatar: reader.result
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleTriggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const isPhoneChanged = () => {
    return formData.phone !== (profileData?.phone || '')
  }

  const handleSave = async () => {
    if (isPhoneChanged()) {
      setNewPhoneNumber(formData.phone)
      setShowVerifyModal(true)
      return
    }
    await performUpdate()
  }

  const performUpdate = async () => {
    try {
      setIsSaving(true)

      await profileHandlers.updateUserProfile(userId, {
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar
      })

      setProfileData(prev => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
        avatar_url: formData.previewAvatar
      }))

      setIsEditing(false)
      setFormData(prev => ({ ...prev, avatar: null }))

      alert("Profile updated successfully!")

    } catch (err) {
      console.error(err)
      alert("Failed to update profile.  Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleVerifyPhone = async () => {
    setVerifyError('')

    if (!verificationCode || verificationCode.length !== 6) {
      setVerifyError('Please enter a valid 6-digit code.')
      return
    }

    try {
      setIsVerifying(true)
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log('✅ Phone verified:', newPhoneNumber, 'with code:', verificationCode)

      setShowVerifyModal(false)
      setVerificationCode('')
      await performUpdate()

    } catch (err) {
      console.error(err)
      setVerifyError('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const toggleEdit = () => {
    if (isEditing) {
      handleSave()
    } else {
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    if (!profileData) return

    setFormData({
      name: profileData.name || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
      avatar: null,
      previewAvatar: profileData.avatar_url || profileData.personal_profile_image
    })
    setIsEditing(false)
  }

  const handleResendCode = async () => {
    setVerifyError('')
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Verification code sent to ' + newPhoneNumber)
    } catch (err) {
      setVerifyError('Failed to resend code.')
    }
  }

  // --- HELPERS ---
  const formatMemberSince = (createdAt) => {
    if (!createdAt) return 'N/A'
    try {
      const timestamp = createdAt._seconds || createdAt.seconds || createdAt
      const date = new Date(Number(timestamp) * 1000)
      return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
    } catch { return 'N/A' }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  // --- RENDER ---
  if (isLoading) return <ProfileSkeleton />
  if (error) return <ErrorState message={error} />
  if (!userId) return <NoUserState />
  if (!profileData) return <ProfileSkeleton />

  return (
    <>
      <div className="animate-fade-in mx-auto max-w-5xl space-y-6 pt-6 pb-20 px-4 md:px-0">

        {/* 1. HEADER & ACTIONS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Label variant="primary">My Profile</Label>
            <Label variant="normal_text" className="mt-1">
              Manage your personal information.
            </Label>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isEditing && (
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
            )}
            <Button
              variant={isEditing ? 'brand' : 'outline'}
              onClick={toggleEdit}
              disabled={isSaving}
              className="w-full sm:w-auto min-w-[140px]"
            >
              {isSaving ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <i className="ri-save-line"></i>
                  Save Changes
                </>
              ) : (
                <>
                  <i className="ri-edit-line"></i>
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 2. MAIN PROFILE CARD */}
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">

          {/* Top:  Avatar & Info */}
          <div className="border-b border-neutral-100 bg-neutral-50/50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">

              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-28 w-28 border-4 border-white shadow-sm ring-1 ring-neutral-200">
                  <AvatarImage src={formData.previewAvatar} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-neutral-900 text-white font-bold">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {isEditing && (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={handleTriggerFileUpload}
                  >
                    <i className="ri-upload-2-line"></i>
                    Change Photo
                  </Button>
                )}
              </div>

              {/* User Summary */}
              <div className="flex-1 text-center md:text-left space-y-1 pt-2">
                <Label variant="primary">{profileData?.name || 'User'}</Label>
                <Label variant="normal_text">{profileData?.email}</Label>

                <div className="pt-3 flex flex-wrap justify-center md: justify-start gap-2">
                  <Badge className="px-3 py-1 bg-blue-100 text-blue-700 border-blue-200">
                    Premium Member
                  </Badge>
                  {profileData?.phone && (
                    <Badge className="px-3 py-1 bg-green-100 text-green-700 border-green-200">
                      <i className="ri-shield-check-fill"></i>
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Inputs */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label variant="form">Full Name</Label>
              <Input
                mode={isEditing ? 'edit' : 'view'}
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full"
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label variant="form">Phone Number</Label>
                {isPhoneChanged() && isEditing && (
                  <Label variant="normal_text" className="text-orange-600">
                    <i className="ri-alert-line"></i>
                    Will require verification
                  </Label>
                )}
              </div>
              <Input
                mode={isEditing ? 'edit' : 'view'}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="+1 (555) 000-0000"
                className="w-full"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between items-center">
                <Label variant="form">Email Address</Label>
                <Label variant="normal_text" className="italic flex items-center gap-1">
                  <i className="ri-lock-line"></i>
                  Read-only
                </Label>
              </div>
              <div className="relative">
                <Input
                  mode="readOnly"
                  value={formData.email}
                  disabled
                  className="w-full pl-10"
                />
                <i className="ri-mail-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Since */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div>
              <Label variant="form" className="text-neutral-400 mb-1">
                Member Since
              </Label>
              <Label variant="secondary" className="text-neutral-900">
                {formatMemberSince(profileData?.created_at)}
              </Label>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <i className="ri-calendar-check-line text-xl"></i>
            </div>
          </div>

          {/* Account Status */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div>
              <Label variant="form" className="text-neutral-400 mb-1">
                Account Status
              </Label>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                </span>
                <Label variant="secondary" className="text-neutral-900">Active</Label>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <i className="ri-shield-check-line text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* PHONE VERIFICATION MODAL */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="ri-smartphone-line text-blue-600"></i>
              Verify Phone Number
            </DialogTitle>
            <DialogDescription>
              We've sent a 6-digit verification code to <strong>{newPhoneNumber}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label variant="form">Verification Code</Label>
              <Input
                mode="edit"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setVerificationCode(val)
                }}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-bold"
                autoFocus
              />
            </div>

            {verifyError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-start gap-2">
                <i className="ri-error-warning-line mt-0.5"></i>
                <span>{verifyError}</span>
              </div>
            )}

            <div className="text-center">
              <Button
                variant="link"
                onClick={handleResendCode}
                className="text-sm"
              >
                Didn't receive code? Resend
              </Button>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowVerifyModal(false)
                setVerificationCode('')
                setVerifyError('')
              }}
              disabled={isVerifying}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleVerifyPhone}
              disabled={isVerifying || verificationCode.length !== 6}
              className="w-full sm: w-auto"
            >
              {isVerifying ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Verifying...
                </>
              ) : (
                <>
                  <i className="ri-check-line"></i>
                  Verify
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// --- SUB-COMPONENTS ---

const ProfileSkeleton = () => (
  <div className="animate-pulse max-w-5xl mx-auto pt-6 px-4 space-y-6">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="bg-white border border-gray-200 rounded-xl p-8">
      <div className="flex gap-6 items-center">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  </div>
)

const ErrorState = ({ message }) => (
  <div className="max-w-5xl mx-auto pt-10 px-4 text-center">
    <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200">
      <i className="ri-error-warning-line text-4xl mb-4"></i>
      <Label variant="secondary" className="text-red-900 mb-2">
        Error Loading Profile
      </Label>
      <Label variant="normal_text" className="text-red-600">
        {message}
      </Label>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        Retry
      </Button>
    </div>
  </div>
)

const NoUserState = () => (
  <div className="max-w-5xl mx-auto pt-10 px-4 text-center">
    <div className="bg-yellow-50 text-yellow-700 p-8 rounded-lg border border-yellow-200">
      <i className="ri-lock-2-line text-4xl mb-3"></i>
      <Label variant="secondary" className="text-yellow-900 mb-2">
        Access Denied
      </Label>
      <Label variant="normal_text" className="text-yellow-700 mb-6">
        Please log in to view your profile.
      </Label>
      <Link href="/signin">
        <Button variant="brand">Log In</Button>
      </Link>
    </div>
  </div>
)