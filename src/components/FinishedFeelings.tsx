import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, Pause } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const videos = [
  { src: '/videos/finished1.mp4', title: 'Project Alpha' },
  { src: '/videos/finished2.mp4', title: 'Project Beta' },
  { src: '/videos/finished3.mp4', title: 'Project Gamma' },
  { src: '/videos/finished4.mp4', title: 'Project Delta' },
  { src: '/videos/finished5.mp4', title: 'Project Epsilon' },
]

function VideoCard({ video, index }: { video: typeof videos[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    return () => ctx.revert()
  }, [index])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div
      ref={cardRef}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shadow outline effect */}
      <div 
        className="absolute -inset-1 rounded-2xl opacity-60 transition-all duration-700"
        style={{ 
          background: isHovered 
            ? 'linear-gradient(135deg, #e879a9, #f4a574, #f0d878, #7dd3a8, #7ec8d8, #7ba3d8, #a78bcc)'
            : 'rgba(167, 139, 204, 0.3)',
          filter: 'blur(8px)',
          animation: isHovered ? 'rainbow-shift 3s linear infinite' : 'none'
        }}
      />
      
      <div className="relative glass rounded-2xl overflow-hidden thin-rainbow-border">
        {/* Video container */}
        <div className="relative aspect-video bg-black/50">
          <video
            ref={videoRef}
            src={video.src}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            onEnded={() => setIsPlaying(false)}
          />
          
          {/* Play button overlay */}
          <div 
            className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
          >
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
              style={{
                background: isHovered 
                  ? 'linear-gradient(135deg, #e879a9, #7ec8d8)'
                  : 'rgba(167, 139, 204, 0.5)',
                boxShadow: isHovered 
                  ? '0 0 30px rgba(232, 121, 169, 0.5), 0 0 60px rgba(126, 200, 216, 0.3)'
                  : '0 0 20px rgba(167, 139, 204, 0.3)',
                animation: isHovered ? 'rainbow-shift 2s linear infinite' : 'none'
              }}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
          </div>
        </div>
        
        {/* Title bar */}
        <div className="p-4 bg-black/20">
          <h3 className="text-lg font-semibold orbitron text-white/80 group-hover:text-white transition-colors">
            {video.title}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default function FinishedFeelings() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="finished-feelings" className="relative py-28 px-4 md:px-8">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(244, 165, 116, 0.04)' }} />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(167, 139, 204, 0.04)' }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full mb-6 thin-rainbow-border">
            <div className="w-2 h-2 rounded-full aurora-bg" />
            <span className="text-xs text-white/60 uppercase tracking-wider">Portfolio</span>
          </div>
          
          <h2 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold orbitron mb-6">
            <span className="rainbow-text">Finished Feelings</span>
          </h2>
          <p className="text-lg text-white/45 max-w-3xl mx-auto leading-relaxed">
            A showcase of completed projects that embody our vision of excellence.
            Each piece crafted with passion and precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <VideoCard key={video.src} video={video} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
