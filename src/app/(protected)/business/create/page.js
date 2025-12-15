'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/authContext'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import businessHandlers from '@/utils/business/businessHandlers'
import {
  INITIAL_BUSINESS_STATE,
  DAYS_OF_WEEK,
  BUSINESS_CURRENT_STATUS,
  isValidEmail,
  isValidPhone,
} from '@/constants/business/initialStates'
import LocationAutoComplete from '@/components/location/LocationAutoComplete'
import ScrollSpyNavigation from '@/components/ads/ScrollSpyNavigation'

import 'remixicon/fonts/remixicon.css'

const PLATFORM_DOMAINS = {
  Facebook: 'facebook.com',
  Instagram: 'instagram.com',
  Twitter: 'twitter.com',
  LinkedIn: 'linkedin.com',
  YouTube: 'youtube.com',
  TikTok: 'tiktok.com',
}

const validatePayload = (payload) => {
  const errors = []

  // Check required fields
  if (!payload.user_id) errors.push('user_id is missing')
  if (!payload.params?.name) errors.push('name is missing')
  if (!payload.params?.category) errors.push('category is missing')
  if (!payload.params?.emails || payload.params.emails.length === 0) {
    errors.push('emails is missing')
  }

  // Check base64 format
  if (payload.logoFile && !payload.logoFile.startsWith('data:image/')) {
    errors.push('logoFile has invalid base64 format')
  }

  if (payload.params?.logo && !payload.params.logo.startsWith('data:image/')) {
    errors.push('params.logo has invalid base64 format')
  }

  // Check gallery images
  if (payload.params?.gallery_images) {
    payload.params.gallery_images.forEach((img, i) => {
      if (img.base64 && !img.base64.startsWith('data:image/')) {
        errors.push(`gallery_images[${i}] has invalid base64 format`)
      }
    })
  }

  return errors
}

