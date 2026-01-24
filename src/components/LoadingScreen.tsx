import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../contexts/ThemeContext'

// Sacred symbols from The Sense
const sacredSymbols = ['॥वात॥', '॥पित्त॥', '॥कफ॥', '☉', '☽', '⊕', '✧', '∞', '🍄', '🍎', '🌿', '💧', '🔮']

// Cryptic loading phrases
const loadingPhrases = [
  'Awakening the mycelium network...',
  'Connecting sacred pathways...',
  'Aligning cosmic frequencies...',
  'Loading ancient wisdom...',
  'Preparing the hidden knowledge...',
  'Synchronizing with the universe...',
  'Opening the gateway...',
  'Gathering sacred elements...',
]

interface LoadingScreenProps {
  onLoadComplete: () => void
  assetsToPreload?: string[]
}

export default function LoadingScreen({ onLoadComplete, assetsToPreload = [] }: LoadingScreenProps) {
  const { colors } = useTheme()
  const [progress, setProgress] = useState(0)
  const [currentPhrase, setCurrentPhrase] = useState(loadingPhrases[0])
  const [symbolPositions, setSymbolPositions] = useState<{ x: number; y: number; symbol: string; delay: number }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(Date.now())

  // Initialize symbol positions
  useEffect(() => {
    const positions = sacredSymbols.map((symbol, i) => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      symbol,
      delay: i * 0.2
    }))
    setSymbolPositions(positions)
  }, [])

  // Rotate loading phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Draw mystical connection lines on canvas
  const drawConnections = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const time = (Date.now() - startTimeRef.current) / 1000
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw flowing connection lines
    symbolPositions.forEach((pos1, i) => {
      symbolPositions.forEach((pos2, j) => {
        if (i >= j) return
        
        const x1 = (pos1.x / 100) * canvas.width
        const y1 = (pos1.y / 100) * canvas.height
        const x2 = (pos2.x / 100) * canvas.width
        const y2 = (pos2.y / 100) * canvas.height
        
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        if (distance > canvas.width * 0.4) return
        
        const opacity = Math.sin(time * 2 + i + j) * 0.3 + 0.3
        
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        
        // Curved connection
        const midX = (x1 + x2) / 2 + Math.sin(time + i) * 30
        const midY = (y1 + y2) / 2 + Math.cos(time + j) * 30
        ctx.quadraticCurveTo(midX, midY, x2, y2)
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        gradient.addColorStop(0, `${colors.primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(0.5, `${colors.secondary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(1, `${colors.primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`)
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.stroke()
      })
    })
    
    animationRef.current = requestAnimationFrame(drawConnections)
  }, [symbolPositions, colors])

  // Start canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    
    animationRef.current = requestAnimationFrame(drawConnections)
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [drawConnections])

  // Preload assets and track progress
  useEffect(() => {
    const preloadAssets = async () => {
      const totalAssets = assetsToPreload.length + 10 // +10 for simulated loading steps
      let loaded = 0

      // Preload images
      const imagePromises = assetsToPreload
        .filter(url => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url))
        .map(url => new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => {
            loaded++
            setProgress((loaded / totalAssets) * 100)
            resolve()
          }
          img.onerror = () => {
            loaded++
            setProgress((loaded / totalAssets) * 100)
            resolve()
          }
          img.src = url
        }))

      // Preload fonts
      if (document.fonts) {
        try {
          await document.fonts.load('1em "Space Grotesk"')
          await document.fonts.load('1em "Orbitron"')
        } catch (e) {
          console.log('Font preload skipped')
        }
      }

      // Simulated loading steps for heavy components
      const simulatedSteps = 10
      for (let i = 0; i < simulatedSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 150))
        loaded++
        setProgress((loaded / totalAssets) * 100)
      }

      await Promise.all(imagePromises)
      
      // Final delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgress(100)
      
      // Wait a bit before completing
      setTimeout(() => {
        onLoadComplete()
      }, 800)
    }

    preloadAssets()
  }, [assetsToPreload, onLoadComplete])

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ 
        background: `radial-gradient(ellipse at center, ${colors.surface}, ${colors.background})`,
      }}
    >
      {/* Mystical connection canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Floating sacred symbols */}
      {symbolPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute text-2xl sm:text-3xl animate-pulse pointer-events-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: 'translate(-50%, -50%)',
            color: colors.primary,
            opacity: 0.4 + Math.sin(Date.now() / 1000 + pos.delay) * 0.3,
            filter: `drop-shadow(0 0 10px ${colors.primary})`,
            animationDelay: `${pos.delay}s`,
            transition: 'opacity 0.5s ease'
          }}
        >
          {pos.symbol}
        </div>
      ))}
      
      {/* Center content */}
      <div className="relative z-10 text-center px-4">
        {/* Central eye symbol */}
        <div 
          className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8 rounded-full flex items-center justify-center animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors.primary}30, transparent)`,
            border: `2px solid ${colors.primary}50`,
            boxShadow: `0 0 60px ${colors.primary}40, inset 0 0 30px ${colors.primary}20`
          }}
        >
          <span 
            className="text-4xl sm:text-5xl"
            style={{ 
              filter: `drop-shadow(0 0 20px ${colors.primary})`,
            }}
          >
            ॐ
          </span>
        </div>
        
        {/* Title */}
        <h1 
          className="text-2xl sm:text-4xl font-bold mb-4"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientShift 3s ease infinite'
          }}
        >
          Entering The Hidden Realm
        </h1>
        
        {/* Loading phrase */}
        <p 
          className="text-sm sm:text-base font-mono mb-8 transition-all duration-500"
          style={{ color: colors.textMuted }}
        >
          {currentPhrase}
        </p>
        
        {/* Progress bar */}
        <div 
          className="w-64 sm:w-80 h-1 mx-auto rounded-full overflow-hidden mb-4"
          style={{ background: `${colors.border}50` }}
        >
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`,
              background: colors.gradient,
              boxShadow: `0 0 20px ${colors.primary}`
            }}
          />
        </div>
        
        {/* Progress percentage */}
        <p 
          className="text-xs font-mono"
          style={{ color: colors.primary }}
        >
          {Math.round(progress)}%
        </p>
        
        {/* Cryptic footer text */}
        <p 
          className="text-xs font-mono mt-8 tracking-widest opacity-50"
          style={{ color: colors.textMuted }}
        >
          [ This knowledge is prohibited to those who seek without reverence ]
        </p>
      </div>
      
      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
