import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'

// Cryptic loading phrases
const loadingPhrases = [
  'Awakening the mycelium network...',
  'Connecting sacred pathways...',
  'Aligning cosmic frequencies...',
  'Loading ancient wisdom...',
  'Preparing the hidden knowledge...',
]

interface LoadingScreenProps {
  onLoadComplete: () => void
  assetsToPreload?: string[]
}

// OPTIMIZED: Simplified loading screen - no canvas animation to compete with initial render
export default function LoadingScreen({ onLoadComplete, assetsToPreload = [] }: LoadingScreenProps) {
  const { colors } = useTheme()
  const [progress, setProgress] = useState(0)
  const [currentPhrase, setCurrentPhrase] = useState(loadingPhrases[0])
  const phraseIndexRef = useRef(0)

  // Rotate loading phrases - simple interval, no heavy computation
  useEffect(() => {
    const interval = setInterval(() => {
      phraseIndexRef.current = (phraseIndexRef.current + 1) % loadingPhrases.length
      setCurrentPhrase(loadingPhrases[phraseIndexRef.current])
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  // Fast loading - minimal delays, just preload fonts
  useEffect(() => {
    const preloadAssets = async () => {
      let loaded = 0
      const totalSteps = 5 // Reduced from 10 for faster loading

      // Preload fonts first (critical)
      if (document.fonts) {
        try {
          await Promise.race([
            document.fonts.load('1em "Space Grotesk"'),
            new Promise(resolve => setTimeout(resolve, 500)) // Timeout after 500ms
          ])
          loaded++
          setProgress((loaded / totalSteps) * 100)
          
          await Promise.race([
            document.fonts.load('1em "Orbitron"'),
            new Promise(resolve => setTimeout(resolve, 500))
          ])
          loaded++
          setProgress((loaded / totalSteps) * 100)
        } catch {
          loaded += 2
          setProgress((loaded / totalSteps) * 100)
        }
      } else {
        loaded += 2
        setProgress((loaded / totalSteps) * 100)
      }

      // Preload images if any
      if (assetsToPreload.length > 0) {
        const imagePromises = assetsToPreload
          .filter(url => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url))
          .map(url => new Promise<void>((resolve) => {
            const img = new Image()
            img.onload = () => resolve()
            img.onerror = () => resolve()
            img.src = url
          }))
        await Promise.race([
          Promise.all(imagePromises),
          new Promise(resolve => setTimeout(resolve, 1000)) // Max 1s for images
        ])
      }
      loaded++
      setProgress((loaded / totalSteps) * 100)

      // Quick simulated steps (reduced delay)
      for (let i = 0; i < 2; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        loaded++
        setProgress((loaded / totalSteps) * 100)
      }
      
      // Complete immediately
      setProgress(100)
      
      // Minimal delay before completing - just enough for visual feedback
      setTimeout(() => {
        onLoadComplete()
      }, 200)
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
      {/* Simple CSS-only decorative elements - no canvas for fast first paint */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, ${colors.primary}30 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, ${colors.secondary}30 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, ${colors.primary}20 0%, transparent 50%)
          `
        }}
      />
      
      {/* Center content */}
      <div className="relative z-10 text-center px-4">
        {/* Central symbol - CSS animation only */}
        <div 
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${colors.primary}30, transparent)`,
            border: `2px solid ${colors.primary}50`,
            boxShadow: `0 0 40px ${colors.primary}30`,
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          <span 
            className="text-3xl sm:text-4xl"
            style={{ color: colors.primary }}
          >
            ॐ
          </span>
        </div>
        
        {/* Title */}
        <h1 
          className="text-xl sm:text-3xl font-bold mb-3"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Entering The Hidden Realm
        </h1>
        
        {/* Loading phrase */}
        <p 
          className="text-sm font-mono mb-6"
          style={{ color: colors.textMuted }}
        >
          {currentPhrase}
        </p>
        
        {/* Progress bar */}
        <div 
          className="w-56 sm:w-72 h-1 mx-auto rounded-full overflow-hidden mb-3"
          style={{ background: `${colors.border}50` }}
        >
          <div 
            className="h-full rounded-full transition-all duration-200 ease-out"
            style={{ 
              width: `${progress}%`,
              background: colors.gradient,
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
      </div>
      
      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
