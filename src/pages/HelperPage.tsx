import { useState, useRef, useEffect } from 'react'
import { 
  MessageSquare, Phone, Mail, Send, Bot, User, 
  Mic, MicOff, Volume2, VolumeX, CreditCard, Check
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Business-protected responses - only discusses products and sales
const helperResponses: Record<string, string> = {
  greeting: "Welcome to Don Hommer support. I'm here to help you explore our services and find the perfect solution for your needs. How can I assist you today?",
  pricing: "Our solutions start from €10,000 for the Foundation package, €25,000 for Evolution, and €50,000 for Transcendence. Each includes comprehensive support and can be customized to your needs. Would you like me to explain what's included?",
  services: "We offer a full spectrum of digital services: custom web development, AI integration, mobile apps, cloud infrastructure, and enterprise solutions. Our team of world-class developers and designers can bring any vision to life.",
  contact: "I can help you get in touch with our team. You can send an email directly through this page, or for immediate assistance, you can schedule a phone call for $20. Which would you prefer?",
  call: "Phone consultations are available for $20 and connect you directly with our team. The call is private - your number won't be visible to us. Would you like to proceed with scheduling a call?",
  email: "I can send an email to our team on your behalf. Just provide your message and contact details, and we'll respond within 24 hours.",
  // Protected responses - redirect away from technical details
  programming: "I appreciate your interest in the technical aspects! Our team handles all the complex development work so you don't have to worry about the details. What matters is the end result - a stunning, functional solution. What kind of project are you envisioning?",
  ai: "Our AI solutions are designed to enhance your business operations seamlessly. Rather than getting into technical specifics, let me help you understand how AI can benefit your specific use case. What challenges are you looking to solve?",
  code: "We take care of all the technical implementation so you can focus on your business. Our team uses cutting-edge technologies to deliver exceptional results. What kind of solution are you looking for?",
  default: "I'm here to help you find the perfect solution for your needs. I can tell you about our services, pricing, or help you get in touch with our team. What would you like to know?",
}

const protectedKeywords = ['code', 'programming', 'develop', 'javascript', 'python', 'react', 'api', 'database', 'backend', 'frontend', 'algorithm']
const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'neural', 'gpt', 'llm', 'chatgpt']

function findHelperResponse(input: string): string {
  const lowerInput = input.toLowerCase()
  
  // Check for protected topics first
  if (protectedKeywords.some(kw => lowerInput.includes(kw))) {
    return helperResponses.programming
  }
  if (aiKeywords.some(kw => lowerInput.includes(kw))) {
    return helperResponses.ai
  }
  
  // Normal responses
  if (['price', 'cost', 'how much', 'pricing', 'euro', '€'].some(kw => lowerInput.includes(kw))) {
    return helperResponses.pricing
  }
  if (['service', 'offer', 'what do you', 'provide'].some(kw => lowerInput.includes(kw))) {
    return helperResponses.services
  }
  if (['contact', 'reach', 'talk', 'speak'].some(kw => lowerInput.includes(kw))) {
    return helperResponses.contact
  }
  if (['call', 'phone', 'ring'].some(kw => lowerInput.includes(kw))) {
    return helperResponses.call
  }
  if (['email', 'mail', 'message', 'write'].some(kw => lowerInput.includes(kw))) {
    return helperResponses.email
  }
  if (['hello', 'hi', 'hey', 'start', 'help'].some(kw => lowerInput.includes(kw))) {
    return helperResponses.greeting
  }
  
  return helperResponses.default
}

