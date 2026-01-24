// Asset Preloader Utility
// Preloads images, fonts, and other assets to RAM/GPU for smooth performance

interface PreloadOptions {
  onProgress?: (progress: number) => void
  onComplete?: () => void
  priority?: 'high' | 'low'
}

// Cache for preloaded assets
const assetCache = new Map<string, HTMLImageElement | HTMLVideoElement | ArrayBuffer>()

// Preload a single image
export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (assetCache.has(url)) {
      resolve(assetCache.get(url) as HTMLImageElement)
      return
    }
    
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      assetCache.set(url, img)
      resolve(img)
    }
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`))
    }
    
    img.src = url
  })
}

// Preload a video for GPU-accelerated playback
export function preloadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    if (assetCache.has(url)) {
      resolve(assetCache.get(url) as HTMLVideoElement)
      return
    }
    
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    
    video.oncanplaythrough = () => {
      assetCache.set(url, video)
      resolve(video)
    }
    
    video.onerror = () => {
      reject(new Error(`Failed to load video: ${url}`))
    }
    
    video.src = url
    video.load()
  })
}

// Preload binary data (for WebAssembly or binary assets)
export async function preloadBinary(url: string): Promise<ArrayBuffer> {
  if (assetCache.has(url)) {
    return assetCache.get(url) as ArrayBuffer
  }
  
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  assetCache.set(url, buffer)
  return buffer
}

// Preload fonts
export async function preloadFonts(fonts: string[]): Promise<void> {
  if (!document.fonts) return
  
  const fontPromises = fonts.map(font => 
    document.fonts.load(`1em "${font}"`).catch(() => {
      console.warn(`Failed to preload font: ${font}`)
    })
  )
  
  await Promise.all(fontPromises)
}

// Batch preload multiple assets
export async function preloadAssets(
  assets: { url: string; type: 'image' | 'video' | 'binary' }[],
  options: PreloadOptions = {}
): Promise<void> {
  const { onProgress, onComplete } = options
  let loaded = 0
  const total = assets.length
  
  const promises = assets.map(async (asset) => {
    try {
      switch (asset.type) {
        case 'image':
          await preloadImage(asset.url)
          break
        case 'video':
          await preloadVideo(asset.url)
          break
        case 'binary':
          await preloadBinary(asset.url)
          break
      }
    } catch (error) {
      console.warn(`Failed to preload: ${asset.url}`)
    }
    
    loaded++
    onProgress?.(loaded / total)
  })
  
  await Promise.all(promises)
  onComplete?.()
}

// GPU texture preloading using WebGL
export function preloadToGPU(images: HTMLImageElement[]): void {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  if (!gl) {
    console.warn('WebGL not available for GPU preloading')
    return
  }
  
  images.forEach(img => {
    const texture = (gl as WebGLRenderingContext).createTexture()
    ;(gl as WebGLRenderingContext).bindTexture((gl as WebGLRenderingContext).TEXTURE_2D, texture)
    ;(gl as WebGLRenderingContext).texImage2D(
      (gl as WebGLRenderingContext).TEXTURE_2D,
      0,
      (gl as WebGLRenderingContext).RGBA,
      (gl as WebGLRenderingContext).RGBA,
      (gl as WebGLRenderingContext).UNSIGNED_BYTE,
      img
    )
  })
}

// Memory-efficient typed array for canvas operations
export function createOptimizedBuffer(width: number, height: number): {
  buffer: Uint8ClampedArray
  imageData: ImageData
} {
  const buffer = new Uint8ClampedArray(width * height * 4)
  const imageData = new ImageData(buffer, width, height)
  return { buffer, imageData }
}

// Request idle callback polyfill
export function requestIdleCallback(callback: () => void, timeout = 1000): void {
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => void })
      .requestIdleCallback(callback, { timeout })
  } else {
    setTimeout(callback, 1)
  }
}

// Preload critical CSS
export function preloadCSS(href: string): Promise<void> {
  return new Promise((resolve) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => resolve()
    document.head.appendChild(link)
  })
}

// Get cached asset
export function getCachedAsset<T>(url: string): T | undefined {
  return assetCache.get(url) as T | undefined
}

// Clear asset cache
export function clearAssetCache(): void {
  assetCache.clear()
}

// Check if asset is cached
export function isAssetCached(url: string): boolean {
  return assetCache.has(url)
}
