'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useAuthStore } from '@/lib/auth-store'
import { useRouter } from 'next/navigation'
import { X, Phone, ShieldCheck, Loader2, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function PhoneAuthModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const [devHint, setDevHint] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { setAuth } = useAuthStore()
  const { requestPhoneOtp, verifyPhoneOtp } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isOpen) {
      setStep('phone')
      setPhone('')
      setOtp(['', '', '', '', '', ''])
      setError('')
      setTimer(0)
      setDevHint(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [timer])

  // Focus first OTP input when step changes
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }, [step])

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number')
      return
    }

    const formatted = phone.startsWith('+') ? phone : `+91${cleaned}`

    setLoading(true)
    setError('')
    setDevHint(null)

    try {
      const result = await requestPhoneOtp(formatted)
      if (result.success) {
        setStep('otp')
        setTimer(60)
        if (result.isDevelopment && result.devOtp) {
          setDevHint(`Development Mode: Use Test Code ${result.devOtp}`)
          const digits = result.devOtp.split('').slice(0, 6)
          setOtp([...digits, ...Array(6 - digits.length).fill('')])
        }
      } else {
        setError(result.message || 'Failed to send verification code')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    const formatted = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`

    setLoading(true)
    setError('')

    try {
      const res = await verifyPhoneOtp({
        phone: formatted,
        otp: otpString,
      })

      setAuth(
        { id: res.user.id, phone: res.user.phone } as any,
        { phone: res.user.phone, role: res.user.role as any }
      )

      onClose()
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {step === 'otp' && (
              <button 
                onClick={() => setStep('phone')}
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {step === 'phone' ? 'Phone Verification' : 'Enter Verification Code'}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                {step === 'phone' ? 'Direct SMS or Development OTP' : `Sent to ${phone}`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Development Notification */}
        {devHint && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 font-mono">
            <KeyRound className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{devHint}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          /* Step 1: Phone input */
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 font-mono mb-1.5">
                Mobile Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-zinc-700 bg-zinc-800 text-zinc-300 text-xs font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ''))
                    setError('')
                  }}
                  placeholder="98765 43210"
                  autoFocus
                  className="flex-1 bg-zinc-800/60 border border-zinc-700 rounded-r-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                />
              </div>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading || phone.length < 10}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Step 2: OTP Input */
          <div className="space-y-5">
            <div>
              <label className="block text-xs text-zinc-400 font-mono mb-3 text-center">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold bg-zinc-800/80 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <button
                onClick={handleSendOTP}
                disabled={timer > 0 || loading}
                className="text-zinc-400 hover:text-amber-400 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
              >
                {timer > 0 ? `Resend code in ${timer}s` : 'Resend code'}
              </button>
              <button
                onClick={() => setStep('phone')}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Change number
              </button>
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify &amp; Continue</span>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" />
          <span>Supabase Authenticated Phone Session</span>
        </div>
      </div>
    </div>
  )
}
