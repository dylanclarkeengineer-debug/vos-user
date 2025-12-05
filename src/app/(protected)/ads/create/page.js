'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PhoneInput } from '@/components/ui/phone-input'

import 'remixicon/fonts/remixicon.css'

import { getAllCategories, createNewJobByUser } from '@/utils/ads/adsHandlers'
import { US_STATES } from '@/constants/ads/states'
import { useAuth } from '@/context/authContext'
import { API_ROUTES } from '@/constants/apiRoute'
import { INITIAL_FORM_STATE, MOCK_USER_BUSINESSES, PLATFORM_DOMAINS } from '@/constants/ads/initialStates'
import { validateSocialLink } from '@/utils/ads/checkMediaLink'
import { validateImages } from '@/utils/ads/validateImage';

export default function AdsCreatePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [successData, setSuccessData] = useState(null)
  const [isCopied, setIsCopied] = useState(false)

  const [formData, setFormData] = useState({
    ...INITIAL_FORM_STATE,
    authorName: user?.name || '',
    contactEmail: user?.email || '',
  })

  const [socialLinks, setSocialLinks] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [images, setImages] = useState([])

  // Lấy category object hiện tại để suggest positions
  const currentCategoryObj = categories.find(c => (c.queryValue || c.name) === selectedCategory)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getAllCategories()
        if (Array.isArray(categoriesData)) setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load initial data', error)
      }
    }
    fetchData()
  }, [])


  // --- HANDLERS ---
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePositionSelect = (pos) => {
    // Nếu pos là object {en:..., vi:...} thì lấy vi hoặc en tùy ngôn ngữ, ở đây lấy chuỗi hiển thị
    const positionName = typeof pos === 'object' ? (pos.vi || pos.en) : pos
    setFormData(prev => ({ ...prev, position: positionName }))
  }

  // ... (Giữ nguyên các hàm xử lý ảnh và social link cũ: fileToBase64, handleImageChange, removeImage, social link logic...)
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error);
  });
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    // Gọi hàm kiểm tra từ file utility
    const validation = validateImages(images, files);

    // Nếu không hợp lệ, hiện thông báo và dừng lại
    if (!validation.isValid) {
      alert(validation.message);
      // Reset input để người dùng có thể chọn lại file đó nếu muốn (trường hợp chọn sai lần đầu)
      e.target.value = '';
      return;
    }

    // Nếu hợp lệ, tiến hành tạo preview và lưu vào state
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    const removeImage = (index) => {
      setImages(prev => {
        const newImages = [...prev]
        // Giải phóng URL preview để tránh leak memory
        URL.revokeObjectURL(newImages[index].preview)
        // Xóa phần tử tại vị trí index
        newImages.splice(index, 1)
        return newImages
      })
    }

    setImages(prev => [...prev, ...newImages])
    e.target.value = ''
  }
  const removeImage = (index) => {
    setImages(prev => {
      const newImgs = [...prev]; URL.revokeObjectURL(newImgs[index].preview); newImgs.splice(index, 1); return newImgs;
    });
  };

  const addSocialLink = () => setSocialLinks([...socialLinks, { platform: '', url: '', error: null }]);

  const updateSocialLink = (index, field, value) => {
    const updated = [...socialLinks]
    const item = updated[index]

    // Cập nhật giá trị mới
    item[field] = value

    // Kiểm tra validate ngay lập tức
    // Nếu field đang sửa là 'platform', ta dùng value mới làm platform, url giữ nguyên
    // Nếu field đang sửa là 'url', ta dùng platform cũ, value mới làm url
    const platformToCheck = field === 'platform' ? value : item.platform;
    const urlToCheck = field === 'url' ? value : item.url;

    item.error = validateSocialLink(platformToCheck, urlToCheck);

    setSocialLinks(updated)
  }

  const removeSocialLink = (i) => setSocialLinks(socialLinks.filter((_, idx) => idx !== i));

  const handleCopyId = () => {
    if (successData?.job_id) {
      navigator.clipboard.writeText(successData.job_id)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleGoToPost = () => {
    if (successData?.job_id) {
      window.location.href = API_ROUTES.listingPage(successData.job_id)
    }
  }

  const validateForm = () => {
    if (formData.title.length < 10) return "Title must be at least 10 characters."
    if (formData.description.length < 30) return "Description must be at least 30 characters."
    // Có thể thêm check bad words ở đây nếu có thư viện
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !user.user_id) { alert("Please login first!"); return; }

    const error = validateForm()
    if (error) { alert(error); return; }

    setIsLoading(true)

    try {
      const processedImages = await Promise.all(images.map(async (img, index) => ({
        imageName: img.file.name,
        imageFile: await fileToBase64(img.file),
        isMain: index === 0
      })))

      const socialLinksObj = socialLinks.reduce((acc, curr) => {
        if (curr.platform && curr.url) acc[curr.platform.toLowerCase()] = curr.url
        return acc
      }, {})

      const payload = {
        user_id: user.user_id,
        country: "US",
        params: {
          owner_id: user.user_id,
          // Part 1: Basic Info
          title: formData.title,
          position: formData.position,
          category: selectedCategory,
          status: formData.status, // 'active' or 'private'
          requirement: formData.applicantReq,
          description: formData.description,

          // Configs
          is_show_location: formData.showLocation === 'yes',
          is_show_email: formData.showEmail === 'yes',
          is_show_phone_number: formData.showPhone === 'yes',

          // Part 3: Admin Only Field
          manual_entry_source: (user.role === 'admin' || user.role === 'moderator') ? formData.manualEntrySource : "",

          contact_info: {
            author: formData.authorName,
            phone: formData.contactPhone,
            secondary_phone_number: formData.secondaryPhone,
            email: formData.contactEmail,
            website: "",
            social_links: socialLinksObj
          },
          address_info: {
            country: "US",
            location: formData.city,
            fullAddress: `${formData.city}, ${formData.state} ${formData.zipcode}`,
            state: formData.state,
            city: formData.city,
            zipcode: formData.zipcode,
            latitude: 0, longitude: 0
          },
          // Part 2: Sales Info (Optional)
          sales_info: selectedCategory === 'Business' ? {
            asking_price: formData.bizSalePrice,
            cash_flow: formData.bizCashFlow,
            gross_revenue: Number(formData.bizGrossRevenue) || 0,
            rent: Number(formData.bizLeasePrice) || 0, // Mapping lease price to rent
            lease_expiration: formData.bizLeaseExpiration,
            reason_for_selling: formData.bizReason,
            employees: Number(formData.bizEmployees) || 0,
            square_feet: Number(formData.bizSquareFeet) || 0,
          } : undefined,
          associated_business_id: formData.relatedBusiness !== 'none' ? formData.relatedBusiness : ""
        },
        imageInfo: { folderName: user.user_id, images: processedImages, removedImages: [] }
      }

      const token = Cookies.get('vos_token')
      const response = await createNewJobByUser(payload, token)

      if (response && response.success) {
        setSuccessData(response)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        alert("Something went wrong.")
      }
    } catch (error) {
      console.error(error)
      alert("Failed to create post.")
    } finally {
      setIsLoading(false)
    }
  }

  // --- RENDER ---
  return (
    <div className="relative min-h-screen">
      {/* SUCCESS MODAL (Giữ nguyên như cũ) */}
      {successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl md:p-8 animate-in zoom-in-95 duration-200">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <i className="ri-checkbox-circle-fill text-5xl text-green-600"></i>
            </div>
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Post Published!</h2>
              <p className="mb-6 text-sm text-gray-500">Your classified post is now live.</p>
            </div>
            <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 text-center">Job ID Reference</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-xl font-bold text-gray-800 tracking-wide">{successData.job_id}</span>
                <button onClick={handleCopyId} className="group relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-200 transition-colors">
                  {isCopied ? <i className="ri-check-line text-lg text-green-600 font-bold"></i> : <i className="ri-file-copy-line text-lg text-gray-400 group-hover:text-blue-600"></i>}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={handleGoToPost} className="w-full bg-blue-600 py-6 text-white hover:bg-blue-700 font-semibold">Go to Post <i className="ri-external-link-line ml-2"></i></Button>
              <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full border-gray-300 py-6 text-gray-700 hover:bg-gray-50">Back to Dashboard</Button>
            </div>
          </div>
        </div>
      )}

      <div className="animate-fade-in mx-auto max-w-5xl space-y-6 pt-0 pb-16">
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* GLOBAL SETTINGS */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">General Settings</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></Label>
                <Select value={formData.status} onValueChange={(val) => handleInputChange('status', val)}>
                  <SelectTrigger className="w-full border-gray-300 bg-white"><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Author Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Author Name</Label>
                <Input placeholder="Your name" className="border-gray-300 bg-white" value={formData.authorName} onChange={(e) => handleInputChange('authorName', e.target.value)} />
              </div>
              {/* Show Email */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Show Email on Post?</Label>
                <Select value={formData.showEmail} onValueChange={(val) => handleInputChange('showEmail', val)}>
                  <SelectTrigger className="w-full border-gray-300 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                </Select>
              </div>
              {/* Show Phone */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Show Phone Number on Post?</Label>
                <Select value={formData.showPhone} onValueChange={(val) => handleInputChange('showPhone', val)}>
                  <SelectTrigger className="w-full border-gray-300 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* PART 1: BASIC INFO */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
              <p className="text-sm text-gray-500">Provide the main details about your listing.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Title */}
              <div className="col-span-1 space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Title (Min 10 chars) <span className="text-red-500">*</span></Label>
                <Input placeholder="Enter a descriptive title" className="border-gray-300 bg-white" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></Label>
                <Select onValueChange={(val) => setSelectedCategory(val)}>
                  <SelectTrigger className="h-auto w-full border-gray-300 bg-white py-2.5"><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.queryValue || cat.name} className="h-auto py-3 items-start cursor-pointer">
                        <div className="flex flex-col text-left w-full whitespace-normal">
                          <span className="font-bold text-sm text-gray-900 leading-tight">{cat.name}</span>
                          {cat.engName && <span className="text-xs font-medium text-gray-500 mt-0.5 leading-tight opacity-80">{cat.engName}</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position + Suggestions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Position / Sub-Title</Label>
                <Input placeholder="e.g. Nail Technician" className="border-gray-300 bg-white mb-2" value={formData.position} onChange={(e) => handleInputChange('position', e.target.value)} />

                {/* Position Chips Suggestion */}
                {currentCategoryObj && currentCategoryObj.positions_suggestion && (
                  <div className="flex flex-wrap gap-2">
                    {currentCategoryObj.positions_suggestion.map((pos, idx) => {
                      const label = typeof pos === 'object' ? pos.vi : pos; // Ưu tiên tiếng Việt
                      return (
                        <span
                          key={idx}
                          onClick={() => handlePositionSelect(pos)}
                          className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        >
                          {label}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Salary Range (Only if not Business) */}
              {selectedCategory !== 'Business' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Salary Range</Label>
                  <Input placeholder="e.g. $3000 - $5000" className="border-gray-300 bg-white" value={formData.priceSalary} onChange={(e) => handleInputChange('priceSalary', e.target.value)} />
                </div>
              )}

              {/* Requirement */}
              <div className="col-span-1 space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Applicant Requirements</Label>
                <Textarea placeholder="List requirements..." className="min-h-[100px] resize-y border-gray-300 bg-white" value={formData.applicantReq} onChange={(e) => handleInputChange('applicantReq', e.target.value)} />
              </div>

              {/* Description */}
              <div className="col-span-1 space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Description (Min 30 chars, no bad words) <span className="text-red-500">*</span></Label>
                <Textarea placeholder="Provide detailed information..." className="min-h-[150px] resize-y border-gray-300 bg-white" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} required />
              </div>
            </div>
          </div>

          {/* PART 2: SALES INFO (OPTIONAL - BUSINESS ONLY) */}
          {selectedCategory === 'Business' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm animate-fade-in">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">Sales Information</h2>
                <p className="text-sm text-gray-500">Specific details for business opportunities.</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Asking Price ($)</Label>
                  <Input type="number" placeholder="50000" className="border-gray-300 bg-white" value={formData.bizSalePrice} onChange={(e) => handleInputChange('bizSalePrice', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Gross Revenue ($)</Label>
                  <Input type="number" placeholder="Annual Revenue" className="border-gray-300 bg-white" value={formData.bizGrossRevenue} onChange={(e) => handleInputChange('bizGrossRevenue', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Cash Flow ($)</Label>
                  <Input type="text" placeholder="Annual Cash Flow" className="border-gray-300 bg-white" value={formData.bizCashFlow} onChange={(e) => handleInputChange('bizCashFlow', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Rent ($/month)</Label>
                  <Input type="number" placeholder="2000" className="border-gray-300 bg-white" value={formData.bizLeasePrice} onChange={(e) => handleInputChange('bizLeasePrice', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Employees</Label>
                  <Input type="number" placeholder="Number of employees" className="border-gray-300 bg-white" value={formData.bizEmployees} onChange={(e) => handleInputChange('bizEmployees', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Square Feet</Label>
                  <Input type="number" placeholder="e.g. 2000" className="border-gray-300 bg-white" value={formData.bizSquareFeet} onChange={(e) => handleInputChange('bizSquareFeet', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Lease Expiration</Label>
                  <Input type="date" className="border-gray-300 bg-white" value={formData.bizLeaseExpiration} onChange={(e) => handleInputChange('bizLeaseExpiration', e.target.value)} />
                </div>
                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Reason for Selling</Label>
                  <Textarea placeholder="Explain why you're selling..." className="min-h-[80px] resize-y border-gray-300 bg-white" value={formData.bizReason} onChange={(e) => handleInputChange('bizReason', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* PART 3: ADMIN/MODERATOR ONLY */}
          {(user?.role === 'admin' || user?.role === 'moderator') && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-6 shadow-sm">
              <div className="mb-4 border-b border-blue-200 pb-2">
                <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                  <i className="ri-admin-line"></i> Part 3: Admin Controls
                </h2>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-800">Manual Entry Source (URL)</Label>
                <Input placeholder="https://example.com/source-post" className="border-blue-200 bg-white" value={formData.manualEntrySource} onChange={(e) => handleInputChange('manualEntrySource', e.target.value)} />
                <p className="text-xs text-blue-600">Link to the original source if manually entered.</p>
              </div>
            </div>
          )}

          {/* 3. LOCATION */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">Location & Contact</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Show Location?</Label>
                <Select value={formData.showLocation} onValueChange={(val) => handleInputChange('showLocation', val)}>
                  <SelectTrigger className="w-full border-gray-300 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Contact Email <span className="text-red-500">*</span></Label>
                <Input type="email" placeholder="your@email.com" className="border-gray-300 bg-white" value={formData.contactEmail} onChange={(e) => handleInputChange('contactEmail', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Contact Phone <span className="text-red-500">*</span></Label>
                <PhoneInput placeholder="(555) 123-4567" className="border-gray-300 bg-white" value={formData.contactPhone} onChange={(value) => handleInputChange('contactPhone', value)} required />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Secondary Phone (Optional)</Label>
                <PhoneInput placeholder="(555) 987-6543" className="border-gray-300 bg-white" value={formData.secondaryPhone} onChange={(value) => handleInputChange('secondaryPhone', value)} />
              </div>
              {/* Location fields */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></Label>
                <Input placeholder="City name" className="border-gray-300 bg-white" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">State <span className="text-red-500">*</span></Label>
                <Select onValueChange={(val) => handleInputChange('state', val)}>
                  <SelectTrigger className="w-full border-gray-300 bg-white"><SelectValue placeholder="Select a state" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">{US_STATES.map((st) => (<SelectItem key={st.code} value={st.code}>{st.name} ({st.code})</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Zip Code</Label>
                <Input placeholder="90210" className="border-gray-300 bg-white" value={formData.zipcode} onChange={(e) => handleInputChange('zipcode', e.target.value)} />
              </div>
            </div>
          </div>

          {/* 4. RELATED BUSINESS */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">Related Business</h2>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Link to Existing Business (Optional)</Label>
              <Select onValueChange={(val) => handleInputChange('relatedBusiness', val)}>
                <SelectTrigger className="border-gray-300 bg-white"><SelectValue placeholder="Select a business" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {MOCK_USER_BUSINESSES.map(biz => (
                    <SelectItem key={biz.id} value={biz.id}>{biz.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Connect this post to one of your business profiles.</p>
            </div>
          </div>

          {/* 5. SOCIAL MEDIA (Rút gọn hiển thị) */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Social Media</h2>
              <Button type="button" onClick={addSocialLink} variant="outline" size="sm">Add Link</Button>
            </div>

            {socialLinks.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No social links added yet.</p>
            )}

            {socialLinks.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1 mb-3">
                <div className="flex gap-2">
                  {/* Select Platform */}
                  <Select
                    value={item.platform}
                    onValueChange={(v) => updateSocialLink(idx, 'platform', v)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PLATFORM_DOMAINS).map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Input URL */}
                  <Input
                    value={item.url}
                    onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                    placeholder={`Paste ${item.platform || 'social'} link...`}
                    className={`flex-1 ${item.error ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  />

                  {/* Delete Button */}
                  <Button type="button" variant="ghost" onClick={() => removeSocialLink(idx)} className="text-gray-400 hover:text-red-500">
                    <i className="ri-delete-bin-line"></i>
                  </Button>
                </div>

                {/* Hiển thị lỗi nếu có */}
                {item.error && (
                  <span className="text-xs text-red-500 ml-[148px] animate-in fade-in slide-in-from-top-1">
                    <i className="ri-error-warning-fill mr-1"></i>
                    {item.error}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* 5. IMAGES */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-bold text-gray-500 uppercase">Gallery Photos</h2>
            <div className="flex flex-wrap gap-4">
              {images.length < 5 && (
                <label className="group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white hover:bg-gray-50 transition-colors hover:border-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors group-hover:bg-gray-200 group-hover:text-gray-700"><i className="ri-add-line text-lg"></i></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-600">Add</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                </label>
              )}
              {images.map((img, i) => (
                <div key={i} className="relative h-32 w-32 rounded-lg border border-gray-200 overflow-hidden group">
                  <img src={img.preview} alt={`Preview ${i}`} className="h-full w-full object-cover" />
                  {/* Nút Xóa Ảnh */}
                  <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-red-600">
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <span>{images.length}/5 Photos Uploaded</span>
              <span>Max 25MB Total</span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-4">
            <Link href="/dashboard"><Button type="button" variant="ghost">Cancel</Button></Link>
            <Button type="button" variant="outline">Save Draft</Button>
            <Button type="submit" className="min-w-[140px] bg-blue-600 text-white hover:bg-blue-700" disabled={isLoading}>{isLoading ? 'Posting...' : 'Publish Post'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}