export default function BusinessCreatePage() {
  const router = useRouter()
  const { user } = useAuth()
  const userId = user?.user_id

  const [categories, setCategories] = useState([])
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [formData, setFormData] = useState(INITIAL_BUSINESS_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [sameHoursEveryDay, setSameHoursEveryDay] = useState(false)
  const [closedDays, setClosedDays] = useState({})
  const [locationInput, setLocationInput] = useState('')
  const [images, setImages] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [allValid, setAllValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const logoInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  const sections = useMemo(() => [
    { id: 'basic-info', label: 'Basic Information' },
    { id: 'location', label: 'Location' },
    { id: 'business-hours', label: 'Business Hours' },
    { id: 'contact', label: 'Contact & Online' },
    { id: 'images', label: 'Images' },
  ], [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true)
        const data = await businessHandlers.getBusinessCategories()
        setCategories(data)
      } catch (error) {
        console.error('Failed to load categories:', error)
        setCategories([])
      } finally {
        setIsCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleChange = useCallback((field, value) => {
    if (errorMessage) setErrorMessage(null)
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errorMessage, errors])

  const handleAddressChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      address_info: { ...prev.address_info, [field]: value }
    }))
  }, [])

  const handleLocationSelect = useCallback((locationData) => {
    setFormData(prev => ({
      ...prev,
      address_info: {
        ...prev.address_info,
        address: locationData.location || locationData.fullAddress || '',
        city: locationData.city || '',
        region: locationData.state || '',
        fullAddress: locationData.fullAddress || '',
        zip: locationData.zipcode || '',
      },
      latitude: locationData.latitude || 0,
      longitude: locationData.longitude || 0,
    }))

    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.address
      delete newErrors.city
      return newErrors
    })
  }, [])

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Logo file size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logo: reader.result }))
    }
    reader.readAsDataURL(file)
  }, [])

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (images.length + files.length > 5) {
      setErrorMessage('You can only upload up to 5 images')
      e.target.value = ''
      return
    }

    const validFiles = []
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`${file.name} is too large.  Maximum size is 5MB. `)
        continue
      }
      validFiles.push(file)
    }

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => {
          const newImages = [...prev, {
            preview: reader.result,
            base64: reader.result,
            isMain: prev.length === 0,
            name: file.name
          }]
          return newImages.slice(0, 5)
        })
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ''
  }, [images.length])

  const handleSetMainImage = useCallback((index) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isMain: i === index })))
  }, [])

  const removeImage = useCallback((index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      if (prev[index].isMain && newImages.length > 0) {
        newImages[0].isMain = true
      }
      return newImages
    })
  }, [])

  const addSocialLink = useCallback(() => {
    const availablePlatforms = Object.keys(PLATFORM_DOMAINS).filter(
      p => !socialLinks.some(link => link.platform === p)
    )
    if (availablePlatforms.length === 0) return

    setSocialLinks(prev => [...prev, {
      platform: availablePlatforms[0],
      url: '',
      error: ''
    }])
  }, [socialLinks])

  const updateSocialLink = useCallback((index, field, value) => {
    setSocialLinks(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value, error: '' }

      if (field === 'url' && value) {
        const platform = updated[index].platform
        const domain = PLATFORM_DOMAINS[platform]
        if (domain && !value.includes(domain)) {
          updated[index].error = `URL must contain ${domain}`
        }
      }

      return updated
    })
  }, [])

  const removeSocialLink = useCallback((index) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleBusinessStatusChange = useCallback((status) => {
    setFormData(prev => ({
      ...prev,
      work_time: { ...prev.work_time, current_status: status }
    }))
  }, [])

  const toggleDayClosed = useCallback((dayKey) => {
    setClosedDays(prev => ({ ...prev, [dayKey]: !prev[dayKey] }))

    if (!closedDays[dayKey]) {
      setFormData(prev => ({
        ...prev,
        work_time: {
          ...prev.work_time,
          work_hours: {
            ...prev.work_time.work_hours,
            timetable: {
              ...prev.work_time.work_hours.timetable,
              [dayKey]: []
            }
          }
        }
      }))
    }
  }, [closedDays])

  const updateDayHours = useCallback((dayKey, timeString, type) => {
    const [hours, minutes] = timeString.split(':').map(Number)

    const currentSlot = formData.work_time.work_hours.timetable[dayKey][0] || {
      open: { hour: 9, minute: 0 },
      close: { hour: 17, minute: 0 }
    }

    const updatedSlot = {
      ...currentSlot,
      [type]: { hour: hours, minute: minutes }
    }

    setFormData(prev => ({
      ...prev,
      work_time: {
        ...prev.work_time,
        work_hours: {
          ...prev.work_time.work_hours,
          timetable: {
            ...prev.work_time.work_hours.timetable,
            [dayKey]: [updatedSlot]
          }
        }
      }
    }))
  }, [formData.work_time.work_hours.timetable])

  const applySameHours = useCallback((checked) => {
    setSameHoursEveryDay(checked)

    if (checked) {
      const mondayHours = formData.work_time.work_hours.timetable.monday[0]
      if (mondayHours) {
        const updatedTimetable = {}
        DAYS_OF_WEEK.forEach(day => {
          updatedTimetable[day.key] = [{ ...mondayHours }]
        })

        setFormData(prev => ({
          ...prev,
          work_time: {
            ...prev.work_time,
            work_hours: {
              ...prev.work_time.work_hours,
              timetable: updatedTimetable
            }
          }
        }))

        setClosedDays({})
      }
    }
  }, [formData.work_time.work_hours.timetable.monday])

  const formatTimeForInput = useCallback((hour, minute) => {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }, [])


  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.description.trim() || formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
    }

    if (!formData.address_info.address.trim()) {
      newErrors.address = 'Location is required'
    }

    if (!formData.address_info.city.trim()) {
      newErrors.city = 'City is required (auto-filled from location)'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number format'
    }

    if (formData.emails.length === 0 || !formData.emails[0]?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.emails[0])) {
      newErrors.email = 'Invalid email format'
    }

    if (formData.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers and hyphens'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (!userId) {
      setErrorMessage('Please log in to create a business')
      router.push('/signin')
      return
    }

    if (!validateForm()) {
      setErrorMessage('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const socialLinksObject = {}
      socialLinks.forEach(link => {
        if (link.url && !link.error) {
          socialLinksObject[link.platform.toLowerCase()] = link.url
        }
      })

      // ✅ Clean base64 strings - remove any spaces
      const cleanBase64 = (str) => {
        if (!str) return null
        return str.replace(/\s/g, '') // Remove ALL whitespace
      }

      const payload = {
        user_id: userId,
        country: 'us',
        logoFile: cleanBase64(formData.logo), // ✅ Clean spaces
        params: {
          name: formData.name.trim(),
          logo: cleanBase64(formData.logo),
          slug: formData.slug.trim() || "",
          category: formData.category,
          description: formData.description.trim(),
          business_status: formData.business_status,
          phone: formData.phone.trim(),
          social_links: socialLinksObject,
          website: formData.website?.trim() || null,
          emails: formData.emails.filter(email => email.trim() !== ''),
          address_info: {
            address: formData.address_info.address.trim(),
            city: formData.address_info.city.trim(),
            region: formData.address_info.region.trim(),
            fullAddress: formData.address_info.fullAddress.trim(),
            zip: formData.address_info.zip.trim(),
          },
          latitude: formData.latitude || 0,
          longitude: formData.longitude || 0,
          landmarks: formData.landmarks?.trim() || '',
          work_time: {
            work_hours: {
              timetable: formData.work_time.work_hours.timetable
            },
            current_status: formData.work_time.current_status
          },
          gallery_images: images.map(img => ({
            base64: cleanBase64(img.base64), // ✅ Clean spaces
            isMain: img.isMain
          }))
        }
      }

      const validationErrors = validatePayload(payload)
      if (validationErrors.length > 0) {
        console.error('❌ Payload validation failed:', validationErrors)
        setErrorMessage(`Invalid data: ${validationErrors.join(', ')}`)
        setIsSubmitting(false)
        return
      }

      console.log('📤 Cleaned Payload:', JSON.stringify(payload, null, 2))

      const result = await businessHandlers.createBusinessByUser(payload)

      console.log('✅ Server Response:', result)

      if (result.success) {
        const businessId = result.businessId || result.business_id

        alert('Business created successfully!')

        if (businessId) {
          router.push(`/business/${businessId}`)
        } else {
          router.push('/business')
        }
      } else {
        throw new Error(result.message || 'Failed to create business')
      }

    } catch (error) {
      console.error('❌ Submit Error:', error)

      let msg = 'Failed to create business.  Please try again.'

      if (error.message) {
        msg = error.message
      } else if (error.response?.data?.message) {
        msg = error.response.data.message
      } else if (error.data?.message) {
        msg = error.data.message
      }

      if (error.status) {
        msg += ` (Error ${error.status})`
      }

      setErrorMessage(msg)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = useCallback(() => {
    const draftData = {
      ...formData,
      images,
      socialLinks
    }
    localStorage.setItem('business_draft', JSON.stringify(draftData))
    alert('Draft saved!')
  }, [formData, images, socialLinks])

  const handleClearForm = useCallback(() => {
    if (confirm('Are you sure you want to clear all form data?')) {
      setFormData(INITIAL_BUSINESS_STATE)
      setLocationInput('')
      setImages([])
      setSocialLinks([])
      setClosedDays({})
      setSameHoursEveryDay(false)
      setErrors({})
    }
  }, [])

  const handleValidationsFromSpy = useCallback((validMap) => {
    const all = sections.length > 0 && sections.every(s => !!validMap[s.id])
    setAllValid(all)
  }, [sections])

  const onCancel = useCallback(() => router.push('/dashboard'), [router])
  const onPublish = useCallback(() => handleSubmit(null), [handleSubmit])

  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 space-y-4">
          <ScrollSpyNavigation
            sections={sections}
            offset={100}
            onCancel={onCancel}
            onSaveDraft={handleSaveDraft}
            onPublish={onPublish}
            isLoading={isSubmitting}
            publishEnabled={allValid}
            onValidationChange={handleValidationsFromSpy}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <form className="space-y-6">
            {/* Error Banner */}
            {errorMessage && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start justify-between">
                <div className="flex-1">
                  <strong className="block font-semibold">Error</strong>
                  <p className="mt-1">{errorMessage}</p>
                </div>
                <Button variant="ghost" onClick={() => setErrorMessage(null)} className="ml-4">
                  <i className="ri-close-line"></i>
                </Button>
              </div>
            )}

            {/* 1. BASIC INFORMATION */}
            <div id="basic-info" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <Label variant="primary">Basic Information</Label>
                <Label variant="normal_text" className="mt-1">
                  Provide the main details about your business.
                </Label>
              </div>

              <div className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label variant="form">Business Logo</Label>
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="group relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-300 bg-white p-8 text-center transition-all hover:border-gray-400 hover:bg-gray-50"
                  >
                    {formData.logo ? (
                      <div className="relative">
                        <img src={formData.logo} alt="Logo preview" className="max-h-32 object-contain" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFormData(prev => ({ ...prev, logo: null }))
                          }}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <i className="ri-close-line text-sm"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <i className="ri-image-add-line text-4xl text-gray-400 mb-2 transition-colors group-hover:text-gray-900"></i>
                        <Label variant="default" className="font-bold">Click to upload logo</Label>
                        <Label variant="normal_text" className="text-gray-400">Max 5MB.  PNG/JPG. </Label>
                      </>
                    )}
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label variant="form">Custom URL Slug</Label>
                  <Input
                    mode="edit"
                    placeholder="your-business-name"
                    className="w-full"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  />
                  <Label variant="normal_text" className="truncate">
                    Preview: .../business/{(formData.slug && formData.slug.length > 0) ? formData.slug : 'your-business-name'}
                  </Label>
                  {errors.slug && <p className="text-xs text-red-600">{errors.slug}</p>}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label variant="form">Business Name <span className="text-red-500">*</span></Label>
                    <Input
                      mode="edit"
                      placeholder="e.g.  VGC Coffee Roasters"
                      className="w-full"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                    {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label variant="form">Category <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => handleChange('category', val)}
                      disabled={isCategoriesLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={isCategoriesLoading ? "Loading..." : "Select a category"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[400px]">
                        {isCategoriesLoading ? (
                          <SelectItem value="loading" disabled>
                            <div className="flex items-center gap-2">
                              <i className="ri-loader-4-line animate-spin"></i>
                              <span>Loading...</span>
                            </div>
                          </SelectItem>
                        ) : categories.length === 0 ? (
                          <SelectItem value="empty" disabled>No categories available</SelectItem>
                        ) : (
                          categories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <div className="flex items-center justify-between w-full gap-2">
                                <span>{cat.label}</span>
                                {cat.isFeatured && (
                                  <Badge className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0 border-none">Featured</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-red-600">{errors.category}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label variant="form">Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    placeholder="Tell us about your business, mission, and what you offer..."
                    className="min-h-[120px] w-full"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    maxLength={1000}
                    required
                  />
                  <div className="flex justify-between">
                    <Label variant="normal_text">Minimum 50 characters</Label>
                    <Label variant="normal_text" className={formData.description.length > 1000 ? 'text-red-600' : ''}>
                      {formData.description.length}/1000 characters
                    </Label>
                  </div>
                  {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* 2. LOCATION */}
            <div id="location" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <Label variant="primary">Location</Label>
              </div>

              <div className="space-y-6">
                <LocationAutoComplete
                  selectedState={formData.address_info.region}
                  value={locationInput}
                  onChange={setLocationInput}
                  onLocationSelect={handleLocationSelect}
                />
                {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label variant="form">Zip Code</Label>
                    <Input
                      mode="edit"
                      placeholder="95111"
                      className="w-full"
                      value={formData.address_info.zip}
                      onChange={(e) => handleAddressChange('zip', e.target.value)}
                    />
                    <Label variant="normal_text" className="text-gray-500">Auto-filled from location</Label>
                  </div>

                  <div className="space-y-2">
                    <Label variant="form">Landmark (Optional)</Label>
                    <Input
                      mode="edit"
                      placeholder="e.g.  Lot 1, Floor 1, Building A"
                      className="w-full"
                      value={formData.landmarks}
                      onChange={(e) => handleChange('landmarks', e.target.value)}
                    />
                    <Label variant="normal_text" className="text-gray-500">Specific micro-location details</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. BUSINESS HOURS */}
            <div id="business-hours" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <Label variant="primary">Business Hours</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="same-every-day"
                    checked={sameHoursEveryDay}
                    onCheckedChange={applySameHours}
                  />
                  <label
                    htmlFor="same-every-day"
                    className="cursor-pointer text-xs font-medium text-gray-500 select-none"
                  >
                    Same hours every day
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label variant="form">Operating Status</Label>
                  <Select
                    value={formData.work_time.current_status}
                    onValueChange={handleBusinessStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CURRENT_STATUS.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <i className={status.icon}></i>
                            <span>{status.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const daySlot = formData.work_time.work_hours.timetable[day.key][0]
                    const isClosed = closedDays[day.key]

                    return (
                      <div
                        key={day.key}
                        className="flex flex-col gap-3 rounded-sm border-b border-gray-50 p-2 pb-3 transition-colors last:border-0 hover:bg-gray-50 sm:flex-row sm:items-center"
                      >
                        <div className="w-28 text-sm font-bold text-gray-900">
                          {day.label}
                        </div>
                        <div className="flex flex-1 items-center gap-4">
                          <div className="flex min-w-[80px] items-center space-x-2">
                            <Checkbox
                              id={`closed-${day.key}`}
                              checked={isClosed}
                              onCheckedChange={() => toggleDayClosed(day.key)}
                            />
                            <label
                              htmlFor={`closed-${day.key}`}
                              className="cursor-pointer text-xs font-medium text-gray-500 select-none"
                            >
                              Closed
                            </label>
                          </div>
                          <div className="flex flex-1 items-center gap-2 sm:justify-end">
                            <Input
                              type="time"
                              value={daySlot ? formatTimeForInput(daySlot.open.hour, daySlot.open.minute) : '09:00'}
                              onChange={(e) => updateDayHours(day.key, e.target.value, 'open')}
                              disabled={isClosed}
                              className="h-9 w-full sm:w-32"
                            />
                            <span className="px-1 text-xs font-medium text-gray-400">to</span>
                            <Input
                              type="time"
                              value={daySlot ? formatTimeForInput(daySlot.close.hour, daySlot.close.minute) : '18:00'}
                              onChange={(e) => updateDayHours(day.key, e.target.value, 'close')}
                              disabled={isClosed}
                              className="h-9 w-full sm:w-32"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 4. CONTACT & ONLINE */}
            <div id="contact" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <Label variant="primary">Contact & Online Presence</Label>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label variant="form">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      mode="edit"
                      placeholder="+1 (555) 000-0000"
                      className="w-full"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />
                    {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label variant="form">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      mode="edit"
                      type="email"
                      placeholder="contact@business.com"
                      className="w-full"
                      value={formData.emails[0] || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        emails: [e.target.value]
                      }))}
                      required
                    />
                    {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label variant="form">Website</Label>
                  <div className="relative">
                    <i className="ri-global-line absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"></i>
                    <Input
                      mode="edit"
                      placeholder="https://www.example.com"
                      className="w-full pl-10"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                    />
                  </div>
                </div>

                {/* Social Media Links Section */}
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <div className="mb-4 flex flex-row items-center justify-between">
                    <Label variant="secondary">Social Media Links</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSocialLink}
                      disabled={socialLinks.length >= Object.keys(PLATFORM_DOMAINS).length}
                    >
                      <i className="ri-add-line"></i>
                      {socialLinks.length >= Object.keys(PLATFORM_DOMAINS).length ? 'All Added' : 'Add Link'}
                    </Button>
                  </div>

                  {socialLinks.length === 0 && (
                    <Label variant="normal_text" className="italic block mb-2">
                      No social links added yet (Facebook, Instagram, etc.).
                    </Label>
                  )}

                  {socialLinks.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1 mb-3">
                      <div className="flex gap-2">
                        <Select
                          value={item.platform}
                          onValueChange={(v) => updateSocialLink(idx, 'platform', v)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(PLATFORM_DOMAINS)
                              .filter(p => {
                                const isSelectedByOthers = socialLinks.some(
                                  (link, linkIdx) => linkIdx !== idx && link.platform === p
                                )
                                return !isSelectedByOthers
                              })
                              .map(p => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>

                        <Input
                          mode="edit"
                          value={item.url}
                          onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                          placeholder={`Paste ${item.platform} link...`}
                          className={`flex-1 ${item.error ? 'border-red-500' : ''}`}
                        />

                        <Button
                          type="button"
                          variant="icon-destructive"
                          size="icon-sm"
                          onClick={() => removeSocialLink(idx)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      </div>

                      {item.error && (
                        <Label variant="normal_text" className="text-red-500 ml-[138px]">
                          {item.error}
                        </Label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. GALLERY IMAGES */}
            <div id="images" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <Label variant="primary">Images</Label>
                <Label variant="normal_text" className="mt-1">
                  Gallery Photos
                </Label>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {/* Add Image Button */}
                  {images.length < 5 && (
                    <label className="group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700 transition-colors">
                          <i className="ri-add-line text-lg"></i>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-600">
                          Add
                        </span>
                      </div>
                      <input
                        ref={galleryInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                      />
                    </label>
                  )}

                  {/* Image Previews */}
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className={`relative h-32 w-32 rounded-lg border overflow-hidden group transition-all ${img.isMain
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-1'
                        : 'border-gray-200'
                        }`}
                    >
                      <img
                        src={img.preview}
                        alt={`Preview ${i + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        {!img.isMain && (
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={() => handleSetMainImage(i)}
                            className="bg-white/90 backdrop-blur-sm hover:bg-white"
                          >
                            Set Cover
                          </Button>
                        )}

                        {img.isMain && (
                          <Badge className="bg-blue-600 text-white border-none shadow-sm text-[10px]">
                            Main Cover
                          </Badge>
                        )}

                        <Button
                          type="button"
                          variant="icon-destructive"
                          size="icon-sm"
                          onClick={() => removeImage(i)}
                          className="rounded-full"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      </div>

                      {img.isMain && (
                        <div className="absolute top-1 left-1 bg-blue-600 text-white rounded-full p-1 shadow-md z-10">
                          <i className="ri-star-fill text-xs"></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Label variant="normal_text" className="uppercase tracking-wider text-gray-500">
                    {images.length}/5 Photos Uploaded
                  </Label>
                  <Label variant="normal_text" className="uppercase tracking-wider text-gray-500">
                    Max 5MB per image
                  </Label>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-4">
              <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                Save Draft
              </Button>

              <Button
                type="button"
                className="min-w-[140px] bg-blue-600 text-white hover:bg-blue-700"
                onClick={onPublish}
                disabled={isSubmitting || !allValid}
              >
                {isSubmitting ? 'Creating...' : 'Create Business'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}