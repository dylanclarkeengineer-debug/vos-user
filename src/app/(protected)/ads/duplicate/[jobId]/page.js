'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { use } from 'react'

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
import { Badge } from '@/components/ui/badge'

import 'remixicon/fonts/remixicon.css'

import { getAllCategories, createNewJobByUser, getSingleJobPostAuthorize } from '@/utils/ads/adsHandlers'
import { useAuth } from '@/context/authContext'
import { API_ROUTES } from '@/constants/apiRoute'
import { INITIAL_FORM_STATE, PLATFORM_DOMAINS } from '@/constants/ads/initialStates'
import { validateSocialLink } from '@/utils/ads/checkMediaLink'
import { validateImages } from '@/utils/ads/validateImage';
import { ADS_STYLES } from '@/constants/ads/styleConstants';
import LocationAutoComplete from '@/components/location/LocationAutoComplete';

import ScrollSpyNavigation from '@/components/ads/ScrollSpyNavigation'
import { SALARY_UNITS } from '@/constants/ads/salaryConstants'
import { normalizeToHourly, generateSalaryText, buildSalaryPayload } from '@/utils/ads/salaryUtils'
import PostSuccessModal from '@/components/ads/PostSuccessModal'

// Import business handler to fetch user's businesses for the related-business field
import businessHandlers from '@/utils/business/businessHandlers'

