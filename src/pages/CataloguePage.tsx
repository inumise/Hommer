import { useState, useRef, useEffect } from 'react'
import { 
  ShoppingCart, Plus, Minus, X, MessageSquare, 
  Bot, Send, Mic, MicOff, Volume2, Search,
  Layers, Box, Sparkles, Zap, Eye, Cpu, Shield, Cloud,
  Smartphone, Globe, Database, Lock, Palette, Code,
  FileText, CreditCard
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface Product {
  id: string
  name: string
  description: string
  price: number | 'custom'
  priceDisplay: string
  icon: typeof Layers
  category: string
  features: string[]
}

interface CartItem {
  product: Product
  quantity: number
  customNote?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const products: Product[] = [
  // Visual Design
  { id: 'wireframes', name: 'Wireframes & Outlines', description: 'Precision structural blueprints with holographic rendering', price: 2000, priceDisplay: '€2,000', icon: Layers, category: 'Visual Design', features: ['Vector Precision', 'Auto-Layout', 'Smart Guides'] },
  { id: 'color-systems', name: 'Color Systems', description: 'Dynamic theme generation with AI-powered palettes', price: 1500, priceDisplay: '€1,500', icon: Palette, category: 'Visual Design', features: ['Theme Generation', 'Accessibility', 'Brand Matching'] },
  { id: 'visual-effects', name: 'Visual Effects', description: 'Post-processing shaders and compositing', price: 3000, priceDisplay: '€3,000', icon: Eye, category: 'Visual Design', features: ['Blur Effects', 'Color Grading', 'Glow Rendering'] },
  { id: 'motion-graphics', name: 'Motion Graphics', description: 'Cinematic animations with timeline orchestration', price: 4000, priceDisplay: '€4,000', icon: Sparkles, category: 'Visual Design', features: ['Keyframes', 'Easing', 'Particles'] },
  
  // 3D & Animation
  { id: '3d-rendering', name: '3D Rendering', description: 'GPU-accelerated WebGL 2.0 graphics', price: 5000, priceDisplay: '€5,000', icon: Box, category: '3D & Animation', features: ['Real-time 3D', '60fps', 'Low Memory'] },
  { id: 'particle-systems', name: 'Particle Systems', description: 'Dynamic particle effects with physics', price: 3500, priceDisplay: '€3,500', icon: Zap, category: '3D & Animation', features: ['Physics Sim', 'Collision', 'Forces'] },
  
  // AI & Intelligence
  { id: 'ai-chatbot', name: 'AI Chatbot', description: 'Conversational agent with natural language', price: 5000, priceDisplay: '€5,000', icon: Bot, category: 'AI & Intelligence', features: ['NLP', 'Context', 'Learning'] },
  { id: 'voice-assistant', name: 'Voice Assistant', description: 'Speech recognition and synthesis', price: 4000, priceDisplay: '€4,000', icon: MessageSquare, category: 'AI & Intelligence', features: ['Speech-to-Text', 'TTS', 'Commands'] },
  { id: 'ml-analytics', name: 'ML Analytics', description: 'Predictive analytics with neural networks', price: 8000, priceDisplay: '€8,000', icon: Cpu, category: 'AI & Intelligence', features: ['Predictions', 'Patterns', 'Insights'] },
  
  // Infrastructure
  { id: 'cloud-systems', name: 'Cloud Systems', description: 'Scalable global deployment architecture', price: 6000, priceDisplay: '€6,000', icon: Cloud, category: 'Infrastructure', features: ['Auto-scale', 'CDN', 'Redundancy'] },
  { id: 'database', name: 'Database Management', description: 'Secure storage with real-time sync', price: 4000, priceDisplay: '€4,000', icon: Database, category: 'Infrastructure', features: ['Real-time', 'Backup', 'Migration'] },
  { id: 'security', name: 'Security Suite', description: 'Enterprise protection with zero-trust', price: 5000, priceDisplay: '€5,000', icon: Shield, category: 'Infrastructure', features: ['Encryption', 'Auth', 'Monitoring'] },
  { id: 'auth', name: 'Authentication', description: 'Multi-factor identity management', price: 3000, priceDisplay: '€3,000', icon: Lock, category: 'Infrastructure', features: ['MFA', 'SSO', 'OAuth'] },
  
  // Development
  { id: 'custom-dev', name: 'Custom Development', description: 'Bespoke full-stack solutions', price: 10000, priceDisplay: '€10,000', icon: Code, category: 'Development', features: ['Full-stack', 'API', 'Integration'] },
  { id: 'mobile-app', name: 'Mobile App', description: 'Cross-platform native performance', price: 15000, priceDisplay: '€15,000', icon: Smartphone, category: 'Development', features: ['iOS', 'Android', 'React Native'] },
  { id: 'web-app', name: 'Web Application', description: 'Progressive web app with offline', price: 12000, priceDisplay: '€12,000', icon: Globe, category: 'Development', features: ['PWA', 'Offline', 'Push'] },
  
  // Custom
  { id: 'other', name: 'Other', description: 'Custom solution - describe your needs', price: 'custom', priceDisplay: 'Hex≈@%', icon: FileText, category: 'Custom', features: ['Custom Scope', 'Consultation', 'Tailored'] },
]

const categories = ['All', 'Visual Design', '3D & Animation', 'AI & Intelligence', 'Infrastructure', 'Development', 'Custom']

// AI Shopping Assistant responses
const assistantResponses: Record<string, string> = {
  greeting: "Welcome to the Don Hommer Catalogue! I'm here to help you find the perfect solutions for your project. What kind of digital experience are you looking to create?",
  recommend: "Based on your needs, I'd recommend starting with our Foundation package which includes custom development, responsive design, and basic AI integration. Would you like me to add these to your cart?",
  budget: "I understand budget is important. Our solutions range from €1,500 for individual components to comprehensive packages. What's your approximate budget range? I can suggest the best combination for your investment.",
  custom: "For custom requirements, our 'Other' product allows you to describe exactly what you need. Our team will provide a personalized quote. Would you like to add a custom request?",
  cart: "I can see your cart. Would you like me to suggest complementary products that work well together, or shall we proceed to checkout?",
  default: "I'm here to help you build your perfect digital solution. You can ask me about specific products, get recommendations based on your needs, or I can help you understand which combination of services would work best for your project.",
}

function findAssistantResponse(input: string): string {
  const lower = input.toLowerCase()
  if (['hello', 'hi', 'start', 'help'].some(k => lower.includes(k))) return assistantResponses.greeting
  if (['recommend', 'suggest', 'need', 'want', 'looking'].some(k => lower.includes(k))) return assistantResponses.recommend
  if (['budget', 'price', 'cost', 'afford', 'cheap'].some(k => lower.includes(k))) return assistantResponses.budget
  if (['custom', 'other', 'special', 'unique'].some(k => lower.includes(k))) return assistantResponses.custom
  if (['cart', 'checkout', 'buy', 'purchase'].some(k => lower.includes(k))) return assistantResponses.cart
  return assistantResponses.default
}

export default function CataloguePage() {
  const { colors, formatPrice } = useTheme()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [customNote, setCustomNote] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const cartTotal = cart.reduce((sum, item) => {
    if (item.product.price === 'custom') return sum
    return sum + (item.product.price * item.quantity)
  }, 0)

  const addToCart = (product: Product, note?: string) => {
    const existing = cart.find(item => item.product.id === product.id)
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { product, quantity: 1, customNote: note }])
    }
    setSelectedProduct(null)
    setCustomNote('')
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  // Chat functions
  const speak = (text: string) => {
    if (!isSpeaking) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.1
    speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setChatInput(transcript)
      handleChatSend(transcript)
    }
    recognition.start()
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages([{ id: '1', role: 'assistant', content: assistantResponses.greeting }])
        setIsTyping(false)
        speak(assistantResponses.greeting)
      }, 500)
    }
  }, [isChatOpen])

  const handleChatSend = (text?: string) => {
    const msg = text || chatInput
    if (!msg.trim()) return
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: msg }])
    setChatInput('')
    setIsTyping(true)
    
    setTimeout(() => {
      const response = findAssistantResponse(msg)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }])
      setIsTyping(false)
      speak(response)
    }, 800)
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-6 sm:pb-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
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
            Technology Catalogue
          </h1>
          <p className="text-sm sm:text-base" style={{ color: colors.textMuted }}>
            Build your perfect digital solution
          </p>
        </div>

        {/* Search & Filter */}
        <div 
          className="flex flex-wrap gap-4 p-4 rounded-xl mb-6"
          style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
        >
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textMuted }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg outline-none"
              style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: selectedCategory === cat ? colors.primary : 'transparent',
                  color: selectedCategory === cat ? colors.background : colors.text,
                  border: `1px solid ${selectedCategory === cat ? colors.primary : colors.border}`
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {filteredProducts.map(product => {
            const Icon = product.icon
            const inCart = cart.find(item => item.product.id === product.id)
            
            return (
              <div
                key={product.id}
                className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] group"
                style={{ 
                  background: colors.surface, 
                  border: `1px solid ${colors.border}`,
                  boxShadow: `0 4px 20px ${colors.background}80`
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${colors.primary}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: colors.primary }} />
                </div>
                
                <h3 className="font-semibold mb-1" style={{ color: colors.text }}>
                  {product.name}
                </h3>
                <p className="text-sm mb-3" style={{ color: colors.textMuted }}>
                  {product.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.features.map(f => (
                    <span 
                      key={f}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ background: `${colors.primary}10`, color: colors.primary }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span 
                    className="text-lg font-bold"
                    style={{ 
                      color: product.price === 'custom' ? colors.accent : colors.primary,
                      fontFamily: product.price === 'custom' ? 'monospace' : 'inherit'
                    }}
                  >
                    {product.priceDisplay}
                  </span>
                  
                  {product.id === 'other' ? (
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{ background: colors.gradient, color: colors.background }}
                    >
                      Configure
                    </button>
                  ) : inCart ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${colors.primary}20` }}
                      >
                        <Minus className="w-4 h-4" style={{ color: colors.primary }} />
                      </button>
                      <span style={{ color: colors.text }}>{inCart.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${colors.primary}20` }}
                      >
                        <Plus className="w-4 h-4" style={{ color: colors.primary }} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                      style={{ background: colors.gradient, color: colors.background }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Custom Product Modal */}
        {selectedProduct && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            onClick={() => setSelectedProduct(null)}
          >
            <div 
              className="w-full max-w-md rounded-xl p-6"
              style={{ background: colors.surface }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
                Custom Request
              </h3>
              <p className="mb-4" style={{ color: colors.textMuted }}>
                Describe your custom requirements and our team will provide a personalized quote.
              </p>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Describe what you need..."
                rows={5}
                className="w-full p-3 rounded-lg outline-none resize-none mb-4"
                style={{ background: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-2 rounded-lg"
                  style={{ border: `1px solid ${colors.border}`, color: colors.text }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => addToCart(selectedProduct, customNote)}
                  disabled={!customNote.trim()}
                  className="flex-1 py-2 rounded-lg font-medium disabled:opacity-50"
                  style={{ background: colors.gradient, color: colors.background }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          style={{ background: colors.gradient }}
        >
          <ShoppingCart className="w-6 h-6" style={{ color: colors.background }} />
          {cart.length > 0 && (
            <span 
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: '#ef4444', color: 'white' }}
            >
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          style={{ background: `${colors.secondary}` }}
        >
          <Bot className="w-6 h-6" style={{ color: colors.background }} />
        </button>

        {/* Cart Drawer */}
        {isCartOpen && (
          <div 
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setIsCartOpen(false)}
          >
            <div 
              className="absolute right-0 top-0 bottom-0 w-full max-w-md p-6 overflow-y-auto"
              style={{ background: colors.background }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)}>
                  <X className="w-6 h-6" style={{ color: colors.textMuted }} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
                  <p style={{ color: colors.textMuted }}>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => {
                      const Icon = item.product.icon
                      return (
                        <div 
                          key={item.product.id}
                          className="flex gap-4 p-4 rounded-xl"
                          style={{ background: colors.surface }}
                        >
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${colors.primary}20` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: colors.primary }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium" style={{ color: colors.text }}>{item.product.name}</h4>
                            <p className="text-sm" style={{ color: colors.textMuted }}>
                              {item.product.priceDisplay} x {item.quantity}
                            </p>
                            {item.customNote && (
                              <p className="text-xs mt-1 italic" style={{ color: colors.textMuted }}>
                                Note: {item.customNote.substring(0, 50)}...
                              </p>
                            )}
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)}>
                            <X className="w-5 h-5" style={{ color: colors.textMuted }} />
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  <div 
                    className="p-4 rounded-xl mb-6"
                    style={{ background: colors.surface }}
                  >
                    <div className="flex justify-between mb-2">
                      <span style={{ color: colors.textMuted }}>Subtotal</span>
                      <span style={{ color: colors.text }}>{formatPrice(cartTotal)}</span>
                    </div>
                    {cart.some(item => item.product.price === 'custom') && (
                      <p className="text-xs" style={{ color: colors.accent }}>
                        + Custom items (quote pending)
                      </p>
                    )}
                  </div>

                  <button
                    className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                    style={{ background: colors.gradient, color: colors.background }}
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* AI Chat Drawer */}
        {isChatOpen && (
          <div 
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setIsChatOpen(false)}
          >
            <div 
              className="absolute right-0 top-0 bottom-0 w-full max-w-md flex flex-col"
              style={{ background: colors.background }}
              onClick={e => e.stopPropagation()}
            >
              <div 
                className="flex items-center justify-between p-4"
                style={{ borderBottom: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${colors.primary}20` }}
                  >
                    <Bot className="w-5 h-5" style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: colors.text }}>Shopping Assistant</h3>
                    <p className="text-xs" style={{ color: colors.textMuted }}>Voice-powered help</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)}>
                  <X className="w-6 h-6" style={{ color: colors.textMuted }} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                      style={{
                        background: msg.role === 'assistant' ? colors.surface : `${colors.primary}20`,
                        color: colors.text
                      }}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-1 p-3" style={{ background: colors.surface, borderRadius: '1rem' }}>
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: colors.textMuted }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: colors.textMuted, animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: colors.textMuted, animationDelay: '300ms' }} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div 
                className="p-4 flex items-center gap-2"
                style={{ borderTop: `1px solid ${colors.border}` }}
              >
                <button
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  className="p-2 rounded-lg"
                  style={{ color: isSpeaking ? colors.primary : colors.textMuted }}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={startListening}
                  className={`p-2 rounded-lg ${isListening ? 'animate-pulse' : ''}`}
                  style={{ color: isListening ? colors.primary : colors.textMuted }}
                >
                  {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  placeholder="Ask about products..."
                  className="flex-1 bg-transparent outline-none px-3"
                  style={{ color: colors.text }}
                />
                <button
                  onClick={() => handleChatSend()}
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-lg disabled:opacity-50"
                  style={{ background: colors.primary, color: colors.background }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
