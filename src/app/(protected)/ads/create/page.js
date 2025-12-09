'use client'

import React, { useEffect, useState, useMemo } from 'react'
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
import { ADS_STYLES } from '@/constants/ads/styleConstants';
import LocationAutoComplete from '@/components/location/LocationAutoComplete';

import ScrollSpyNavigation from '@/components/ads/ScrollSpyNavigation' // ScrollSpy component

export default function AdsCreatePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [successData, setSuccessData] = useState(null)
  const [isCopied, setIsCopied] = useState(false)
  const [addressInfo, setAddressInfo] = useState(null);

  // publish enable state (driven by ScrollSpy via onValidationChange)
  const [allValid, setAllValid] = useState(false);

  // New:  error message state for UI banner
  const [errorMessage, setErrorMessage] = useState(null);

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


  // Build sections list for ScrollSpy (reactively)
  const sections = useMemo(() => {
    const base = [
      { id: 'general-settings', label: 'Global Settings' },
      { id: 'basic-info', label: 'Basic Information' }
    ]

    if (selectedCategory === 'Business') {
      base.push({ id: 'sales-info', label: 'Sales Information' })
    }

    // admin-only
    if (user?.role === 'admin' || user?.role === 'moderator') {
      base.push({ id: 'admin-controls', label: 'Admin Controls' })
    }

    base.push({ id: 'location-contact', label: 'Location & Contact' })
    base.push({ id: 'related-business', label: 'Related Business' })
    base.push({ id: 'images', label: 'Images' })

    return base
  }, [selectedCategory, user?.role])


  // --- HANDLERS ---
  const handleInputChange = (field, value) => {
    // clear previous error when user types
    if (errorMessage) setErrorMessage(null);
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLocationSelect = (data) => {
    // data:  Object chứa full thông tin (lat, lng, city, location name.. .) từ Google Maps
    setAddressInfo(data);

    // Đồng bộ ngược lại các trường hiển thị trong Form (để user thấy tự động điền)
    setFormData(prev => ({
      ...prev,
      city: data.fullAddress, // Hiển thị tên địa điểm cụ thể vào ô nhập (VD: Diamond Bar Center)
      zipcode: data.zipcode || prev.zipcode, // Tự điền Zipcode nếu có
      state: data.state || prev.state // Tự chọn State nếu trả về đúng mã
    }));
  };

  const handlePositionSelect = (pos) => {
    // Lấy tên hiển thị (ưu tiên tiếng Việt)
    const positionName = typeof pos === 'object' ? (pos.vi || pos.en) : pos

    setFormData(prev => {
      // 1. Tách chuỗi hiện tại thành mảng các vị trí (dựa trên dấu phẩy)
      let currentPositions = prev.position
        ? prev.position.split(',').map(p => p.trim()).filter(Boolean)
        : []

      // 2. Logic Toggle:  Nếu đã có thì xóa, chưa có thì thêm
      if (currentPositions.includes(positionName)) {
        currentPositions = currentPositions.filter(p => p !== positionName)
      } else {
        currentPositions.push(positionName)
      }

      // 3. Nối lại thành chuỗi và cập nhật state
      return { ...prev, position: currentPositions.join(', ') }
    })
  }

  // ...  (Giữ nguyên các hàm xử lý ảnh và social link cũ)
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error);
  });
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    // Validate (giữ nguyên logic cũ)
    const validation = validateImages(images, files);
    if (!validation.isValid) {
      setErrorMessage(validation.message || 'Image validation failed.');
      e.target.value = '';
      return;
    }

    // Tạo object ảnh mới
    const newImages = files.map((file, idx) => ({
      file,
      preview: URL.createObjectURL(file),
      isMain: images.length === 0 && idx === 0
    }))

    setImages(prev => [...prev, ...newImages])
    e.target.value = ''
  }

  const handleSetMainImage = (indexToSet) => {
    setImages(prev => prev.map((img, idx) => ({
      ...img,
      isMain: idx === indexToSet
    })))
  }

  const removeImage = (index) => {
    setImages(prev => {
      const newImgs = [...prev];

      // Revoke URL để tránh memory leak
      URL.revokeObjectURL(newImgs[index].preview);

      // Kiểm tra xem ảnh bị xóa có phải là Main không
      const isDeletingMain = newImgs[index].isMain;

      // Xóa ảnh
      newImgs.splice(index, 1);

      // Nếu vừa xóa ảnh Main và danh sách vẫn còn ảnh, set ảnh đầu tiên thành Main mới
      if (isDeletingMain && newImgs.length > 0) {
        newImgs[0].isMain = true;
      }

      return newImgs;
    });
  };

  const addSocialLink = () => setSocialLinks([...socialLinks, { platform: '', url: '', error: null }]);
  const mainImagePreview = images.find(img => img.isMain)?.preview || images[0]?.preview || null;

  const updateSocialLink = (index, field, value) => {
    const updated = [...socialLinks]
    const item = updated[index]

    // Cập nhật giá trị mới
    item[field] = value

    // Kiểm tra validate ngay lập tức
    const platformToCheck = field === 'platform' ? value : item.platform;
    const urlToCheck = field === 'url' ? value : item.url;

    item.error = validateSocialLink(platformToCheck, urlToCheck);

    setSocialLinks(updated)
  }

  const removeSocialLink = (i) => setSocialLinks(socialLinks.filter((_, idx) => idx !== i));


  // --- MODAL ACTIONS ---
  const getPostUrl = () => {
    if (!successData?.job_id) return '';
    return API_ROUTES.listingPage(successData.job_id);
  }

  const handleCopyLink = () => {
    const url = getPostUrl();
    if (url) {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }

  const handleShare = () => {
    const url = getPostUrl();
    if (navigator.share) {
      navigator.share({
        title: formData.title,
        text: formData.description,
        url: url,
      }).catch(console.error);
    } else {
      alert("Sharing is not supported on this browser.  Link copied instead.");
      handleCopyLink();
    }
  }

  const handleGoToPost = () => {
    const url = getPostUrl();
    if (url) window.location.href = url;
  }

  const handleCopyId = () => {
    if (successData?.job_id) {
      navigator.clipboard.writeText(successData.job_id)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const validateForm = () => {
    if (!formData.title || formData.title.length < 10) return "Title must be at least 10 characters."
    if (!formData.description || formData.description.length < 30) return "Description must be at least 30 characters."
    return null
  }

  const handleCloseSuccessModal = () => {
    setSuccessData(null);
  }

  /**
   * handleSubmit:  can be called from form submit or programmatically (e optional)
   * - If e is an event, preventDefault
   * - targetStatus: 'active' | 'deactive'
   */
  const handleSubmit = async (e, targetStatus) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!user || !user.user_id) { setErrorMessage("Please login first! "); return; }

    const error = validateForm()
    if (error) { setErrorMessage(error); return; }

    const finalAddressInfo = addressInfo ? {
      country: "US",
      location: addressInfo.location,
      fullAddress: addressInfo.fullAddress,
      state: addressInfo.state,
      city: addressInfo.city,
      zipcode: addressInfo.zipcode,
      latitude: addressInfo.latitude,
      longitude: addressInfo.longitude
    } : {
      country: "US",
      location: formData.city,
      fullAddress: `${formData.city}, ${formData.state} ${formData.zipcode}`,
      state: formData.state,
      city: formData.city,
      zipcode: formData.zipcode,
      latitude: 0,
      longitude: 0
    };

    console.log('Final Address Info:', finalAddressInfo);

    setIsLoading(true)
    setErrorMessage(null);

    try {
      const processedImages = await Promise.all(images.map(async (img) => ({
        imageName: img.file.name,
        imageFile: await fileToBase64(img.file),
        isMain: img.isMain || false
      })))

      const socialLinksObj = socialLinks.reduce((acc, curr) => {
        if (curr.platform && curr.url) acc[curr.platform.toLowerCase()] = curr.url
        return acc
      }, {})

      const payload = {
        params: {
          owner_id: user.user_id,
          title: formData.title,
          position: formData.position,
          category: selectedCategory,
          label: formData.label,
          status: targetStatus,
          requirement: formData.applicantReq,
          description: formData.description,
          contact_info: {
            author: formData.authorName,
            phone: formData.contactPhone,
            secondary_phone_number: formData.secondaryPhone,
            email: formData.contactEmail,
            social_links: socialLinksObj,
            website: ""
          },
          is_show_location: formData.showLocation === 'yes',
          is_show_email: formData.showEmail === 'yes',
          is_show_phone_number: formData.showPhone === 'yes',
          address_info: finalAddressInfo,
          sales_info: selectedCategory === 'Business' ? {
            asking_price: formData.bizSalePrice,
            cash_flow: formData.bizCashFlow,
            gross_revenue: Number(formData.bizGrossRevenue) || 0,
            rent: Number(formData.bizLeasePrice) || 0,
            lease_expiration: formData.bizLeaseExpiration,
            reason_for_selling: formData.bizReason,
            employees: Number(formData.bizEmployees) || 0,
            square_feet: Number(formData.bizSquareFeet) || 0,
          } : undefined,
          associated_business_id: formData.relatedBusiness !== 'none' ? formData.relatedBusiness : "",
          manual_entry_source: (user.role === 'admin' || user.role === 'moderator') ? formData.manualEntrySource : "",
          createdAt: Math.floor(Date.now() / 1000),
        },
        user_id: user.user_id,
        country: "US",
        imageInfo: { folderName: user.user_id, images: processedImages, removedImages: [] }
      }

      const token = Cookies.get('vos_token')
      const response = await createNewJobByUser(payload, token)

      if (response && response.success) {
        setSuccessData(response)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        // Prefer detailed server message if provided
        const msg = (response && (response.message || response.error)) || "Something went wrong."
        setErrorMessage(msg)
      }
    } catch (error) {
      console.error('Submit error', error)
      // prefer server-side message if present
      const serverMsg = error?.response?.data?.message || error?.message || "Failed to create post."
      setErrorMessage(serverMsg)
    } finally {
      setIsLoading(false)
    }
  }


  // Callback to receive validations map from ScrollSpy
  const handleValidationsFromSpy = (validMap) => {
    // sections are dynamic:  compute all true
    const all = sections.length > 0 && sections.every(s => !!validMap[s.id]);
    setAllValid(all);
  };

  // Handlers forwarded to ScrollSpy
  const onCancel = () => router.push('/dashboard');
  const onSaveDraft = () => handleSubmit(null, 'deactive');
  const onPublish = () => handleSubmit(null, 'active');

  // --- RENDER ---
  return (
    <div className="relative flex min-h-screen">
      {/* SUCCESS MODAL */}
      {successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-300">

          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

            {/* 1. Header: Icon & Title tập trung */}
            <div className="flex flex-col items-center mb-6 text-center shrink-0">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-100 shadow-sm animate-in zoom-in duration-300 delay-100">
                <i className="ri-checkbox-circle-fill text-4xl text-green-500"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Post Published! </h2>
              <p className="text-sm text-gray-500 mt-1 max-w-[80%]">
                Your ad is now live.  Use the link below to share it instantly.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-1 space-y-6">

              {/* 2. Link Sharing Section (Được làm nổi bật) */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Share Link
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-200 text-gray-600 text-sm rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={getPostUrl()}
                      readOnly
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                      <i className="ri-link"></i>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="shrink-0 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 font-medium px-4 py-2 rounded-md transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    {isCopied ? (
                      <>
                        <i className="ri-check-line text-green-600"></i> <span className="text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <i className="ri-file-copy-line"></i> Copy
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-all shadow-sm active:scale-95 w-10 h-10 flex items-center justify-center"
                    title="Share via..."
                  >
                    <i className="ri-share-forward-fill text-lg"></i>
                  </button>
                </div>
              </div>

              {/* 3. Compact Preview Card */}
              <div>
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Post Preview
                </Label>
                <div className="flex gap-4 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-default">
                  {/* Image */}
                  <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-100">
                    {mainImagePreview ? (
                      <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <i className="ri-image-line text-2xl"></i>
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 truncate pr-2 text-base">
                      {formData.title || "No Title"}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {formData.description || "No description provided."}
                    </p>

                    {/* Meta info (Location or ID) */}
                    <div className="flex items-center gap-3 mt-2">
                      {formData.city && (
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-1. 5 py-0.5 rounded flex items-center gap-1">
                          <i className="ri-map-pin-line"></i> {formData.city}
                        </span>
                      )}
                      {successData?.job_id && (
                        <span className="text-[10px] text-gray-400 font-mono">
                          #{successData.job_id.slice(-6)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 4. Footer Actions */}
            <div className="mt-8 grid grid-cols-2 gap-3 shrink-0">
              <button
                onClick={handleCloseSuccessModal}
                className="px-4 py-3 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Close
              </button>

              <button
                onClick={handleGoToPost}
                className="px-4 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group"
              >
                View Post <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LEFT SIDEBAR: ScrollSpyNavigation (fixed width, sticky position) */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-gray-200 bg-white">
        <ScrollSpyNavigation
          sections={sections}
          offset={100}
          onCancel={onCancel}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          isLoading={isLoading}
          publishEnabled={allValid}
        />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <form className="space-y-6">

            {/* Error banner */}
            {errorMessage && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start justify-between">
                <div className="flex-1">
                  <strong className="block font-semibold">Error</strong>
                  <p className="mt-1">{errorMessage}</p>
                </div>
                <button type="button" onClick={() => setErrorMessage(null)} className="ml-4 text-red-600 hover:text-red-800">
                  <i className="ri-close-line"></i>
                </button>
              </div>
            )}

            {/* GLOBAL SETTINGS */}
            <div id="general-settings" className={`${ADS_STYLES.SECTION_CONTAINER} scroll-mt-24`}>
              <h2 className="mb-6 text-xl font-bold text-gray-900">General Settings</h2>
              <div className={ADS_STYLES.GRID_LAYOUT}>
                <div className="space-y-2">
                  <Label className={ADS_STYLES.LABEL}>Status <span className="text-red-500">*</span></Label>
                  <Select value={formData.label} onValueChange={(val) => handleInputChange('label', val)}>
                    <SelectTrigger className="w-full border-gray-300 bg-white"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={ADS_STYLES.LABEL}>Show Email on Post? </Label>
                  <Select value={formData.showEmail} onValueChange={(val) => handleInputChange('showEmail', val)}>
                    <SelectTrigger className="w-full border-gray-300 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={ADS_STYLES.LABEL}>Show Phone Number on Post?</Label>
                  <Select value={formData.showPhone} onValueChange={(val) => handleInputChange('showPhone', val)}>
                    <SelectTrigger className="w-full border-gray-300 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* PART 1: BASIC INFO */}
            <div id="basic-info" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-500">Provide the main details about your listing.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className={ADS_STYLES.LABEL}>Title <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Enter a descriptive title"
                    className={ADS_STYLES.INPUT_BASE}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                  <p className="text-[10px] text-gray-400">Min 10 characters</p>
                </div>

                <div className="space-y-2">
                  <Label className={ADS_STYLES.LABEL}>Category <span className="text-red-500">*</span></Label>
                  <Select
                    onValueChange={(val) => {
                      setSelectedCategory(val);
                      handleInputChange('position', '');
                    }}
                  >
                    <SelectTrigger className={`h-auto w-full py-2.5 ${ADS_STYLES.INPUT_BASE}`}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>

                    {/* Dùng !  để ép override các giá trị mặc định */}
                    <SelectContent className="max-h-[300px] ! px-4 !py-3">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.queryValue || cat.name}
                          className="h-auto ! py-3 !px-3 items-start cursor-pointer first:pt-4 last:pb-4"
                        >
                          <div className="flex flex-col text-left w-full whitespace-normal gap-0.5">
                            <span className="font-bold text-sm text-gray-900 leading-tight">{cat.name}</span>
                            {cat.engName && (
                              <span className="text-xs font-medium text-gray-500 mt-0.5 leading-tight opacity-80">
                                {cat.engName}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={ADS_STYLES.LABEL}>Position / Sub-Title</Label>
                  <Input
                    placeholder="Enter or select position"
                    className={ADS_STYLES.INPUT_BASE + " mb-2"}
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    required={false}
                  />
                  {currentCategoryObj && currentCategoryObj.positions_suggestion && (
                    <div className="flex flex-wrap gap-2">
                      {currentCategoryObj.positions_suggestion.map((pos, idx) => {
                        const label = typeof pos === 'object' ? pos.vi : pos;
                        const isSelected = formData.position.split(',').map(s => s.trim()).includes(label);
                        return (
                          <span
                            key={idx}
                            onClick={() => handlePositionSelect(pos)}
                            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors border
                      ${isSelected
                                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                : 'bg-gray-100 text-gray-600 border-transparent hover:bg-blue-100 hover:text-blue-700'
                              }`}
                          >
                            {label} {isSelected && <i className="ri-check-line ml-1"></i>}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className={ADS_STYLES.LABEL}>Salary Range</Label>
                  <Input
                    placeholder="e.g.  $3000 - $5000"
                    className={ADS_STYLES.INPUT_BASE}
                    value={formData.priceSalary}
                    onChange={(e) => handleInputChange('priceSalary', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className={ADS_STYLES.LABEL}>Author Name</Label>
                  <Input
                    placeholder="Your name"
                    className={ADS_STYLES.INPUT_BASE}
                    value={formData.authorName}
                    onChange={(e) => handleInputChange('authorName', e.target.value)}
                  />
                </div>
                <div className="hidden md:block"></div>

                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label className={ADS_STYLES.LABEL}>Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    placeholder="Provide detailed information about your post..."
                    className={ADS_STYLES.TEXTAREA_BASE}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                  <div className="flex justify-end">
                    <span className="text-[10px] text-gray-400">Min 30 characters</span>
                  </div>
                </div>

                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label className={ADS_STYLES.LABEL}>Applicant Requirements</Label>
                  <Textarea
                    placeholder="List requirements for applicants..."
                    className={`${ADS_STYLES.TEXTAREA_BASE} min-h-[100px]`}
                    value={formData.applicantReq}
                    onChange={(e) => handleInputChange('applicantReq', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* PART 2: SALES INFO (OPTIONAL - BUSINESS ONLY) */}
            {selectedCategory === 'Business' && (
              <div id="sales-info" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm animate-fade-in scroll-mt-24">
                <div className="mb-6 border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-bold text-gray-900">Sales Information</h2>
                  <p className="text-sm text-gray-500">Define the transfer price, deposit amount, and payment conditions.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md: grid-cols-2">
                  <div className="space-y-2">
                    <Label className={ADS_STYLES.LABEL}>Asking Price ($)</Label>
                    <Input type="number" placeholder="50000" className={ADS_STYLES.INPUT_BASE} value={formData.bizSalePrice} onChange={(e) => handleInputChange('bizSalePrice', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className={ADS_STYLES.LABEL}>Gross Revenue ($)</Label>
                    <Input type="number" placeholder="Annual Revenue" className={ADS_STYLES.INPUT_BASE} value={formData.bizGrossRevenue} onChange={(e) => handleInputChange('bizGrossRevenue', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className={ADS_STYLES.LABEL}>Cash Flow ($)</Label>
                    <Input type="text" placeholder="Annual Cash Flow" className={ADS_STYLES.INPUT_BASE} value={formData.bizCashFlow} onChange={(e) => handleInputChange('bizCashFlow', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className={ADS_STYLES.LABEL}>Monthly Rent</Label>
                    <Input type="number" placeholder="2000" className={ADS_STYLES.INPUT_BASE} value={formData.bizLeasePrice} onChange={(e) => handleInputChange('bizLeasePrice', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className={ADS_STYLES.LABEL}>Employees</Label>
                    <Input type="number" placeholder="Number of employees" className={ADS_STYLES.INPUT_BASE} value={formData.bizEmployees} onChange={(e) => handleInputChange('bizEmployees', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className={ADS_STYLES.LABEL}>Square Feet</Label>
                    <Input type="number" placeholder="e.g. 2000" className={ADS_STYLES.INPUT_BASE} value={formData.bizSquareFeet} onChange={(e) => handleInputChange('bizSquareFeet', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className={ADS_STYLES.LABEL}>Lease Expiration</Label>
                    <Input type="date" className={ADS_STYLES.INPUT_BASE} value={formData.bizLeaseExpiration} onChange={(e) => handleInputChange('bizLeaseExpiration', e.target.value)} />
                  </div>
                  <div className="col-span-1 space-y-2 md:col-span-2">
                    <Label className={ADS_STYLES.LABEL}>Reason for Selling</Label>
                    <Textarea placeholder="Explain why you're selling..." className={ADS_STYLES.TEXTAREA_BASE} value={formData.bizReason} onChange={(e) => handleInputChange('bizReason', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* PART 3: ADMIN/MODERATOR ONLY */}
            {(user?.role === 'admin' || user?.role === 'moderator') && (
              <div id="admin-controls" className="rounded-lg border border-blue-100 bg-blue-50/50 p-6 shadow-sm scroll-mt-24">
                <div className="mb-4 border-b border-blue-200 pb-2">
                  <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    <i className="ri-admin-line"></i> Part 3: Admin Controls
                  </h2>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-blue-800">Manual Entry Source (URL)</Label>
                  <Input placeholder="https://example.com/source-post" className="border-blue-200 bg-white" value={formData.manualEntrySource} onChange={(e) => handleInputChange('manualEntrySource', e.target.value)} />
                  <p className="text-xs text-blue-600">Link to the original source if manually entered. </p>
                </div>
              </div>
            )}

            {/* 3. LOCATION */}
            <div id="location-contact" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Location & Contact</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Show Location? </Label>
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
                  <PhoneInput
                    defaultCountry="US"
                    placeholder="(555) 123-4567"
                    className="border-gray-300 bg-white"
                    value={formData.contactPhone}
                    onChange={(value) => {
                      if (value && value.length > 12) return;
                      handleInputChange('contactPhone', value);
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Secondary Phone (Optional)</Label>
                  <PhoneInput
                    defaultCountry="US"
                    placeholder="(555) 987-6543"
                    className="border-gray-300 bg-white"
                    value={formData.secondaryPhone}
                    onChange={(value) => {
                      if (value && value.length > 12) return;
                      handleInputChange('secondaryPhone', value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <LocationAutoComplete
                    selectedState={formData.state}
                    value={formData.city}
                    onChange={(val) => handleInputChange('city', val)}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Zip Code</Label>
                  <Input placeholder="90210" className="border-gray-300 bg-white" value={formData.zipcode} onChange={(e) => handleInputChange('zipcode', e.target.value)} />
                </div>
                <div className='space-y-2'>
                  <Label className="text-sm font-medium text-gray-700">Website</Label>
                  <Input placeholder="https://yourwebsite.com" className="border-gray-300 bg-white" value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} />
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="mb-4 flex flex-row items-center justify-between">
                  <Label className="text-sm font-bold text-gray-900">Social Media Links</Label>
                  <Button
                    type="button"
                    onClick={addSocialLink}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    disabled={socialLinks.length >= Object.keys(PLATFORM_DOMAINS).length}
                  >
                    {socialLinks.length >= Object.keys(PLATFORM_DOMAINS).length ? 'All added' : '+ Add Link'}
                  </Button>
                </div>

                {socialLinks.length === 0 && (
                  <p className="text-xs text-gray-400 italic mb-2">
                    No social links added yet (Facebook, Instagram, etc.).
                  </p>
                )}

                {socialLinks.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1 mb-3">
                    <div className="flex gap-2">
                      <Select
                        value={item.platform}
                        onValueChange={(v) => updateSocialLink(idx, 'platform', v)}
                      >
                        <SelectTrigger className="w-[130px] bg-white border-gray-300">
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(PLATFORM_DOMAINS)
                            .filter(p => {
                              const isSelectedByOthers = socialLinks.some((link, linkIdx) => linkIdx !== idx && link.platform === p);
                              return !isSelectedByOthers;
                            })
                            .map(p => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>

                      <Input
                        value={item.url}
                        onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                        placeholder={`Paste ${item.platform || 'social'} link... `}
                        className={`flex-1 bg-white border-gray-300 ${item.error ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                      />

                      <Button type="button" variant="ghost" onClick={() => removeSocialLink(idx)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 px-2">
                        <i className="ri-delete-bin-line"></i>
                      </Button>
                    </div>

                    {item.error && (
                      <span className="text-[10px] text-red-500 ml-[138px] animate-in fade-in">
                        {item.error}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. RELATED BUSINESS */}
            <div id="related-business" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
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

            {/* 5. IMAGES */}
            <div id="images" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
              <h1 className="mb-4 text-xl font-bold text-gray-900">Images</h1>
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
                  <div
                    key={i}
                    className={`relative h-32 w-32 rounded-lg border overflow-hidden group transition-all 
                      ${img.isMain ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-1' : 'border-gray-200'}`}
                  >
                    <img src={img.preview} alt={`Preview ${i}`} className="h-full w-full object-cover" />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">

                      {!img.isMain && (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(i)}
                          className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md hover:bg-blue-600 transition-colors"
                        >
                          Set Cover
                        </button>
                      )}

                      {img.isMain && (
                        <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                          Main Cover
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover: bg-red-600 transition-colors"
                      >
                        <i className="ri-delete-bin-line text-xs"></i>
                      </button>
                    </div>

                    {img.isMain && (
                      <div className="absolute top-1 left-1 bg-blue-600 text-white rounded-full p-1 shadow-md z-10">
                        <i className="ri-star-fill text-xs block"></i>
                      </div>
                    )}
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

              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, 'deactive')}
                disabled={isLoading}
              >
                Save Draft
              </Button>

              <Button
                type="button"
                className="min-w-[140px] bg-blue-600 text-white hover:bg-blue-700"
                onClick={(e) => handleSubmit(e, 'active')}
                disabled={isLoading}
              >
                {isLoading ? 'Posting...' : 'Publish Post'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}