import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Leaf, Moon, Sun, Star, Heart, 
  Compass, Eye, Infinity, Wind,
  Mountain, Flame, TreeDeciduous, Droplets, Flower2
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

// Deep interconnected sacred elements - fruits, mycelium, rivers, herbs
const sacredElements = [
  // Ayurvedic Doshas
  { id: 'vata', symbol: '॥वात॥', name: 'Vata', element: 'Air & Ether', icon: Wind, color: '#7ec8d8', 
    description: 'The wind that carries seeds across mountains, the breath that connects all life',
    connections: ['pitta', 'kapha', 'mycelium', 'river', 'mint', 'ginger'], layer: 'dosha' },
  { id: 'pitta', symbol: '॥पित्त॥', name: 'Pitta', element: 'Fire & Water', icon: Flame, color: '#f4a574', 
    description: 'The transformative fire, digesting experience into wisdom',
    connections: ['vata', 'kapha', 'apple', 'sun', 'turmeric', 'river'], layer: 'dosha' },
  { id: 'kapha', symbol: '॥कफ॥', name: 'Kapha', element: 'Earth & Water', icon: Mountain, color: '#7dd3a8', 
    description: 'The stable foundation from which all growth emerges',
    connections: ['vata', 'pitta', 'earth', 'moon', 'ashwagandha', 'mycelium'], layer: 'dosha' },
  
  // Fruity Life - Sacred Fruits
  { id: 'apple', symbol: '🍎', name: 'Apple of Knowledge', element: 'Forbidden Wisdom', icon: Heart, color: '#e879a9', 
    description: 'The fruit that opened eyes to truth, connecting heaven and earth through its seeds',
    connections: ['pitta', 'sun', 'star', 'pomegranate', 'river'], layer: 'fruit' },
  { id: 'pomegranate', symbol: '🍇', name: 'Pomegranate', element: 'Thousand Seeds', icon: Heart, color: '#c9506b', 
    description: 'Each seed a universe, each bite a journey through the underworld and back',
    connections: ['apple', 'moon', 'mycelium', 'elderberry'], layer: 'fruit' },
  { id: 'elderberry', symbol: '🫐', name: 'Elderberry', element: 'Elder Wisdom', icon: Flower2, color: '#6b5b95', 
    description: 'The medicine of grandmothers, protection woven through generations',
    connections: ['pomegranate', 'ashwagandha', 'moon', 'mycelium'], layer: 'fruit' },
  
  // Mycelium Network - The Underground Internet
  { id: 'mycelium', symbol: '🍄', name: 'Mycelium Network', element: 'Underground Web', icon: TreeDeciduous, color: '#a78bcc', 
    description: 'The ancient internet beneath our feet, connecting every tree, every root, every secret',
    connections: ['vata', 'kapha', 'pomegranate', 'elderberry', 'earth', 'reishi', 'lionsmane'], layer: 'mycelium' },
  { id: 'reishi', symbol: '🔮', name: 'Reishi', element: 'Mushroom of Immortality', icon: Star, color: '#8b4513', 
    description: 'The spirit mushroom, gateway between worlds, teacher of patience',
    connections: ['mycelium', 'lionsmane', 'moon', 'ashwagandha'], layer: 'mycelium' },
  { id: 'lionsmane', symbol: '🦁', name: "Lion's Mane", element: 'Neural Regeneration', icon: Compass, color: '#f5deb3', 
    description: 'The brain mushroom, rebuilding pathways, restoring what was lost',
    connections: ['mycelium', 'reishi', 'ginger', 'sun'], layer: 'mycelium' },
  
  // River Paths - The Flow of Life
  { id: 'river', symbol: '〰️', name: 'River of Life', element: 'Eternal Flow', icon: Droplets, color: '#4a90d9', 
    description: 'The path that carves mountains, the journey that never ends yet always arrives',
    connections: ['vata', 'pitta', 'apple', 'ocean', 'rain'], layer: 'river' },
  { id: 'ocean', symbol: '🌊', name: 'Ocean Memory', element: 'Collective Unconscious', icon: Infinity, color: '#1e5a8f', 
    description: 'Where all rivers return, where all memories dissolve and reform',
    connections: ['river', 'rain', 'moon', 'star'], layer: 'river' },
  { id: 'rain', symbol: '💧', name: 'Sacred Rain', element: 'Sky Tears', icon: Droplets, color: '#87ceeb', 
    description: 'The sky returning what it borrowed, completing the eternal cycle',
    connections: ['river', 'ocean', 'sun', 'earth'], layer: 'river' },
  
  // Healing Herbs - Nature's Medicine
  { id: 'ashwagandha', symbol: '🌿', name: 'Ashwagandha', element: 'Strength of Horse', icon: Leaf, color: '#556b2f', 
    description: 'The root that grounds anxiety, the herb that builds what stress destroys',
    connections: ['kapha', 'elderberry', 'reishi', 'turmeric'], layer: 'herb' },
  { id: 'turmeric', symbol: '🧡', name: 'Turmeric', element: 'Golden Healer', icon: Sun, color: '#ffa500', 
    description: 'The golden root, inflammation\'s enemy, the spice that colors temples',
    connections: ['pitta', 'ashwagandha', 'ginger', 'sun'], layer: 'herb' },
  { id: 'ginger', symbol: '🫚', name: 'Ginger', element: 'Fire Root', icon: Flame, color: '#deb887', 
    description: 'The warming root, digestion\'s friend, the traveler\'s companion',
    connections: ['vata', 'lionsmane', 'turmeric', 'mint'], layer: 'herb' },
  { id: 'mint', symbol: '🌱', name: 'Sacred Mint', element: 'Cool Clarity', icon: Wind, color: '#98fb98', 
    description: 'The cooling breath, clarity in chaos, the herb of hospitality',
    connections: ['vata', 'ginger', 'river', 'rain'], layer: 'herb' },
  
  // Cosmic Elements
  { id: 'sun', symbol: '☉', name: 'Solar Force', element: 'Cosmic Fire', icon: Sun, color: '#f0d878', 
    description: 'The source of all energy, the eye that sees all, the heart of our system',
    connections: ['pitta', 'apple', 'lionsmane', 'turmeric', 'rain', 'star'], layer: 'cosmic' },
  { id: 'moon', symbol: '☽', name: 'Lunar Essence', element: 'Cosmic Water', icon: Moon, color: '#c9a0c9', 
    description: 'The mirror of the sun, ruler of tides and cycles, keeper of dreams',
    connections: ['kapha', 'pomegranate', 'elderberry', 'reishi', 'ocean'], layer: 'cosmic' },
  { id: 'earth', symbol: '⊕', name: 'Terra Mater', element: 'Foundation', icon: Mountain, color: '#8b7355', 
    description: 'The mother of all, the ground beneath, the body we return to',
    connections: ['kapha', 'mycelium', 'rain', 'ashwagandha'], layer: 'cosmic' },
  { id: 'star', symbol: '✧', name: 'Stellar Cipher', element: 'Cosmic Light', icon: Star, color: '#ffffff', 
    description: 'The ancient light, navigation through darkness, seeds of future suns',
    connections: ['apple', 'ocean', 'sun', 'infinity'], layer: 'cosmic' },
  { id: 'infinity', symbol: '∞', name: 'Eternal Loop', element: 'Timeless', icon: Infinity, color: '#7ba3d8', 
    description: 'The snake eating its tail, the cycle without beginning, the truth beyond time',
    connections: ['star', 'ocean', 'mycelium', 'river'], layer: 'cosmic' },
]

