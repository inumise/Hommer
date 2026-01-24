import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  Building2, Send, Check, Calendar, DollarSign, 
  Mail, Phone, MapPin, Clock, Users, Shield,
  Zap, Globe, Award
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const priceRanges = [
  '€10,000 - €25,000',
  '€25,000 - €50,000',
  '€50,000 - €100,000',
  '€100,000 - €250,000',
  '€250,000+',
]

const enterpriseFeatures = [
  { icon: Users, title: 'Dedicated Team', description: 'Full-spectrum development team assigned to your project' },
  { icon: Shield, title: 'Enterprise Security', description: 'Zero-trust architecture with compliance certifications' },
  { icon: Zap, title: 'Priority Support', description: '24/7 dedicated support with guaranteed response times' },
  { icon: Globe, title: 'Global Scale', description: 'Infrastructure designed for worldwide deployment' },
  { icon: Award, title: 'Quality Assurance', description: 'Rigorous testing and continuous improvement' },
  { icon: Clock, title: 'Agile Delivery', description: 'Iterative development with regular milestones' },
]

export default function EnterprisePage() {
  const { colors } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    priceRange: '',
    deadline: '',
    projectType: '',
    description: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
    })
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-28 pb-8 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: `${colors.primary}20` }}
          >
            <Check className="w-10 h-10" style={{ color: colors.primary }} />
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
            Request Submitted!
          </h2>
          <p className="mb-6" style={{ color: colors.textMuted }}>
            Thank you for your enterprise inquiry. Our team will review your requirements and contact you within 24 hours.
          </p>
          <button
            onClick={() => { setIsSubmitted(false); setFormData({ name: '', company: '', email: '', phone: '', priceRange: '', deadline: '', projectType: '', description: '' }) }}
            className="px-6 py-3 rounded-xl font-medium"
            style={{ background: colors.gradient, color: colors.background }}
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-6 sm:pb-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p 
            className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4"
            style={{ color: colors.textMuted }}
          >
            Enterprise Solutions
          </p>
          <h1 
            ref={titleRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-3 sm:mb-4"
            style={{ color: colors.text }}
          >
            <span 
              className="font-bold"
              style={{ 
                background: colors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Partner With Us
            </span>
          </h1>
          <p 
            className="text-sm sm:text-lg max-w-2xl mx-auto px-2"
            style={{ color: colors.textMuted }}
          >
            Transform your business with our enterprise-grade solutions. 
            Complete the form below and our team will craft a tailored proposal.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Contact Form */}
          <div 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8"
            style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6" style={{ color: colors.text }}>
              Enterprise Inquiry
            </h2>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Name & Company */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: colors.textMuted }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none transition-all focus:ring-2 text-sm sm:text-base"
                    style={{ 
                      background: colors.background, 
                      color: colors.text, 
                      border: `1px solid ${colors.border}`,
                      '--tw-ring-color': colors.primary
                    } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: colors.textMuted }}>
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none text-sm sm:text-base"
                    style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: colors.textMuted }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none text-sm sm:text-base"
                    style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: colors.textMuted }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none text-sm sm:text-base"
                    style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                  />
                </div>
              </div>

              {/* Price Range - REQUIRED */}
              <div>
                <label className="block text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: colors.textMuted }}>
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Budget Range * <span className="text-xs">(Required)</span>
                </label>
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none appearance-none cursor-pointer text-sm sm:text-base"
                  style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  <option value="">Select your budget range</option>
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              {/* Deadline - REQUIRED */}
              <div>
                <label className="block text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: colors.textMuted }}>
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Target Completion Date * <span className="text-xs">(Required)</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none text-sm sm:text-base"
                  style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: colors.textMuted }}>
                  Project Type
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none appearance-none cursor-pointer text-sm sm:text-base"
                  style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  <option value="">Select project type</option>
                  <option value="web-application">Web Application</option>
                  <option value="mobile-app">Mobile Application</option>
                  <option value="ai-integration">AI Integration</option>
                  <option value="cloud-infrastructure">Cloud Infrastructure</option>
                  <option value="digital-transformation">Digital Transformation</option>
                  <option value="custom">Custom Solution</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm mb-1.5 sm:mb-2" style={{ color: colors.textMuted }}>
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                  className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none resize-none text-sm sm:text-base"
                  style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70 text-sm sm:text-base"
                style={{ background: colors.gradient, color: colors.background }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Enterprise Inquiry
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Features */}
            <div 
              className="rounded-2xl p-6"
              style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                Enterprise Benefits
              </h3>
              <div className="grid gap-4">
                {enterpriseFeatures.map((feature, i) => {
                  const Icon = feature.icon
                  return (
                    <div key={i} className="flex gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${colors.primary}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <h4 className="font-medium" style={{ color: colors.text }}>{feature.title}</h4>
                        <p className="text-sm" style={{ color: colors.textMuted }}>{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div 
              className="rounded-2xl p-6"
              style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                Direct Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" style={{ color: colors.primary }} />
                  <span style={{ color: colors.text }}>enterprise@donhommer.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" style={{ color: colors.primary }} />
                  <span style={{ color: colors.text }}>+420 XXX XXX XXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
                  <span style={{ color: colors.text }}>Czech Republic, EU</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" style={{ color: colors.primary }} />
                  <span style={{ color: colors.text }}>Response within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div 
              className="rounded-2xl p-6 text-center"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
                border: `1px solid ${colors.primary}30`
              }}
            >
              <Building2 className="w-12 h-12 mx-auto mb-3" style={{ color: colors.primary }} />
              <h4 className="font-semibold mb-2" style={{ color: colors.text }}>
                Trusted by Industry Leaders
              </h4>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Join the ranks of forward-thinking enterprises who have transformed their digital presence with Don Hommer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
