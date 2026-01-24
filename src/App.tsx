import { useEffect, useRef, useState, lazy, Suspense, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import Scene3D from './components/Scene3D'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import NewAgeTech from './components/NewAgeTech'
import TechShowcase from './components/TechShowcase'
import WebServices from './components/WebServices'
import PricingSection from './components/PricingSection'
import URLPreview from './components/URLPreview'
import Footer from './components/Footer'
import AccessibilityMenu from './components/AccessibilityMenu'
import LeftSideMenu from './components/LeftSideMenu'
import Navigation, { PageType } from './components/Navigation'
import LoadingScreen from './components/LoadingScreen'
import { preloadFonts } from './utils/assetPreloader'
import { getDeviceCapabilities } from './utils/performanceOptimizer'

// Lazy load pages for better performance - only loads when navigated to
const TechPage = lazy(() => import('./pages/TechPage'))
const MindMapPage = lazy(() => import('./pages/MindMapPage'))
const HelperPage = lazy(() => import('./pages/HelperPage'))
const CataloguePage = lazy(() => import('./pages/CataloguePage'))
const EnterprisePage = lazy(() => import('./pages/EnterprisePage'))
const SensePage = lazy(() => import('./pages/SensePage'))

gsap.registerPlugin(ScrollTrigger)

// Loading fallback for lazy-loaded pages
function PageLoader() {
  const { colors } = useTheme()
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'transparent' }}
    >
      <div className="text-center">
        <div 
          className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
          style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
        />
        <p style={{ color: colors.textMuted }}>Loading...</p>
      </div>
    </div>
  )
}

function MainPage() {
  useEffect(() => {
    const sections = document.querySelectorAll('section')
    
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0.3 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <>
      <HeroSection />
      <AboutSection />
      <NewAgeTech />
      <TechShowcase />
      <WebServices />
      <PricingSection />
      <div id="portals">
        <URLPreview />
      </div>
      <Footer />
    </>
  )
}

function App() {
  const mainRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState<PageType>('main')
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  // Handle loading complete
  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
    // Slight delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 100)
  }, [])

  // Preload fonts and detect device capabilities on mount
  useEffect(() => {
    const init = async () => {
      // Log device capabilities for debugging
      const caps = getDeviceCapabilities()
      console.log('[Performance] Device capabilities:', caps)
      
      // Preload critical fonts
      await preloadFonts(['Space Grotesk', 'Orbitron'])
    }
    init()
  }, [])

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollProgress = document.getElementById('scroll-progress')
      if (scrollProgress) {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
        scrollProgress.style.width = `${scrollPercent}%`
      }
    }

    window.addEventListener('scroll', updateScrollProgress)
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
    }
  }, [])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'main':
        return <MainPage />
      case 'tech':
        return <Suspense fallback={<PageLoader />}><TechPage /></Suspense>
      case 'mindmap':
        return <Suspense fallback={<PageLoader />}><MindMapPage /></Suspense>
      case 'helper':
        return <Suspense fallback={<PageLoader />}><HelperPage /></Suspense>
      case 'catalogue':
        return <Suspense fallback={<PageLoader />}><CataloguePage /></Suspense>
      case 'enterprise':
        return <Suspense fallback={<PageLoader />}><EnterprisePage /></Suspense>
      case 'sense':
        return <Suspense fallback={<PageLoader />}><SensePage /></Suspense>
      default:
        return <MainPage />
    }
  }

  return (
    <ThemeProvider>
      {/* Sacred Loading Screen - shows until content is ready */}
      {isLoading && (
        <LoadingScreen onLoadComplete={handleLoadComplete} />
      )}
      
      {/* Main Content - only render after loading complete for instant first frame */}
      {showContent && (
        <div 
          ref={mainRef} 
          className="relative min-h-screen bg-black text-white overflow-x-hidden animate-fadeIn"
        >
          {/* Scene3D only renders after loading - prevents competing with initial render */}
          <Scene3D />
          <AccessibilityMenu />
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
          <LeftSideMenu />
          
          <div className="relative z-10 pt-24">
            {renderPage()}
          </div>

          {/* Scroll progress bar - only show on main page */}
          {currentPage === 'main' && (
            <div className="fixed top-24 left-0 w-full h-1 z-30">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
                style={{
                  width: '0%',
                  transition: 'width 0.1s ease-out'
                }}
                id="scroll-progress"
              />
            </div>
          )}
        </div>
      )}
    </ThemeProvider>
  )
}

export default App