// Life paths that connect to the sacred system
const lifePaths = [
  { name: 'Science', cipher: 'Σ∂∫', description: 'The path of empirical truth, measuring the immeasurable', elements: ['sun', 'star', 'lionsmane'] },
  { name: 'Nature', cipher: '⚘⚕☘', description: 'The path of organic wisdom, learning from the oldest teachers', elements: ['mycelium', 'river', 'earth'] },
  { name: 'Blue Collar', cipher: '⚒⚙⛏', description: 'The path of craftsmanship, hands that shape reality', elements: ['earth', 'ginger', 'kapha'] },
  { name: 'Creative', cipher: '✎✿❋', description: 'The path of artistic expression, channeling the unseen', elements: ['vata', 'moon', 'pomegranate'] },
  { name: 'Leader', cipher: '♔♕⚜', description: 'The path of guidance, carrying others through darkness', elements: ['sun', 'pitta', 'ashwagandha'] },
  { name: 'Healer', cipher: '☤⚕✙', description: 'The path of restoration, mending what is broken', elements: ['turmeric', 'reishi', 'elderberry'] },
]

// Cryptic phrases that appear randomly
const crypticPhrases = [
  'As above, so below',
  'The mycelium remembers all',
  'In the apple, the universe unfolds',
  'Fire transforms, water flows, earth holds',
  'The cipher reveals itself to those who wait',
  'All rivers lead to one ocean',
  'The network is alive and watching',
  'Seek and the pattern emerges',
  'Every root connects to every star',
  'The fruit contains the seed of its own becoming',
  'Healing flows where attention goes',
  'The underground speaks in silence',
]

