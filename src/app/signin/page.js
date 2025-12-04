'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import 'remixicon/fonts/remixicon.css'

import { checkLoginCode, login, sendEmailCode } from '@/utils/auth/authHandlers'
import { useAuth } from '@/context/authContext'

const LoginPage = () => {
  const { login: contextLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [modalData, setModalData] = useState({ code: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [isResent, setIsResent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const router = useRouter()

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  const handleOpenCodeModal = async (e) => {
    e.preventDefault()
    setError('')
    setIsUserVerified(false)
    setIsResent(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setIsLoading(true)

    try {
      const res = await sendEmailCode(email)
      if (res && res.success) {
        if (res.is_verified) {
          setIsUserVerified(true)
        }
        setCountdown(60)
        setIsModalOpen(true)
      } else {
        setError(
          res.message || 'Failed to send verification code. Please try again.'
        )
      }
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          'An error occurred while sending the code.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return

    setError('')
    setIsLoading(true)

    try {
      const res = await sendEmailCode(email)
      if (res && res.success) {
        if (res.is_verified) {
          setIsUserVerified(true)
        }
        setIsResent(true)
        setCountdown(60)
      } else {
        alert(res.message || 'Failed to resend code.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while resending the code.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeChange = (e) => {
    const val = e.target.value
    if (/^\d*$/.test(val)) {
      setModalData({ ...modalData, code: val })
    }
  }

  const handleVerifyComplete = async (e) => {
    e.preventDefault()
    setError('')

    if (modalData.code.length !== 6) {
      alert('Please enter a 6-digit code')
      return
    }

    setIsLoading(true)

    try {
      const checkRes = await checkLoginCode(
        email,
        modalData.code,
        isUserVerified
      )

      if (checkRes && checkRes.success) {
        const loginRes = await login(email, modalData.code)

        if (loginRes && loginRes.success) {
          contextLogin(loginRes.token)
          router.push('/dashboard')
        } else {
          alert(loginRes.message || 'Login failed. Please try again.')
        }
      } else {
        alert(checkRes.message || 'Invalid verification code.')
      }
    } catch (err) {
      console.error(err)
      alert(
        err.response?.data?.message || 'An error occurred during verification.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-white font-sans text-neutral-900 selection:bg-black selection:text-white">
      <div className="relative hidden h-full w-1/2 flex-col justify-between overflow-hidden border-r border-neutral-800 bg-neutral-950 p-8 text-white lg:flex xl:p-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.05]"></div>

        <div className="relative z-10 shrink-0">
          <div className="mb-2 text-lg font-black tracking-tighter uppercase xl:text-xl">
            Viet Global Connect
          </div>
          <div className="h-1 w-8 bg-white"></div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center space-y-6 py-4 xl:space-y-10">
          <div>
            <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight xl:text-5xl">
              The All-in-One <br />{' '}
              <span className="text-neutral-500">Digital Ecosystem.</span>
            </h1>
            <p className="max-w-md text-xs leading-relaxed text-neutral-400 xl:text-sm">
              VGC is a comprehensive platform integrating editorial news,
              classified postings, and business verification.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-10">
            <div className="space-y-3">
              <h3 className="mb-3 w-fit border-b border-neutral-800 pb-2 text-[10px] font-bold tracking-widest text-neutral-500 uppercase xl:text-xs">
                Our Ecosystem
              </h3>
              <div className="grid gap-2 xl:gap-3">
                <EcosystemLink
                  icon="ri-user-smile-line"
                  label="User Portal"
                  sub="user.vgcnews24.com"
                />
                <EcosystemLink
                  icon="ri-megaphone-line"
                  label="Classifieds"
                  sub="postings.vgcnews24.com"
                />
                <EcosystemLink
                  icon="ri-building-2-line"
                  label="Business Hub"
                  sub="biz.vgcnews24.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="mb-3 w-fit border-b border-neutral-800 pb-2 text-[10px] font-bold tracking-widest text-neutral-500 uppercase xl:text-xs">
                Capabilities
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-400 xl:space-y-2 xl:text-sm">
                <FeatureItem text="Manage Classified Posts" />
                <FeatureItem text="Verify Business Profiles" />
                <FeatureItem text="Access Editorial News" />
                <FeatureItem text="Real-time Analytics" />
              </ul>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] tracking-wider text-neutral-600 uppercase">
          © 2024 VGC Corporation. All rights reserved.
        </div>
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-white px-6 py-6 lg:w-1/2 lg:px-12 lg:py-8">
        <div className="h-4 flex-none lg:h-0"></div>

        <div className="animate-in fade-in slide-in-from-bottom-8 flex w-full max-w-md flex-1 flex-col justify-center duration-700">
          <div className="mb-6 text-center lg:hidden">
            <div className="text-xl font-black tracking-tighter">
              VGC SYSTEM
            </div>
          </div>

          <div className="mb-6 text-center lg:text-left xl:mb-10">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-black lg:text-3xl xl:text-4xl">
              Welcome Back
            </h2>
            <p className="text-xs font-medium text-neutral-500 xl:text-sm">
              Please enter your credentials to access the workspace.
            </p>
          </div>

          {error && (
            <div className="animate-in fade-in slide-in-from-top-2 mb-6 flex items-start gap-3 rounded-sm border border-red-100 bg-red-50 p-3 duration-300">
              <i className="ri-error-warning-fill mt-0.5 text-sm text-red-600"></i>
              <div className="flex-1">
                <p className="text-xs leading-tight font-medium text-red-700">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form
            className="space-y-6 xl:space-y-10"
            onSubmit={handleOpenCodeModal}
          >
            <div className="group relative mt-2">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                disabled={isLoading}
                className="peer w-full border-b border-neutral-200 bg-transparent px-0 py-2 text-base font-bold text-black placeholder-transparent transition-all duration-300 focus:border-transparent focus:outline-none disabled:opacity-50 xl:py-3 xl:text-lg"
                placeholder="Email"
                required
              />
              <label
                htmlFor="email"
                className="absolute -top-2.5 left-0 text-[10px] font-bold tracking-wider text-neutral-400 uppercase transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-black"
              >
                Email Address
              </label>

              <div
                className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${error ? 'w-full bg-red-500' : 'w-0 bg-black group-focus-within:w-full'}`}
              ></div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-sm bg-black py-3 text-white transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-neutral-400 xl:py-4"
              >
                <div className="absolute inset-0 translate-y-full bg-neutral-800 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0"></div>
                <span className="relative z-10 flex items-center justify-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase xl:text-xs">
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-sm"></i>{' '}
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Sign In
                      <i className="ri-arrow-right-line transform text-sm transition-transform duration-300 group-hover:translate-x-1"></i>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>

        <div className="flex w-full max-w-md flex-none items-center justify-between pt-4 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
          <a href="#" className="transition-colors hover:text-black">
            Privacy Policy
          </a>
          <span className="text-neutral-200">•</span>
          <a href="#" className="transition-colors hover:text-black">
            Help Center
          </a>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-neutral-900/90 backdrop-blur-sm transition-opacity"
            onClick={() => !isLoading && setIsModalOpen(false)}
          ></div>

          <div className="animate-in fade-in zoom-in-95 relative w-full max-w-sm rounded-sm border border-neutral-200 bg-white px-6 py-8 shadow-2xl duration-300 md:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="absolute top-4 left-4 flex items-center gap-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase transition-colors hover:text-black disabled:opacity-50"
            >
              <i className="ri-arrow-left-s-line text-sm"></i>
              Back
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="absolute top-4 right-4 text-neutral-400 transition-colors hover:text-black disabled:opacity-50"
            >
              <i className="ri-close-line text-xl"></i>
            </button>

            <form onSubmit={handleVerifyComplete} className="mt-2">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-lg text-neutral-900">
                  <i className="ri-shield-keyhole-fill"></i>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                  Verify Identity
                </h3>
              </div>

              <div className="mb-6 flex items-start gap-3 rounded-sm border border-neutral-100 bg-neutral-50 p-3">
                <i className="ri-information-fill mt-0.5 flex-shrink-0 text-neutral-400"></i>
                <div className="text-xs leading-relaxed font-medium text-neutral-600">
                  {isResent ? (
                    <p className="mb-1 font-bold text-green-700">
                      The verification code has been resent to your email.
                    </p>
                  ) : (
                    <p className="mb-1">
                      We sent a 6-digit code to your email: Let's check <br />
                      <span className="font-bold break-all text-black">
                        {email}
                      </span>
                    </p>
                  )}
                  <p className="mt-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Check spam folder if needed.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  disabled={isLoading}
                  className="w-full rounded-none border-b-2 border-neutral-200 bg-white py-2 text-center font-mono text-2xl font-bold tracking-[0.5em] text-black placeholder-neutral-300 transition-colors outline-none focus:border-black disabled:opacity-50"
                  placeholder="••••••"
                  value={modalData.code}
                  onChange={handleCodeChange}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-sm bg-black py-3 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-lg transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-sm"></i>{' '}
                    Verifying...
                  </>
                ) : (
                  'Verify & Access'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  disabled={isLoading || countdown > 0}
                  onClick={handleResendCode}
                  className="border-b border-transparent pb-0.5 text-[10px] font-bold tracking-widest text-neutral-500 uppercase transition-all hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const EcosystemLink = ({ icon, label, sub }) => (
  <a
    href={`https://${sub}/`}
    target="_blank"
    className="group flex items-center gap-3 text-xs font-medium text-neutral-300 transition-colors hover:text-white xl:text-sm"
  >
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-neutral-800 bg-neutral-900 transition-colors group-hover:border-neutral-600 xl:h-8 xl:w-8">
      <i className={`${icon} text-xs xl:text-sm`}></i>
    </div>
    <div className="flex flex-col">
      <span>{label}</span>
      <span className="text-[10px] text-neutral-600 group-hover:text-neutral-500">
        {sub}
      </span>
    </div>
  </a>
)

const FeatureItem = ({ text }) => (
  <li className="flex items-center gap-2">
    <i className="ri-check-line text-xs text-green-500"></i> {text}
  </li>
)

export default LoginPage
