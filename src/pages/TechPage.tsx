import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Layers, Box, Sparkles, Zap, Eye, Cpu, 
  Palette, Code, Database, Cloud, Shield, 
  Smartphone, Globe, MessageSquare, Bot,
  BarChart3, Lock, Workflow, Puzzle, Wand2
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

gsap.registerPlugin(ScrollTrigger)

const technologies = [
  {
    category: 'Visual Design',
    items: [
      { icon: Layers, name: 'Wireframes & Outlines', description: 'Precision structural blueprints', preview: 'Holographic rendering' },
      { icon: Palette, name: 'Color Systems', description: 'Dynamic theme generation', preview: 'AI-powered palettes' },
      { icon: Eye, name: 'Visual Effects', description: 'Post-processing shaders', preview: 'Real-time compositing' },
      { icon: Sparkles, name: 'Motion Graphics', description: 'Cinematic animations', preview: 'Timeline orchestration' },
    ]
  },
  {
    category: '3D & Animation',
    items: [
      { icon: Box, name: '3D Rendering', description: 'GPU-accelerated graphics', preview: 'WebGL 2.0 powered' },
      { icon: Zap, name: 'Particle Systems', description: 'Dynamic particle effects', preview: 'Physics simulation' },
      { icon: Wand2, name: 'Procedural Generation', description: 'Algorithmic content', preview: 'Infinite variations' },
      { icon: Workflow, name: 'Animation Pipelines', description: 'Keyframe automation', preview: 'Smooth 60fps' },
    ]
  },
  {
    category: 'AI & Intelligence',
    items: [
      { icon: Bot, name: 'AI Chatbots', description: 'Conversational agents', preview: 'Natural language' },
      { icon: MessageSquare, name: 'Voice Assistants', description: 'Speech recognition', preview: 'Real-time processing' },
      { icon: Cpu, name: 'Machine Learning', description: 'Predictive analytics', preview: 'Neural networks' },
      { icon: BarChart3, name: 'Data Intelligence', description: 'Business insights', preview: 'Pattern recognition' },
    ]
  },
  {
    category: 'Infrastructure',
    items: [
      { icon: Cloud, name: 'Cloud Systems', description: 'Scalable architecture', preview: 'Global deployment' },
      { icon: Database, name: 'Data Management', description: 'Secure storage', preview: 'Real-time sync' },
      { icon: Shield, name: 'Security', description: 'Enterprise protection', preview: 'Zero-trust model' },
      { icon: Lock, name: 'Authentication', description: 'Identity management', preview: 'Multi-factor auth' },
    ]
  },
  {
    category: 'Development',
    items: [
      { icon: Code, name: 'Custom Development', description: 'Bespoke solutions', preview: 'Full-stack expertise' },
      { icon: Puzzle, name: 'API Integration', description: 'System connectivity', preview: 'RESTful & GraphQL' },
      { icon: Smartphone, name: 'Mobile Apps', description: 'Cross-platform', preview: 'Native performance' },
      { icon: Globe, name: 'Web Applications', description: 'Progressive web apps', preview: 'Offline capable' },
    ]
  },
]

function TechCard({ item, index }: { item: typeof technologies[0]['items'][0]; index: number }) {
  const { colors } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const Icon = item.icon

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: index * 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, card)

    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={cardRef}
      className="relative rounded-lg sm:rounded-xl p-3 sm:p-5 transition-all duration-300 cursor-pointer group"
      style={{
        background: isHovered ? `${colors.primary}15` : colors.surface,
        border: `1px solid ${isHovered ? colors.primary + '40' : colors.border}`,
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? `0 10px 40px ${colors.primary}20` : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon with preview animation */}
      <div className="relative mb-2 sm:mb-4">
        <div 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300"
          style={{ 
            background: `${colors.primary}20`,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <Icon 
            className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300" 
            style={{ 
              color: colors.primary,
              filter: isHovered ? `drop-shadow(0 0 8px ${colors.primary})` : 'none'
            }} 
          />
        </div>
        
        {/* Preview badge on hover - hidden on mobile */}
        <div 
          className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hidden sm:block"
          style={{
            background: colors.gradient,
            color: colors.background,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.8)'
          }}
        >
          {item.preview}
        </div>
      </div>

      {/* Content */}
      <h3 
        className="font-semibold mb-1 transition-colors duration-300 text-sm sm:text-base"
        style={{ color: isHovered ? colors.primary : colors.text }}
      >
        {item.name}
      </h3>
      <p 
        className="text-xs sm:text-sm line-clamp-2"
        style={{ color: colors.textMuted }}
      >
        {item.description}
      </p>

      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${colors.primary}10, transparent 70%)`,
          opacity: isHovered ? 1 : 0
        }}
      />
    </div>
  )
}

export default function TechPage() {
  const { colors } = useTheme()
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-12 sm:pb-20 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <p 
            className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4"
            style={{ color: colors.textMuted }}
          >
            Technology Stack
          </p>
          <h1 
            ref={titleRef}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6"
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
              Our Technologies
            </span>
          </h1>
          <p 
            className="text-sm sm:text-lg max-w-2xl mx-auto px-2"
            style={{ color: colors.textMuted }}
          >
            Cutting-edge tools and frameworks powering next-generation digital experiences
          </p>
        </div>

        {/* Technology Categories */}
        {technologies.map((category, catIndex) => (
          <div key={category.category} className="mb-8 sm:mb-16">
            <h2 
              className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
              style={{ color: colors.text }}
            >
              <div 
                className="w-1 h-5 sm:h-6 rounded-full"
                style={{ background: colors.gradient }}
              />
              {category.category}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {category.items.map((item, itemIndex) => (
                <TechCard 
                  key={item.name} 
                  item={item} 
                  index={catIndex * 4 + itemIndex} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