// Layer depths for 3D effect
const layerDepths: Record<string, number> = {
  'cosmic': 0,
  'dosha': 1,
  'fruit': 2,
  'mycelium': 3,
  'river': 4,
  'herb': 5,
}

interface NodeState {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  phase: number
  burstPhase: number
}

function SacredNode({ 
  element, 
  nodeState,
  isActive, 
  onActivate,
  colors,
  mouseOffset,
  burstIntensity
}: { 
  element: typeof sacredElements[0]
  nodeState: NodeState
  isActive: boolean
  onActivate: () => void
  colors: ReturnType<typeof useTheme>['colors']
  mouseOffset: { x: number; y: number }
  burstIntensity: number
}) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const Icon = element.icon
  const depth = layerDepths[element.layer] || 0
  
  // Calculate 3D transform based on depth and mouse
  const zOffset = depth * 30 - 75
  const scale = 1 - (depth * 0.04)
  const parallaxX = mouseOffset.x * (0.6 - depth * 0.1)
  const parallaxY = mouseOffset.y * (0.6 - depth * 0.1)
  
  // Add burst effect
  const burstX = Math.sin(nodeState.burstPhase) * burstIntensity * 25
  const burstY = Math.cos(nodeState.burstPhase * 1.3) * burstIntensity * 25

  return (
    <div
      ref={nodeRef}
      className="absolute cursor-pointer transition-all duration-200 group"
      style={{
        left: `calc(${nodeState.x}% + ${parallaxX + burstX}px)`,
        top: `calc(${nodeState.y}% + ${parallaxY + burstY}px)`,
        transform: `translate(-50%, -50%) translateZ(${zOffset}px) scale(${scale})`,
        zIndex: 20 - depth + (isActive ? 10 : 0),
        filter: `blur(${depth * 0.2}px)`,
        opacity: 1 - depth * 0.06
      }}
      onClick={onActivate}
    >
      {/* Glow effect - softened and cinematic */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl transition-opacity duration-700"
        style={{
          background: element.color,
          opacity: isActive ? 0.4 : 0.15,
          transform: `scale(${2.8 + burstIntensity * 0.3})`
        }}
      />
      
      {/* Pulsing ring - much subtler and slower */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `1.5px solid ${element.color}`,
          opacity: 0.2 + Math.sin(nodeState.phase) * 0.12,
          transform: `scale(${1.6 + Math.sin(nodeState.phase * 1.2) * 0.2})`
        }}
      />
      
      {/* Node */}
      <div
        className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${element.color}50, ${element.color}15)`,
          border: `2px solid ${isActive ? element.color : element.color + '70'}`,
          boxShadow: isActive 
            ? `0 0 40px ${element.color}70, inset 0 0 20px ${element.color}30` 
            : `0 0 15px ${element.color}30`,
          transform: isActive ? 'scale(1.25)' : 'scale(1)'
        }}
      >
        <span 
          className="text-base md:text-lg lg:text-xl mb-0.5" 
          style={{ 
            filter: `drop-shadow(0 0 8px ${element.color})`,
            transform: `rotate(${Math.sin(nodeState.phase * 0.3) * 5}deg)`
          }}
        >
          {element.symbol}
        </span>
        <Icon 
          className="w-3 h-3 md:w-4 md:h-4 opacity-70" 
          style={{ color: element.color }} 
        />
      </div>

      {/* Tooltip */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 top-full mt-3 px-4 py-2 rounded-xl text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{ 
          background: `${colors.surface}f0`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${element.color}50`,
          color: colors.text,
          boxShadow: `0 10px 40px ${element.color}30`
        }}
      >
        <p className="text-sm font-semibold" style={{ color: element.color }}>{element.name}</p>
        <p className="text-xs opacity-70">{element.element}</p>
      </div>
    </div>
  )
}