export default function CreateAdsPage({
    params
}) {
    const router = useRouter()
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [successData, setSuccessData] = useState(null)
    const [isCopied, setIsCopied] = useState(false)
    const [addressInfo, setAddressInfo] = useState(null);

    // publish enable state (driven by ScrollSpy via onValidationChange)
    const [allValid, setAllValid] = useState(false);

    // New:   error message state for UI banner
    const [errorMessage, setErrorMessage] = useState(null);

    // Ads fetch states
    const [adsData, setAdsData] = useState(null)
    const [adsLoading, setAdsLoading] = useState(false)
    const [adsError, setAdsError] = useState(null)

    // Lấy token từ cookie (client-side)
    const token = Cookies.get('vos_token')

    // Unwrap params (React.use) per Next guidance. `use(params)` accepts a Promise or plain object.
    const resolvedParams = use(params) || {}
    const jobId = resolvedParams?.jobId || resolvedParams?.id || null

    // Để lưu trữ trường salary - UPDATED with negotiable
    const [salaryData, setSalaryData] = useState({
        type: 'range',
        min: '',
        max: '',
        amount: '',
        unit: 'hourly',
        currency: 'USD',
        negotiable: false, // NEW FIELD
    })

    const [formData, setFormData] = useState({
        ...INITIAL_FORM_STATE,
        authorName: user?.name || '',
        contactEmail: user?.email || '',
    })

    const [socialLinks, setSocialLinks] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [images, setImages] = useState([])

    // Related business helpers
    const [userBusinesses, setUserBusinesses] = useState([])
    const [businesssLoading, setBusinesssLoading] = useState(false)
    const [relatedQuery, setRelatedQuery] = useState('')
    const [relatedSuggestionsVisible, setRelatedSuggestionsVisible] = useState(false)
    const relatedRef = useRef(null)

    const getPlatformKeyFromRaw = (rawKey) => {
        if (!rawKey) return ''
        const rk = String(rawKey).trim().toLowerCase()

        // tìm exact case-insensitive match với keys của PLATFORM_DOMAINS
        const matchKey = Object.keys(PLATFORM_DOMAINS).find(k => k.toLowerCase() === rk)
        if (matchKey) return matchKey

        // nếu payload có domain hoặc phần của domain (ví dụ 'instagram.com' hoặc 'instagram'), thử match trên values
        const matchByValue = Object.keys(PLATFORM_DOMAINS).find(k => {
            const vals = PLATFORM_DOMAINS[k]
            if (Array.isArray(vals)) {
                return vals.some(v => v.toLowerCase().includes(rk) || rk.includes(v.toLowerCase()))
            }
            return String(vals).toLowerCase().includes(rk) || rk.includes(String(vals).toLowerCase())
        })
        if (matchByValue) return matchByValue

        // fallback: capitalise (giữ backward compatibility)
        return rawKey.charAt(0).toUpperCase() + rawKey.slice(1)
    }

    // --- Fetch single job when there's a jobId in params ---
    useEffect(() => {
        if (!jobId) return

        let mounted = true
        const fetchJob = async () => {
            setAdsLoading(true)
            setAdsError(null)
            try {
                // call handler with id and token (Authorization: Bearer <token>)
                const res = await getSingleJobPostAuthorize({ id: jobId, country: 'US', token })
                if (!mounted) return
                setAdsData(res)

                // Map response into local form state if available
                const job = res?.jobDetail || res?.data || res || null
                if (job && typeof job === 'object') {
                    // normalize label mapping
                    const normalizeLabel = (raw) => {
                        if (!raw) return 'active'
                        const r = String(raw).toLowerCase().trim()
                        if (r === 'deactive' || r === 'inactive' || r === 'private') return 'private'
                        return 'active'
                    }

                    // Normalize position: replace newlines with comma + space, trim extra commas/spaces
                    const normalizePosition = (rawPos) => {
                        if (!rawPos) return ''
                        return String(rawPos)
                            .replace(/\r?\n+/g, ', ')
                            .split(',')
                            .map(s => s.trim())
                            .filter(Boolean)
                            .join(', ')
                    }

                    // Normalize fullAddress (preserve as-is but trim)
                    const normalizeFullAddress = (addr) => {
                        if (!addr) return ''
                        return String(addr).replace(/\r?\n+/g, ', ').replace(/\s+,/g, ',').trim()
                    }

                    setFormData(prev => ({
                        ...prev,
                        title: job.title ?? prev.title,
                        // normalize position/newlines -> "Bán, nhà, hàng"
                        position: normalizePosition(job.position ?? prev.position),
                        label: normalizeLabel(job.label ?? prev.label),
                        authorName: job.contact_info?.author ?? prev.authorName,
                        contactEmail: job.contact_info?.email ?? prev.contactEmail,
                        contactPhone: job.contact_info?.phone ?? prev.contactPhone,
                        secondaryPhone: job.contact_info?.secondary_phone_number ?? prev.secondaryPhone,
                        description: job.description ?? prev.description,
                        applicantReq: job.requirement ?? prev.applicantReq,
                        showLocation: typeof job.is_show_location === 'boolean' ? (job.is_show_location ? 'yes' : 'no') : prev.showLocation,
                        showEmail: typeof job.is_show_email === 'boolean' ? (job.is_show_email ? 'yes' : 'no') : prev.showEmail,
                        showPhone: typeof job.is_show_phone_number === 'boolean' ? (job.is_show_phone_number ? 'yes' : 'no') : prev.showPhone,
                        // associated_business_id might be empty string -> store 'none' to keep consistent with UI
                        relatedBusiness: job.associated_business_id ? job.associated_business_id : 'none',
                        manualEntrySource: job.manual_entry_source ?? prev.manualEntrySource,
                        website: job.contact_info?.website ?? prev.website,
                        zipcode: job.address_info?.zipcode ?? prev.zipcode,
                        state: job.address_info?.state ?? prev.state,
                        city: job.address_info?.city ?? prev.city,
                        // Sales info (if Business)
                        bizSalePrice: job.sales_info?.asking_price ?? prev.bizSalePrice,
                        bizCashFlow: job.sales_info?.cash_flow ?? prev.bizCashFlow,
                        bizGrossRevenue: job.sales_info?.gross_revenue ?? prev.bizGrossRevenue,
                        bizLeasePrice: job.sales_info?.rent ?? prev.bizLeasePrice,
                        bizLeaseExpiration: job.sales_info?.lease_expiration ?? prev.bizLeaseExpiration,
                        bizReason: job.sales_info?.reason_for_selling ?? prev.bizReason,
                        bizEmployees: job.sales_info?.employees ?? prev.bizEmployees,
                        bizSquareFeet: job.sales_info?.square_feet ?? prev.bizSquareFeet,
                    }))

                    // Salary
                    if (job.salary && typeof job.salary === 'object') {
                        setSalaryData(prev => ({
                            ...prev,
                            type: job.salary.type ?? prev.type,
                            unit: job.salary.unit ?? prev.unit,
                            currency: job.salary.currency ?? prev.currency,
                            min: job.salary.hasOwnProperty('min') ? String(job.salary.min ?? '') : prev.min,
                            max: job.salary.hasOwnProperty('max') ? String(job.salary.max ?? '') : prev.max,
                            negotiable: job.salary.type === 'negotiable' ? true : prev.negotiable
                        }))
                    } else if (job.salary === 'negotiable' || job.salary === 'Negotiable') {
                        // handle possible string salary type
                        setSalaryData(prev => ({ ...prev, type: 'negotiable', negotiable: true }))
                    }

                    // Images (remote urls -> preview, file null)
                    if (Array.isArray(job.photos) && job.photos.length > 0) {
                        const imgs = job.photos.map((url) => ({
                            file: null,
                            preview: url,
                            isMain: job.main_photo === url
                        }))
                        if (!imgs.some(i => i.isMain) && imgs.length > 0) imgs[0].isMain = true
                        setImages(imgs)
                    } else if (job.main_photo) {
                        // fallback single main_photo
                        setImages([{ file: null, preview: job.main_photo, isMain: true }])
                    }

                    // Social links -> array
                    if (job.contact_info?.social_links && typeof job.contact_info.social_links === 'object') {
                        const links = Object.entries(job.contact_info.social_links).map(([rawKey, url]) => {
                            const platformKey = getPlatformKeyFromRaw(rawKey) // -> will be exactly one of PLATFORM_DOMAINS keys when possible
                            return {
                                platform: platformKey,
                                url,
                                error: validateSocialLink(platformKey, url)
                            }
                        })
                        setSocialLinks(links)
                    } else {
                        setSocialLinks([])
                    }

                    // Address object -> keep full structured address in addressInfo and also normalize displayed fullAddress
                    if (job.address_info && typeof job.address_info === 'object') {
                        const addr = {
                            ...job.address_info,
                            fullAddress: normalizeFullAddress(job.address_info.fullAddress)
                        }
                        setAddressInfo(addr)

                        // Keep form fields in sync (city/state/zipcode already set above)
                        setFormData(prev => ({
                            ...prev,
                            city: job.address_info.city ?? prev.city,
                            state: job.address_info.state ?? prev.state,
                            zipcode: job.address_info.zipcode ?? prev.zipcode,
                        }))
                    }

                    // category
                    if (job.category) {
                        setSelectedCategory(job.category)
                    }
                }
            } catch (err) {
                console.error('Failed to fetch single job:', err)
                if (mounted) setAdsError(err?.message || 'Failed to load job')
            } finally {
                if (mounted) setAdsLoading(false)
            }
        }

        fetchJob()
        return () => { mounted = false }
    }, [jobId, token])

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

    // Fetch user's businesses for "Related Business" dropdown/autocomplete
    useEffect(() => {
        let mounted = true
        const fetchUserBusinesses = async () => {
            if (!user?.user_id) return
            try {
                setBusinesssLoading(true)
                const res = await businessHandlers.getBusinessesByUser(user.user_id, 'us')
                if (!mounted) return
                if (res && res.success) {
                    setUserBusinesses(Array.isArray(res.businesses) ? res.businesses : [])
                } else {
                    // fallback to raw if present
                    const fallback = res?.raw?.businesses || []
                    setUserBusinesses(Array.isArray(fallback) ? fallback : [])
                }
            } catch (err) {
                console.error('Failed to load user businesses', err)
                setUserBusinesses([])
            } finally {
                if (mounted) setBusinesssLoading(false)
            }
        }

        fetchUserBusinesses()
        return () => { mounted = false }
    }, [user?.user_id])

    // Lấy category object hiện tại để suggest positions
    const currentCategoryObj = categories.find(c => (c.queryValue || c.name) === selectedCategory)

    // 🔥 AUTO-DETECT SALARY TYPE based on min/max values
    useEffect(() => {
        if (salaryData.negotiable) {
            if (salaryData.type !== 'negotiable') {
                setSalaryData(prev => ({ ...prev, type: 'negotiable' }));
            }
            return;
        }

        const min = Number(salaryData.min) || 0;
        const max = Number(salaryData.max) || 0;

        let newType = 'range';

        if (min === 0 && max > 0) {
            newType = 'upto';
        } else if (max === 0 && min > 0) {
            newType = 'starting';
        } else if (min > 0 && max > 0 && min === max) {
            newType = 'fixed';
        } else if (min > 0 && max > min) {
            newType = 'range';
        }

        if (newType !== salaryData.type) {
            setSalaryData(prev => ({ ...prev, type: newType }));
        }
    }, [salaryData.min, salaryData.max, salaryData.negotiable]);

    // Build sections list for ScrollSpy (reactively)
    const sections = useMemo(() => {
        const base = [
            { id: 'general-settings', label: 'Global Settings' },
            { id: 'basic-info', label: 'Basic Information' }
        ]

        if (selectedCategory === 'Business') {
            base.push({ id: 'sales-info', label: 'Sales Information' })
        }

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
        if (errorMessage) setErrorMessage(null);
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSalaryChange = (field, value) => {
        setSalaryData(prev => ({ ...prev, [field]: value }))
    }

    const handleLocationSelect = (data) => {
        setAddressInfo(data);

        setFormData(prev => ({
            ...prev,
            city: data.fullAddress,
            zipcode: data.zipcode || prev.zipcode,
            state: data.state || prev.state
        }));
    };

    const handlePositionSelect = (pos) => {
        const positionName = typeof pos === 'object' ? (pos.vi || pos.en) : pos

        setFormData(prev => {
            let currentPositions = prev.position
                ? prev.position.split(',').map(p => p.trim()).filter(Boolean)
                : []

            if (currentPositions.includes(positionName)) {
                currentPositions = currentPositions.filter(p => p !== positionName)
            } else {
                currentPositions.push(positionName)
            }

            return { ...prev, position: currentPositions.join(', ') }
        })
    }

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error);
    });
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)

        const validation = validateImages(images, files);
        if (!validation.isValid) {
            setErrorMessage(validation.message || 'Image validation failed.');
            e.target.value = '';
            return;
        }

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

            try {
                if (newImgs[index].preview && newImgs[index].preview.startsWith('blob:')) {
                    URL.revokeObjectURL(newImgs[index].preview);
                }
            } catch (e) { }

            const isDeletingMain = newImgs[index].isMain;

            newImgs.splice(index, 1);

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

        item[field] = value

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
            alert("Sharing is not supported on this browser.   Link copied instead.");
            handleCopyLink();
        }
    }

    const handleGoToPost = () => {
        const url = getPostUrl();
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
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

    const handleSubmit = async (e, targetStatus) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (!user || !user.user_id) { setErrorMessage("Please login first!  "); return; }

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
                imageName: img.file?.name || (typeof img.preview === 'string' ? img.preview.split('/').pop() : ''),
                imageFile: img.file ? await fileToBase64(img.file) : (img.file === null ? img.preview : ''), // if remote preview string, send as-is
                isMain: img.isMain || false
            })))

            const socialLinksObj = socialLinks.reduce((acc, curr) => {
                if (curr.platform && curr.url) acc[curr.platform.toLowerCase()] = curr.url
                return acc
            }, {})

            const salaryPayload = buildSalaryPayload(salaryData)

            const payload = {
                params: {
                    owner_id: user.user_id,
                    title: formData.title,
                    position: formData.position,
                    category: selectedCategory,
                    label: formData.label === 'private' ? 'deactive' : 'active',
                    status: targetStatus,
                    requirement: formData.applicantReq,
                    description: formData.description,

                    salary: salaryPayload.salary,
                    salary_min_norm: salaryPayload.salary_min_norm,
                    salary_max_norm: salaryPayload.salary_max_norm,

                    contact_info: {
                        author: formData.authorName,
                        phone: formData.contactPhone,
                        secondary_phone_number: formData.secondaryPhone,
                        email: formData.contactEmail,
                        social_links: socialLinksObj,
                        website: formData.website || ""
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
                    createdAt: Math.floor(Date.now() / 1000)
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
                const msg = (response && (response.message || response.error)) || "Something went wrong."
                setErrorMessage(msg)
            }
        } catch (error) {
            console.error('Submit error', error)
            const serverMsg = error?.response?.data?.message || error?.message || "Failed to create post."
            setErrorMessage(serverMsg)
        } finally {
            setIsLoading(false)
        }
    }


    // Callback to receive validations map from ScrollSpy
    const handleValidationsFromSpy = (validMap) => {
        const all = sections.length > 0 && sections.every(s => !!validMap[s.id]);
        setAllValid(all);
    };

    const onCancel = () => router.push('/dashboard');
    const onSaveDraft = () => handleSubmit(null, 'deactive');
    const onPublish = () => handleSubmit(null, 'active');

    // --- Related Business: suggestions derived from userBusinesses and relatedQuery
    const filteredRelatedSuggestions = useMemo(() => {
        if (!relatedQuery) return userBusinesses.slice(0, 8)
        const q = relatedQuery.toLowerCase().trim()
        return userBusinesses.filter(b => {
            const name = (b.name || '').replace(/\n/g, ' ').toLowerCase()
            const slug = (b.slug || '').toLowerCase()
            const city = (b.address_info?.city || '').toLowerCase()
            return name.includes(q) || slug.includes(q) || city.includes(q)
        }).slice(0, 8)
    }, [userBusinesses, relatedQuery])

    // click outside handler to hide suggestions
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (relatedRef.current && !relatedRef.current.contains(e.target)) {
                setRelatedSuggestionsVisible(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    // helper to display business name for currently selected related id
    const getRelatedBusinessDisplay = () => {
        if (!formData.relatedBusiness || formData.relatedBusiness === 'none') return ''
        const found = userBusinesses.find(b => String(b.id) === String(formData.relatedBusiness))
        return found ? (found.name || found.slug || found.id) : ''
    }

    // choose suggestion handler
    const chooseRelatedSuggestion = (biz) => {
        setFormData(prev => ({ ...prev, relatedBusiness: biz.id }))
        setRelatedQuery(biz.name?.replace(/\n/g, ' ') || '')
        setRelatedSuggestionsVisible(false)
    }

    // allow clearing selection
    const clearRelatedSelection = () => {
        setFormData(prev => ({ ...prev, relatedBusiness: 'none' }))
        setRelatedQuery('')
    }

    // --- RENDER ---
    return (
        <div className="relative flex min-h-screen">
            <PostSuccessModal
                isOpen={!!successData}
                onClose={handleCloseSuccessModal}
                successData={successData}
                formData={formData}
                mainImagePreview={mainImagePreview}
                addressInfo={addressInfo}
            />

            <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-24 space-y-4">
                    <ScrollSpyNavigation
                        sections={sections}
                        offset={100}
                        onCancel={onCancel}
                        onSaveDraft={onSaveDraft}
                        onPublish={onPublish}
                        isLoading={isLoading}
                        publishEnabled={allValid}
                        onValidationChange={handleValidationsFromSpy}
                    />
                </div>
            </aside>

            <div className="flex-1 min-w-0">
                <div className="mx-auto max-w-4xl px-6 py-8">
                    <form className="space-y-6">

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

                        {/* GLOBAL SETTINGS */}
                        <div id="general-settings" className={`${ADS_STYLES.SECTION_CONTAINER} scroll-mt-24`}>
                            <h2 className="mb-6 text-xl font-bold text-gray-900">General Settings</h2>
                            <div className={ADS_STYLES.GRID_LAYOUT}>
                                <div className="space-y-2">
                                    <Label variant="normal_text">Status<span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData.label}
                                        onValueChange={(val) => handleInputChange('label', val)}
                                    >
                                        <SelectTrigger className="w-full border-gray-300 bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Trường 2: Show Email */}
                                <div className="space-y-2">
                                    <Label variant="normal_text">Show Email on Post?</Label>
                                    <Select value={formData.showEmail} onValueChange={(val) => handleInputChange('showEmail', val)}>
                                        <SelectTrigger className="w-full border-gray-300 bg-white"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                                    </Select>
                                </div>

                                {/* Trường 3: Show Phone */}
                                <div className="space-y-2">
                                    <Label variant="normal_text">Show Phone Number on Post?</Label>
                                    <Select value={formData.showPhone} onValueChange={(val) => handleInputChange('showPhone', val)}>
                                        <SelectTrigger className="w-full border-gray-300 bg-white"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                                    </Select>
                                </div>

                            </div>
                        </div>

                        {/* BASIC INFO */}
                        <div id="basic-info" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
                            {/* Section Header */}
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <Label variant="primary">Basic Information</Label>
                                <Label variant="normal_text" className="mt-1">
                                    Provide the main details about your listing.
                                </Label>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md: grid-cols-2">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label variant="form">
                                        Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        mode="edit"
                                        placeholder="Enter a descriptive title"
                                        className="w-full"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        required
                                    />
                                    <Label variant="normal_text">Min 10 characters</Label>
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label variant="form">
                                        Category <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={selectedCategory}
                                        onValueChange={(val) => {
                                            setSelectedCategory(val);
                                            handleInputChange('position', '');
                                        }}
                                    >
                                        <SelectTrigger className="w-full h-auto py-2.5">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>

                                        <SelectContent className="max-h-[300px]">
                                            {categories.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.queryValue || cat.name}
                                                    className="h-auto py-3 cursor-pointer"
                                                >
                                                    <div className="flex flex-col text-left w-full gap-0.5">
                                                        <span className="font-bold text-sm text-gray-900">
                                                            {cat.name}
                                                        </span>
                                                        {cat.engName && (
                                                            <span className="text-xs text-gray-500 opacity-80">
                                                                {cat.engName}
                                                            </span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Position / Sub-Title */}
                                <div className="space-y-2">
                                    <Label variant="form">Position / Sub-Title</Label>
                                    <Input
                                        mode="edit"
                                        placeholder="Enter or select position"
                                        className="w-full"
                                        value={formData.position}
                                        onChange={(e) => handleInputChange('position', e.target.value)}
                                    />
                                    {currentCategoryObj?.positions_suggestion && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {currentCategoryObj.positions_suggestion.map((pos, idx) => {
                                                const label = typeof pos === 'object' ? pos.vi : pos;
                                                const isSelected = formData.position
                                                    .split(',')
                                                    .map(s => s.trim())
                                                    .includes(label);

                                                return (
                                                    <span
                                                        key={idx}
                                                        onClick={() => handlePositionSelect(pos)}
                                                        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors border ${isSelected
                                                            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                                            : 'bg-gray-100 text-gray-600 border-transparent hover:bg-blue-100 hover:text-blue-700'
                                                            }`}
                                                    >
                                                        {label}
                                                        {isSelected && <i className="ri-check-line ml-1"></i>}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Author Name */}
                                <div className="space-y-2">
                                    <Label variant="form">Author Name</Label>
                                    <Input
                                        mode="edit"
                                        placeholder="Your name"
                                        className="w-full"
                                        value={formData.authorName}
                                        onChange={(e) => handleInputChange('authorName', e.target.value)}
                                    />
                                </div>

                                {/* Description - Full width */}
                                <div className="col-span-1 space-y-2 md:col-span-2">
                                    <Label variant="form">
                                        Description <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        placeholder="Provide detailed information about your post..."
                                        className="min-h-[120px] w-full"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <Label variant="normal_text">Min 30 characters</Label>
                                    </div>
                                </div>

                                {/* SALARY INFORMATION */}
                                <div id="salary-info" className="col-span-1 md:col-span-2 space-y-4 pt-4">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div>
                                            <Label variant="secondary">Salary Information</Label>
                                            <Label variant="normal_text" className="mt-1">
                                                Optional - Auto-detected based on input
                                            </Label>
                                        </div>

                                        {/* Negotiable Checkbox */}
                                        <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={salaryData.negotiable}
                                                onChange={(e) => setSalaryData(prev => ({
                                                    ...prev,
                                                    negotiable: e.target.checked
                                                }))}
                                                className="w-4 h-4 rounded border-gray-300"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Negotiable</span>
                                        </label>
                                    </div>

                                    {/* Salary Inputs Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left:  Min/Max Range */}
                                        <div className="flex items-end gap-3">
                                            <div className="flex-1 space-y-2">
                                                <Label variant="title">Min</Label>
                                                <Input
                                                    mode="edit"
                                                    type="number"
                                                    placeholder="From"
                                                    className="w-full"
                                                    value={salaryData.min}
                                                    onChange={(e) => handleSalaryChange('min', e.target.value)}
                                                    disabled={salaryData.negotiable}
                                                    min="0"
                                                />
                                            </div>

                                            <span className="text-gray-400 font-bold mb-2">—</span>

                                            <div className="flex-1 space-y-2">
                                                <Label variant="title">Max</Label>
                                                <Input
                                                    mode="edit"
                                                    type="number"
                                                    placeholder="To"
                                                    className="w-full"
                                                    value={salaryData.max}
                                                    onChange={(e) => handleSalaryChange('max', e.target.value)}
                                                    disabled={salaryData.negotiable}
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        {/* Right: Currency & Period */}
                                        <div className="flex items-end gap-3">
                                            <div className="w-1/3 space-y-2">
                                                <Label variant="title">Currency</Label>
                                                <Select
                                                    value={salaryData.currency}
                                                    onValueChange={(val) => handleSalaryChange('currency', val)}
                                                    disabled={salaryData.negotiable}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                        <SelectItem value="VND">VND</SelectItem>
                                                        <SelectItem value="EUR">EUR</SelectItem>
                                                        <SelectItem value="GBP">GBP</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="w-2/3 space-y-2">
                                                <Label variant="title">Period</Label>
                                                <Select
                                                    value={salaryData.unit}
                                                    onValueChange={(val) => handleSalaryChange('unit', val)}
                                                    disabled={salaryData.negotiable}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {SALARY_UNITS.map((u) => (
                                                            <SelectItem key={u.value} value={u.value}>
                                                                {u.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Salary Preview */}
                                    {!salaryData.negotiable && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <i className="ri-eye-line text-gray-400"></i>
                                            <Label variant="normal_text">Preview:</Label>
                                            <span className="font-bold text-gray-900">
                                                {generateSalaryText(salaryData) || 'Not specified'}
                                            </span>
                                            <span className="text-[10px] uppercase text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded bg-gray-50">
                                                {salaryData.type}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Applicant Requirements */}
                                <div className="col-span-1 space-y-2 md:col-span-2">
                                    <Label variant="form">Applicant Requirements</Label>
                                    <Textarea
                                        placeholder="List requirements for applicants..."
                                        className="min-h-[100px] w-full"
                                        value={formData.applicantReq}
                                        onChange={(e) => handleInputChange('applicantReq', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* PART 2: SALES INFO (OPTIONAL - BUSINESS ONLY) */}
                        {selectedCategory === 'Business' && (
                            <div id="sales-info" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm animate-fade-in scroll-mt-24">
                                {/* Section Header */}
                                <div className="mb-6 border-b border-gray-100 pb-4">
                                    <Label variant="primary">Sales Information</Label>
                                    <Label variant="normal_text" className="mt-1">
                                        Define the transfer price, deposit amount, and payment conditions.
                                    </Label>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md: grid-cols-2">
                                    {/* Asking Price */}
                                    <div className="space-y-2">
                                        <Label variant="form">Asking Price ($)</Label>
                                        <Input
                                            mode="edit"
                                            type="number"
                                            placeholder="50000"
                                            className="w-full"
                                            value={formData.bizSalePrice}
                                            onChange={(e) => handleInputChange('bizSalePrice', e.target.value)}
                                        />
                                    </div>

                                    {/* Gross Revenue */}
                                    <div className="space-y-2">
                                        <Label variant="form">Gross Revenue ($)</Label>
                                        <Input
                                            mode="edit"
                                            type="number"
                                            placeholder="Annual Revenue"
                                            className="w-full"
                                            value={formData.bizGrossRevenue}
                                            onChange={(e) => handleInputChange('bizGrossRevenue', e.target.value)}
                                        />
                                    </div>

                                    {/* Cash Flow */}
                                    <div className="space-y-2">
                                        <Label variant="form">Cash Flow ($)</Label>
                                        <Input
                                            mode="edit"
                                            type="text"
                                            placeholder="Annual Cash Flow"
                                            className="w-full"
                                            value={formData.bizCashFlow}
                                            onChange={(e) => handleInputChange('bizCashFlow', e.target.value)}
                                        />
                                    </div>

                                    {/* Monthly Rent */}
                                    <div className="space-y-2">
                                        <Label variant="form">Monthly Rent ($)</Label>
                                        <Input
                                            mode="edit"
                                            type="number"
                                            placeholder="2000"
                                            className="w-full"
                                            value={formData.bizLeasePrice}
                                            onChange={(e) => handleInputChange('bizLeasePrice', e.target.value)}
                                        />
                                    </div>

                                    {/* Employees */}
                                    <div className="space-y-2">
                                        <Label variant="form">Number of Employees</Label>
                                        <Input
                                            mode="edit"
                                            type="number"
                                            placeholder="e.g.  5"
                                            className="w-full"
                                            value={formData.bizEmployees}
                                            onChange={(e) => handleInputChange('bizEmployees', e.target.value)}
                                        />
                                    </div>

                                    {/* Square Feet */}
                                    <div className="space-y-2">
                                        <Label variant="form">Square Feet</Label>
                                        <Input
                                            mode="edit"
                                            type="number"
                                            placeholder="e. g. 2000"
                                            className="w-full"
                                            value={formData.bizSquareFeet}
                                            onChange={(e) => handleInputChange('bizSquareFeet', e.target.value)}
                                        />
                                    </div>

                                    {/* Lease Expiration */}
                                    <div className="space-y-2">
                                        <Label variant="form">Lease Expiration</Label>
                                        <Input
                                            mode="edit"
                                            type="date"
                                            className="w-full"
                                            value={formData.bizLeaseExpiration}
                                            onChange={(e) => handleInputChange('bizLeaseExpiration', e.target.value)}
                                        />
                                    </div>

                                    {/* Reason for Selling - Full width */}
                                    <div className="col-span-1 space-y-2 md:col-span-2">
                                        <Label variant="form">Reason for Selling</Label>
                                        <Textarea
                                            placeholder="Explain why you're selling..."
                                            className="min-h-[100px] w-full"
                                            value={formData.bizReason}
                                            onChange={(e) => handleInputChange('bizReason', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PART 3: ADMIN/MODERATOR ONLY */}
                        {(user?.role === 'admin' || user?.role === 'moderator') && (
                            <div id="admin-controls" className="rounded-lg border border-blue-100 bg-blue-50/50 p-6 shadow-sm scroll-mt-24">
                                <div className="mb-4 border-b border-blue-200 pb-2">
                                    <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                                        <i className="ri-admin-line"></i> Admin Controls
                                    </h2>
                                </div>
                                <div className="space-y-2">
                                    <Label className={ADS_STYLES.LABEL}>Manual Entry Source (URL)</Label>
                                    <Input placeholder="https://example.com/source-post" className={ADS_STYLES.INPUT_BASE} value={formData.manualEntrySource} onChange={(e) => handleInputChange('manualEntrySource', e.target.value)} />
                                    <p className="text-xs text-blue-600">Link to the original source if manually entered. </p>
                                </div>
                            </div>
                        )}

                        {/* LOCATION & CONTACT */}
                        <div id="location-contact" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
                            {/* Section Header */}
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <Label variant="primary">Location & Contact</Label>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md: grid-cols-2">
                                {/* Show Location */}
                                <div className="space-y-2">
                                    <Label variant="form">Show Location? </Label>
                                    <Select
                                        value={formData.showLocation}
                                        onValueChange={(val) => handleInputChange('showLocation', val)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Contact Email */}
                                <div className="space-y-2">
                                    <Label variant="form">
                                        Contact Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        mode="edit"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full"
                                        value={formData.contactEmail}
                                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Contact Phone */}
                                <div className="space-y-2">
                                    <Label variant="form">
                                        Contact Phone <span className="text-red-500">*</span>
                                    </Label>
                                    <PhoneInput
                                        defaultCountry="US"
                                        placeholder="(555) 123-4567"
                                        className="w-full"
                                        value={formData.contactPhone}
                                        onChange={(value) => {
                                            if (value && value.length > 12) return;
                                            handleInputChange('contactPhone', value);
                                        }}
                                        required
                                    />
                                </div>

                                {/* Secondary Phone */}
                                <div className="space-y-2">
                                    <Label variant="form">Secondary Phone (Optional)</Label>
                                    <PhoneInput
                                        defaultCountry="US"
                                        placeholder="(555) 987-6543"
                                        className="w-full"
                                        value={formData.secondaryPhone}
                                        onChange={(value) => {
                                            if (value && value.length > 12) return;
                                            handleInputChange('secondaryPhone', value);
                                        }}
                                    />
                                </div>

                                {/* Location Autocomplete */}
                                <div className="space-y-2">
                                    <LocationAutoComplete
                                        selectedState={formData.state}
                                        value={formData.city}
                                        onChange={(val) => handleInputChange('city', val)}
                                        onLocationSelect={handleLocationSelect}
                                    />
                                </div>

                                {/* Zip Code */}
                                <div className="space-y-2">
                                    <Label variant="form">Zip Code</Label>
                                    <Input
                                        mode="edit"
                                        placeholder="90210"
                                        className="w-full"
                                        value={formData.zipcode}
                                        onChange={(e) => handleInputChange('zipcode', e.target.value)}
                                    />
                                </div>

                                {/* Website */}
                                <div className="space-y-2">
                                    <Label variant="form">Website</Label>
                                    <Input
                                        mode="edit"
                                        type="url"
                                        placeholder="https://yourwebsite.com"
                                        className="w-full"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Social Media Links Section */}
                            <div className="mt-6 border-t border-gray-100 pt-6">
                                {/* Social Links Header */}
                                <div className="mb-4 flex flex-row items-center justify-between">
                                    <Label variant="secondary">Social Media Links</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addSocialLink}
                                        disabled={socialLinks.length >= Object.keys(PLATFORM_DOMAINS).length}
                                    >
                                        <i className="ri-add-line mr-1"></i>
                                        {socialLinks.length >= Object.keys(PLATFORM_DOMAINS).length ? 'All Added' : 'Add Link'}
                                    </Button>
                                </div>

                                {/* Empty State */}
                                {socialLinks.length === 0 && (
                                    <Label variant="normal_text" className="italic block mb-2">
                                        No social links added yet (Facebook, Instagram, etc.).
                                    </Label>
                                )}

                                {/* Social Links List */}
                                {socialLinks.map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-1 mb-3">
                                        <div className="flex gap-2">
                                            {/* Platform Selector */}
                                            <Select
                                                value={item.platform}
                                                onValueChange={(v) => updateSocialLink(idx, 'platform', v)}
                                            >
                                                <SelectTrigger className="w-[130px]">
                                                    <SelectValue placeholder="Platform" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.keys(PLATFORM_DOMAINS)
                                                        .filter(p => {
                                                            const isSelectedByOthers = socialLinks.some(
                                                                (link, linkIdx) => linkIdx !== idx && link.platform === p
                                                            );
                                                            return !isSelectedByOthers;
                                                        })
                                                        .map(p => (
                                                            <SelectItem key={p} value={p}>
                                                                {p}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>

                                            {/* URL Input */}
                                            <Input
                                                mode="edit"
                                                value={item.url}
                                                onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                                                placeholder={`Paste ${item.platform || 'social'} link... `}
                                                className={`flex-1 ${item.error ? 'border-red-500 focus-visible: ring-red-200' : ''}`}
                                                onKeyDown={(e) => {
                                                    // Prevent Enter from submitting the whole form — just treat Enter as no-op here.
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />

                                            {/* Remove Button */}
                                            <Button
                                                type="button"
                                                variant="icon-destructive"
                                                size="icon-sm"
                                                onClick={() => removeSocialLink(idx)}
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </Button>
                                        </div>

                                        {/* Error Message */}
                                        {item.error && (
                                            <Label variant="normal_text" className="text-red-500 ml-[138px] animate-in fade-in">
                                                {item.error}
                                            </Label>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RELATED BUSINESS */}
                        <div id="related-business" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
                            {/* Section Header */}
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <Label variant="primary">Related Business</Label>
                            </div>

                            <div className="space-y-2">
                                <Label variant="form">Link to Existing Business (Optional)</Label>

                                {/* Input with suggestions */}
                                <div ref={relatedRef} className="relative">
                                    <Input
                                        mode="edit"
                                        placeholder={businesssLoading ? 'Loading your businesses...' : 'Type to search your businesses or select...'}
                                        className="w-full"
                                        value={relatedQuery || getRelatedBusinessDisplay()}
                                        onChange={(e) => {
                                            setRelatedQuery(e.target.value)
                                            setRelatedSuggestionsVisible(true)
                                            // if typing, clear selected id until user picks suggestion
                                            setFormData(prev => ({ ...prev, relatedBusiness: 'none' }))
                                        }}
                                        onFocus={() => setRelatedSuggestionsVisible(true)}
                                    />

                                    {/* Clear button when a selection exists */}
                                    {formData.relatedBusiness && formData.relatedBusiness !== 'none' && (
                                        <button
                                            type="button"
                                            onClick={clearRelatedSelection}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-neutral-500 hover:text-neutral-800"
                                        >
                                            Clear
                                        </button>
                                    )}

                                    {/* Suggestions dropdown */}
                                    {relatedSuggestionsVisible && (
                                        <div className="absolute z-50 mt-1 w-full max-h-56 overflow-auto rounded-md border bg-white shadow-sm">
                                            <div className="py-1 text-xs text-neutral-500 px-3">
                                                {businesssLoading ? 'Loading...' : (filteredRelatedSuggestions.length ? `${filteredRelatedSuggestions.length} result(s)` : 'No results')}
                                            </div>
                                            {filteredRelatedSuggestions.map((b) => (
                                                <button
                                                    key={b.id}
                                                    type="button"
                                                    onClick={() => chooseRelatedSuggestion(b)}
                                                    className="block w-full text-left px-3 py-2 hover:bg-gray-50"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-sm">{(b.name || b.slug || b.id).replace(/\n/g, ' ')}</div>
                                                            <div className="text-[11px] text-neutral-500">{b.address_info?.city?.replace(/\n/g, ' ') || b.category}</div>
                                                        </div>
                                                        <div className="text-[11px] text-neutral-400">{b.slug}</div>
                                                    </div>
                                                </button>
                                            ))}
                                            {/* explicit "None" option */}
                                            <div className="border-t px-3 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, relatedBusiness: 'none' }))
                                                        setRelatedQuery('')
                                                        setRelatedSuggestionsVisible(false)
                                                    }}
                                                    className="text-xs text-neutral-600 hover:text-neutral-900"
                                                >
                                                    Clear selection / None
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Label variant="normal_text">
                                    Connect this post to one of your business profiles for automatic linking.
                                </Label>
                            </div>
                        </div>

                        {/* IMAGES */}
                        <div id="images" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24">
                            {/* Section Header */}
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <Label variant="primary">Images</Label>
                                <Label variant="normal_text" className="mt-1 uppercase tracking-wider">
                                    Gallery Photos
                                </Label>
                            </div>

                            {/* Image Upload Grid */}
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
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}

                                {/* Image Preview Cards */}
                                {images.map((img, i) => (
                                    <div
                                        key={i}
                                        className={`relative h-32 w-32 rounded-lg border overflow-hidden group transition-all ${img.isMain
                                            ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-1'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        {/* Image */}
                                        <img
                                            src={img.preview}
                                            alt={`Preview ${i + 1}`}
                                            className="h-full w-full object-cover"
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            {/* Set Cover Button (if not main) */}
                                            {!img.isMain && (
                                                <Button
                                                    variant="outline"
                                                    size="xs"
                                                    onClick={() => handleSetMainImage(i)}
                                                    className="bg-white/90 backdrop-blur-sm hover:bg-white"
                                                >
                                                    Set Cover
                                                </Button>
                                            )}

                                            {/* Main Cover Badge (if main) */}
                                            {img.isMain && (
                                                <Badge className="bg-blue-600 text-white border-none shadow-sm">
                                                    Main Cover
                                                </Badge>
                                            )}

                                            {/* Delete Button */}
                                            <Button
                                                variant="icon-destructive"
                                                size="icon-sm"
                                                onClick={() => removeImage(i)}
                                                className="rounded-full"
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </Button>
                                        </div>

                                        {/* Main Star Badge (top-left corner) */}
                                        {img.isMain && (
                                            <div className="absolute top-1 left-1 bg-blue-600 text-white rounded-full p-1 shadow-md z-10">
                                                <i className="ri-star-fill text-xs"></i>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Image Counter Footer */}
                            <div className="mt-4 flex items-center justify-between">
                                <Label variant="normal_text" className="uppercase tracking-wider">
                                    {images.length}/5 Photos Uploaded
                                </Label>
                                <Label variant="normal_text" className="uppercase tracking-wider">
                                    Max 25MB Total
                                </Label>
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
                                {isLoading ? 'Duplicating...' : 'Duplicate Post'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}