export default function HelperPage() {
  const { colors } = useTheme()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'email' | 'call'>('chat')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Email form state
  const [emailForm, setEmailForm] = useState({ name: '', email: '', message: '' })
  const [emailSent, setEmailSent] = useState(false)
  
  // Call state
  const [callStep, setCallStep] = useState<'info' | 'payment' | 'connecting' | 'connected'>('info')
  const [phoneNumber, setPhoneNumber] = useState('')

  // Speech synthesis
  const speak = (text: string) => {
    if (!isSpeaking) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.1
    const voices = speechSynthesis.getVoices()
    const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'))
    if (femaleVoice) utterance.voice = femaleVoice
    speechSynthesis.speak(utterance)
  }

  // Speech recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }
    
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      handleSend(transcript)
    }
    
    recognition.start()
  }

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        const greeting: Message = {
          id: '1',
          role: 'assistant',
          content: helperResponses.greeting,
          timestamp: new Date()
        }
        setMessages([greeting])
        setIsTyping(false)
        speak(greeting.content)
      }, 800)
    }
  }, [])

  const handleSend = (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = findHelperResponse(userMessage.content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
      speak(response)
    }, 1000 + Math.random() * 500)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate email sending
    setTimeout(() => {
      setEmailSent(true)
    }, 1000)
  }

  const handleCallPayment = () => {
    // Simulate payment processing
    setCallStep('connecting')
    setTimeout(() => {
      setCallStep('connected')
    }, 3000)
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-6 sm:pb-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
            style={{ 
              background: colors.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Helper
          </h1>
          <p className="text-sm sm:text-base" style={{ color: colors.textMuted }}>
            Get assistance via chat, email, or phone
          </p>
        </div>

        {/* Tabs */}
        <div 
          className="flex rounded-xl p-1 mb-6"
          style={{ background: colors.surface }}
        >
          {[
            { id: 'chat', icon: MessageSquare, label: 'Chat' },
            { id: 'email', icon: Mail, label: 'Email' },
            { id: 'call', icon: Phone, label: 'Call ($20)' },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all"
                style={{
                  background: activeTab === tab.id ? colors.primary : 'transparent',
                  color: activeTab === tab.id ? colors.background : colors.text
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div 
            className="rounded-xl overflow-hidden"
            style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
          >
            {/* Messages */}
            <div 
              className="h-[400px] overflow-y-auto p-4 space-y-4"
              style={{ background: colors.background }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: message.role === 'assistant' ? `${colors.primary}20` : `${colors.secondary}20`
                    }}
                  >
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4" style={{ color: colors.primary }} />
                    ) : (
                      <User className="w-4 h-4" style={{ color: colors.secondary }} />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      message.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                    }`}
                    style={{
                      background: message.role === 'assistant' ? colors.surface : `${colors.primary}20`,
                      color: colors.text
                    }}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: `${colors.primary}20` }}
                  >
                    <Bot className="w-4 h-4" style={{ color: colors.primary }} />
                  </div>
                  <div
                    className="p-3 rounded-2xl rounded-tl-sm"
                    style={{ background: colors.surface }}
                  >
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: colors.textMuted, animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: colors.textMuted, animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: colors.textMuted, animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div 
              className="p-4 flex items-center gap-2"
              style={{ borderTop: `1px solid ${colors.border}` }}
            >
              <button
                onClick={() => setIsSpeaking(!isSpeaking)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: isSpeaking ? colors.primary : colors.textMuted }}
              >
                {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={startListening}
                className={`p-2 rounded-lg transition-colors ${isListening ? 'animate-pulse' : ''}`}
                style={{ 
                  color: isListening ? colors.primary : colors.textMuted,
                  background: isListening ? `${colors.primary}20` : 'transparent'
                }}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type or speak your message..."
                className="flex-1 bg-transparent outline-none px-3"
                style={{ color: colors.text }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2 rounded-lg transition-all disabled:opacity-50"
                style={{ background: colors.primary, color: colors.background }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div 
            className="rounded-xl p-6"
            style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
          >
            {emailSent ? (
              <div className="text-center py-12">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${colors.primary}20` }}
                >
                  <Check className="w-8 h-8" style={{ color: colors.primary }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                  Email Sent!
                </h3>
                <p style={{ color: colors.textMuted }}>
                  We'll respond within 24 hours.
                </p>
                <button
                  onClick={() => { setEmailSent(false); setEmailForm({ name: '', email: '', message: '' }) }}
                  className="mt-4 px-6 py-2 rounded-lg"
                  style={{ background: `${colors.primary}20`, color: colors.primary }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textMuted }}>Name</label>
                  <input
                    type="text"
                    value={emailForm.name}
                    onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                    required
                    className="w-full p-3 rounded-lg outline-none"
                    style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textMuted }}>Email</label>
                  <input
                    type="email"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                    required
                    className="w-full p-3 rounded-lg outline-none"
                    style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: colors.textMuted }}>Message</label>
                  <textarea
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full p-3 rounded-lg outline-none resize-none"
                    style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
                  style={{ background: colors.gradient, color: colors.background }}
                >
                  Send Email
                </button>
              </form>
            )}
          </div>
        )}

        {/* Call Tab */}
        {activeTab === 'call' && (
          <div 
            className="rounded-xl p-6"
            style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
          >
            {callStep === 'info' && (
              <div className="text-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: `${colors.primary}20` }}
                >
                  <Phone className="w-10 h-10" style={{ color: colors.primary }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                  Direct Phone Consultation
                </h3>
                <p className="mb-6" style={{ color: colors.textMuted }}>
                  Connect directly with our team for immediate assistance. Your phone number remains private.
                </p>
                <div 
                  className="p-4 rounded-lg mb-6"
                  style={{ background: colors.background }}
                >
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>$20</p>
                  <p className="text-sm" style={{ color: colors.textMuted }}>One-time consultation fee</p>
                </div>
                <div className="mb-6">
                  <label className="block text-sm mb-2" style={{ color: colors.textMuted }}>Your Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-3 rounded-lg outline-none text-center"
                    style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
                  />
                </div>
                <button
                  onClick={() => setCallStep('payment')}
                  disabled={!phoneNumber}
                  className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02] disabled:opacity-50"
                  style={{ background: colors.gradient, color: colors.background }}
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {callStep === 'payment' && (
              <div className="text-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: `${colors.primary}20` }}
                >
                  <CreditCard className="w-10 h-10" style={{ color: colors.primary }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                  Payment
                </h3>
                <p className="mb-6" style={{ color: colors.textMuted }}>
                  Complete payment to initiate your call
                </p>
                <div 
                  className="p-4 rounded-lg mb-6 text-left space-y-3"
                  style={{ background: colors.background }}
                >
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full p-3 rounded-lg outline-none"
                    style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.border}` }}
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="flex-1 p-3 rounded-lg outline-none"
                      style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.border}` }}
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="flex-1 p-3 rounded-lg outline-none"
                      style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.border}` }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleCallPayment}
                  className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
                  style={{ background: colors.gradient, color: colors.background }}
                >
                  Pay $20 & Connect
                </button>
                <button
                  onClick={() => setCallStep('info')}
                  className="w-full py-2 mt-2"
                  style={{ color: colors.textMuted }}
                >
                  Cancel
                </button>
              </div>
            )}

            {callStep === 'connecting' && (
              <div className="text-center py-12">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"
                  style={{ background: `${colors.primary}20` }}
                >
                  <Phone className="w-10 h-10" style={{ color: colors.primary }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                  Connecting...
                </h3>
                <p style={{ color: colors.textMuted }}>
                  Please wait while we connect your call
                </p>
              </div>
            )}

            {callStep === 'connected' && (
              <div className="text-center py-12">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: '#22c55e20' }}
                >
                  <Phone className="w-10 h-10" style={{ color: '#22c55e' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                  Call Connected!
                </h3>
                <p className="mb-6" style={{ color: colors.textMuted }}>
                  You should receive a call shortly at {phoneNumber}
                </p>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Note: This is a demo. In production, this would connect via Twilio or similar service.
                </p>
                <button
                  onClick={() => { setCallStep('info'); setPhoneNumber('') }}
                  className="mt-6 px-6 py-2 rounded-lg"
                  style={{ background: `${colors.primary}20`, color: colors.primary }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