export default function SensePage() {
  const { colors } = useTheme()
  const [activeElement, setActiveElement] = useState<string | null>(null)
  const [revealedPhrase, setRevealedPhrase] = useState('')
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [burstIntensity, setBurstIntensity] = useState(0)
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>({})
  const animationRef = useRef<number>(0)
  const lastBurstRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  // Initialize node states with positions in sacred geometry pattern
  useEffect(() => {
    const states: Record<string, NodeState> = {}
    sacredElements.forEach((element) => {
      const layer = layerDepths[element.layer] || 0
      const elementsInLayer = sacredElements.filter(e => e.layer === element.layer)
      const indexInLayer = elementsInLayer.findIndex(e => e.id === element.id)
      const angleOffset = layer * 0.4
      const angle = (indexInLayer / elementsInLayer.length) * Math.PI * 2 - Math.PI / 2 + angleOffset
      const radius = 30 + layer * 4
      
      states[element.id] = {
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        z: layer * 30,
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
        phase: Math.random() * Math.PI * 2,
        burstPhase: Math.random() * Math.PI * 2
      }
    })
    setNodeStates(states)
  }, [])

  // Handle mouse/scroll movement for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      setMouseOffset({
        x: (e.clientX - centerX) / 15,
        y: (e.clientY - centerY) / 15
      })
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      setMouseOffset(prev => ({
        ...prev,
        y: prev.y + Math.sin(scrollY * 0.01) * 3
      }))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Animate nodes with random movement and bursts
  useEffect(() => {
    let lastTime = performance.now()
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime
      timeRef.current = currentTime

      // Random burst every 8-14 seconds - much slower, more cinematic
      if (currentTime - lastBurstRef.current > 8000 + Math.random() * 6000) {
        setBurstIntensity(0.6)
        lastBurstRef.current = currentTime
        setTimeout(() => setBurstIntensity(0), 1200)
      }

      setNodeStates(prev => {
        const newStates = { ...prev }
        Object.keys(newStates).forEach(id => {
          const state = newStates[id]
          
          // Update phase for pulsing - much slower for cinematic feel
          state.phase += deltaTime * 0.8
          state.burstPhase += deltaTime * 1.2
          
          // Random velocity changes - more frequent
          if (Math.random() < 0.04) {
            state.vx += (Math.random() - 0.5) * 0.08
            state.vy += (Math.random() - 0.5) * 0.08
          }
          
          // Apply velocity with damping
          state.x += state.vx
          state.y += state.vy
          state.vx *= 0.97
          state.vy *= 0.97
          
          // Keep within bounds with soft bounce
          if (state.x < 12 || state.x > 88) state.vx *= -0.6
          if (state.y < 12 || state.y > 88) state.vy *= -0.6
          state.x = Math.max(12, Math.min(88, state.x))
          state.y = Math.max(12, Math.min(88, state.y))
        })
        return newStates
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  // Draw 3D twisted connections between elements
  const drawConnections = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const time = timeRef.current / 1000
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections with 3D twist effect
    sacredElements.forEach((element) => {
      const state1 = nodeStates[element.id]
      if (!state1) return
      
      const x1 = (state1.x / 100) * canvas.width
      const y1 = (state1.y / 100) * canvas.height
      const depth1 = layerDepths[element.layer] || 0

      element.connections.forEach(connId => {
        const connElement = sacredElements.find(e => e.id === connId)
        const state2 = nodeStates[connId]
        if (!connElement || !state2) return
        if (sacredElements.findIndex(e => e.id === connId) <= sacredElements.findIndex(e => e.id === element.id)) return

        const x2 = (state2.x / 100) * canvas.width
        const y2 = (state2.y / 100) * canvas.height
        const depth2 = layerDepths[connElement.layer] || 0

        const isActiveConnection = activeElement === element.id || activeElement === connId
        const avgDepth = (depth1 + depth2) / 2

        // Create twisted bezier curve for 3D effect
        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2
        const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2)
        const twist = Math.sin(time * 0.8 + avgDepth + dist * 0.01) * 40 * (1 - avgDepth * 0.1)
        const perpX = dist > 0 ? -(y2 - y1) / dist * twist : 0
        const perpY = dist > 0 ? (x2 - x1) / dist * twist : 0

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.quadraticCurveTo(midX + perpX, midY + perpY, x2, y2)
        
        // Gradient based on element colors - softer
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        gradient.addColorStop(0, isActiveConnection ? `${element.color}80` : `${element.color}20`)
        gradient.addColorStop(1, isActiveConnection ? `${connElement.color}80` : `${connElement.color}20`)
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = isActiveConnection ? 2.8 - avgDepth * 0.2 : 1.2 - avgDepth * 0.1
        ctx.stroke()

        // Animated particles on connections - slower and softer
        if (isActiveConnection || Math.random() < 0.004) {
          const numParticles = isActiveConnection ? 3 : 1
          for (let p = 0; p < numParticles; p++) {
            const t = ((time * 0.2 + p * 0.33) % 1)
            // Quadratic bezier point calculation
            const mt = 1 - t
            const px = mt * mt * x1 + 2 * mt * t * (midX + perpX) + t * t * x2
            const py = mt * mt * y1 + 2 * mt * t * (midY + perpY) + t * t * y2
            
            ctx.beginPath()
            ctx.arc(px, py, isActiveConnection ? 3.5 : 2, 0, Math.PI * 2)
            const particleColor = t < 0.5 ? element.color : connElement.color
            ctx.fillStyle = particleColor
            ctx.fill()
            
            // Glow effect on particles - subtler
            if (isActiveConnection) {
              ctx.beginPath()
              ctx.arc(px, py, 8, 0, Math.PI * 2)
              ctx.fillStyle = `${particleColor}15`
              ctx.fill()
            }
          }
        }
      })
    })
  }, [activeElement, nodeStates])

  // Animation loop for canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resize = () => {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      drawConnections()
      requestAnimationFrame(animate)
    }
    const animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [drawConnections])

  // Reveal cryptic phrase on element activation
  useEffect(() => {
    if (activeElement) {
      const phrase = crypticPhrases[Math.floor(Math.random() * crypticPhrases.length)]
      setRevealedPhrase(phrase)
    }
  }, [activeElement])

  const activeElementData = sacredElements.find(e => e.id === activeElement)
  const selectedPathData = lifePaths.find(p => p.name === selectedPath)

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-6 sm:pb-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header - Cryptic and Mystical */}
        <div className="text-center mb-6 sm:mb-8">
          <p 
            className="text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.8em] uppercase mb-2 sm:mb-3 font-mono animate-pulse"
            style={{ color: colors.textMuted }}
          >
            ॐ The Hidden Network ॐ
          </p>
          <h1 
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-3 sm:mb-4"
            style={{ color: colors.text }}
          >
            <span 
              className="font-bold"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 5s ease infinite'
              }}
            >
              The Sense
            </span>
          </h1>
          <p 
            className="text-xs sm:text-sm max-w-2xl mx-auto font-mono opacity-80 leading-relaxed px-2"
            style={{ color: colors.textMuted }}
          >
            Where Ayurveda meets the mycelium network, where sacred fruits hold universal truths,
            where rivers carry ancient wisdom, and healing herbs connect all paths of life
            in ways that can only be felt, never fully understood.
          </p>
          <p 
            className="text-[10px] sm:text-xs mt-2 sm:mt-3 font-mono tracking-widest"
            style={{ color: colors.primary, opacity: 0.6 }}
          >
            [ This knowledge is prohibited to those who seek without reverence ]
          </p>
        </div>

        {/* Sacred Network Visualization - 3D Perspective */}
        <div 
          ref={containerRef}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 touch-pan-x touch-pan-y"
          style={{ 
            background: `radial-gradient(ellipse at center, ${colors.surface}90, ${colors.background})`,
            border: `1px solid ${colors.border}`,
            height: 'calc(100vh - 280px)',
            minHeight: '350px',
            maxHeight: '600px',
            perspective: '1000px',
            perspectiveOrigin: '50% 50%'
          }}
        >
          {/* Mystical background layers */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, ${colors.primary}40 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, ${colors.secondary}40 0%, transparent 40%),
                radial-gradient(circle at 50% 50%, ${colors.primary}15 0%, transparent 60%)
              `
            }}
          />

          {/* Connection lines canvas */}
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ transform: 'translateZ(0)' }}
          />

          {/* Center eye - the observer */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${colors.primary}30, transparent)`,
              border: `1px solid ${colors.primary}50`,
              boxShadow: `0 0 80px ${colors.primary}30, inset 0 0 40px ${colors.primary}15`
            }}
          >
            <Eye 
              className="w-7 h-7 sm:w-10 sm:h-10 animate-pulse" 
              style={{ 
                color: colors.primary, 
                opacity: 0.8,
                filter: `drop-shadow(0 0 15px ${colors.primary})`
              }} 
            />
          </div>

          {/* Sacred nodes */}
          {sacredElements.map((element) => (
            <SacredNode
              key={element.id}
              element={element}
              nodeState={nodeStates[element.id] || { x: 50, y: 50, z: 0, vx: 0, vy: 0, phase: 0, burstPhase: 0 }}
              isActive={activeElement === element.id}
              onActivate={() => setActiveElement(activeElement === element.id ? null : element.id)}
              colors={colors}
              mouseOffset={mouseOffset}
              burstIntensity={burstIntensity}
            />
          ))}

          {/* Revealed phrase */}
          {revealedPhrase && (
            <div 
              className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-mono max-w-[90%] text-center"
              style={{ 
                background: `${colors.surface}e0`,
                backdropFilter: 'blur(10px)',
                color: colors.primary,
                border: `1px solid ${colors.primary}50`,
                boxShadow: `0 10px 40px ${colors.primary}25`
              }}
            >
              "{revealedPhrase}"
            </div>
          )}

          {/* Layer legend - hidden on mobile */}
          <div 
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono hidden sm:block"
            style={{ 
              background: `${colors.surface}95`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`
            }}
          >
            <p className="mb-2 opacity-60" style={{ color: colors.text }}>Layers of Being:</p>
            {['cosmic', 'dosha', 'fruit', 'mycelium', 'river', 'herb'].map((layer, i) => (
              <div key={layer} className="flex items-center gap-2 mb-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    background: sacredElements.find(e => e.layer === layer)?.color || colors.primary,
                    opacity: 1 - i * 0.08
                  }}
                />
                <span style={{ color: colors.textMuted, opacity: 1 - i * 0.08 }}>
                  {layer.charAt(0).toUpperCase() + layer.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Element Details */}
        {activeElementData && (
          <div 
            className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-6 sm:mb-8 transition-all duration-500"
            style={{ 
              background: `linear-gradient(135deg, ${activeElementData.color}18, ${colors.surface})`,
              border: `1px solid ${activeElementData.color}60`,
              boxShadow: `0 20px 60px ${activeElementData.color}20`
            }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div 
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: `radial-gradient(circle, ${activeElementData.color}40, ${activeElementData.color}15)`,
                  border: `2px solid ${activeElementData.color}60`
                }}
              >
                <span className="text-2xl sm:text-3xl">{activeElementData.symbol}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold" style={{ color: colors.text }}>
                    {activeElementData.name}
                  </h3>
                  <span 
                    className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-mono"
                    style={{ background: `${activeElementData.color}25`, color: activeElementData.color }}
                  >
                    {activeElementData.layer}
                  </span>
                </div>
                <p className="text-xs sm:text-sm mb-2 sm:mb-3" style={{ color: activeElementData.color }}>
                  {activeElementData.element}
                </p>
                <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4" style={{ color: colors.textMuted }}>
                  {activeElementData.description}
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {activeElementData.connections.map(connId => {
                    const conn = sacredElements.find(e => e.id === connId)
                    return conn ? (
                      <button 
                        key={connId}
                        className="text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer transition-all hover:scale-105"
                        style={{ 
                          background: `${conn.color}18`, 
                          color: conn.color,
                          border: `1px solid ${conn.color}40`
                        }}
                        onClick={() => setActiveElement(connId)}
                      >
                        {conn.symbol} {conn.name}
                      </button>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Life Paths */}
        <div className="mb-6 sm:mb-8">
          <h2 
            className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-center flex items-center justify-center gap-2 sm:gap-3"
            style={{ color: colors.text }}
          >
            <Compass className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: colors.primary }} />
            The Six Paths of Life
            <Compass className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: colors.primary, transform: 'scaleX(-1)' }} />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {lifePaths.map((path) => (
              <button
                key={path.name}
                onClick={() => setSelectedPath(selectedPath === path.name ? null : path.name)}
                className="p-3 sm:p-5 rounded-xl sm:rounded-2xl text-center transition-all duration-300 hover:scale-105"
                style={{
                  background: selectedPath === path.name 
                    ? `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}20)` 
                    : colors.surface,
                  border: `1px solid ${selectedPath === path.name ? colors.primary : colors.border}`,
                  boxShadow: selectedPath === path.name ? `0 10px 40px ${colors.primary}25` : 'none'
                }}
              >
                <p className="text-base sm:text-xl font-mono mb-1 sm:mb-2" style={{ color: colors.primary }}>
                  {path.cipher}
                </p>
                <p className="text-xs sm:text-sm font-semibold" style={{ color: colors.text }}>
                  {path.name}
                </p>
              </button>
            ))}
          </div>
          
          {/* Selected path details */}
          {selectedPathData && (
            <div 
              className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center"
              style={{ 
                background: `${colors.surface}90`,
                border: `1px solid ${colors.border}`
              }}
            >
              <p className="text-sm sm:text-base mb-3 sm:mb-4" style={{ color: colors.textMuted }}>
                {selectedPathData.description}
              </p>
              <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                {selectedPathData.elements.map(elemId => {
                  const elem = sacredElements.find(e => e.id === elemId)
                  return elem ? (
                    <button
                      key={elemId}
                      className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all hover:scale-105"
                      style={{ 
                        background: `${elem.color}20`, 
                        color: elem.color,
                        border: `1px solid ${elem.color}40`
                      }}
                      onClick={() => setActiveElement(elemId)}
                    >
                      {elem.symbol} {elem.name}
                    </button>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>

        {/* Cryptic Footer */}
        <div 
          className="text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl"
          style={{ 
            background: `linear-gradient(180deg, ${colors.surface}, ${colors.background})`,
            border: `1px solid ${colors.border}`
          }}
        >
          <p 
            className="text-[10px] sm:text-xs font-mono tracking-[0.3em] sm:tracking-[0.5em] mb-3 sm:mb-4"
            style={{ color: colors.textMuted }}
          >
            THE NETWORK CONNECTS ALL WHO SEEK
          </p>
          <p 
            className="text-base sm:text-lg font-mono mb-3 sm:mb-4"
            style={{ color: colors.primary }}
          >
            ॐ ☉ ☽ ⊕ ✧ ∞ ❦ 🍄 🍎 🌿 💧 🔮 ॐ
          </p>
          <p 
            className="text-[10px] sm:text-xs font-mono opacity-50 px-2"
            style={{ color: colors.textMuted }}
          >
            "The fruit contains the seed, the seed contains the tree,
            the tree contains the forest, the forest contains the world"
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
