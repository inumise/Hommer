// Performance Optimizer Utility
// Advanced optimizations for high-end graphical web applications

// Detect device capabilities
export function getDeviceCapabilities() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : isMobile
  const hasWebGL = (() => {
    try {
      const canvas = document.createElement('canvas')
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch {
      return false
    }
  })()
  const hasOffscreenCanvas = typeof OffscreenCanvas !== 'undefined'
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  return {
    isMobile,
    isLowEnd,
    hasWebGL,
    hasOffscreenCanvas,
    prefersReducedMotion,
    cores: navigator.hardwareConcurrency || 4,
    memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4
  }
}

// Adaptive quality settings based on device
export function getQualitySettings() {
  const caps = getDeviceCapabilities()
  
  if (caps.prefersReducedMotion) {
    return {
      particleCount: 0,
      animationSpeed: 0,
      blurEffects: false,
      shadowEffects: false,
      connectionLines: false,
      canvasResolution: 0.5
    }
  }
  
  if (caps.isLowEnd || caps.isMobile) {
    return {
      particleCount: 20,
      animationSpeed: 0.5,
      blurEffects: false,
      shadowEffects: false,
      connectionLines: true,
      canvasResolution: 0.75
    }
  }
  
  return {
    particleCount: 100,
    animationSpeed: 1,
    blurEffects: true,
    shadowEffects: true,
    connectionLines: true,
    canvasResolution: 1
  }
}

// Throttle function for performance
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Debounce function for performance
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function(this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// RAF-based animation loop with frame skipping
export function createAnimationLoop(
  callback: (deltaTime: number, frameCount: number) => void,
  targetFPS = 60
): { start: () => void; stop: () => void } {
  let animationId: number | null = null
  let lastTime = 0
  let frameCount = 0
  const frameInterval = 1000 / targetFPS
  
  const loop = (currentTime: number) => {
    animationId = requestAnimationFrame(loop)
    
    const deltaTime = currentTime - lastTime
    
    // Skip frames if running too fast
    if (deltaTime < frameInterval) return
    
    lastTime = currentTime - (deltaTime % frameInterval)
    frameCount++
    
    callback(deltaTime, frameCount)
  }
  
  return {
    start: () => {
      if (animationId === null) {
        lastTime = performance.now()
        animationId = requestAnimationFrame(loop)
      }
    },
    stop: () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    }
  }
}

// Object pool for reducing garbage collection
export class ObjectPool<T> {
  private pool: T[] = []
  private factory: () => T
  private reset: (obj: T) => void
  
  constructor(factory: () => T, reset: (obj: T) => void, initialSize = 10) {
    this.factory = factory
    this.reset = reset
    
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory())
    }
  }
  
  acquire(): T {
    return this.pool.pop() || this.factory()
  }
  
  release(obj: T): void {
    this.reset(obj)
    this.pool.push(obj)
  }
}

// Lazy load component with intersection observer
export function lazyLoadOnVisible(
  element: HTMLElement,
  callback: () => void,
  options: IntersectionObserverInit = {}
): () => void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback()
        observer.disconnect()
      }
    })
  }, { threshold: 0.1, ...options })
  
  observer.observe(element)
  
  return () => observer.disconnect()
}

// Memory-efficient canvas rendering
export function createOffscreenCanvas(width: number, height: number): {
  canvas: OffscreenCanvas | HTMLCanvasElement
  ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
} {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')!
    return { canvas, ctx }
  }
  
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  return { canvas, ctx }
}

// GPU-accelerated CSS transforms
export function applyGPUAcceleration(element: HTMLElement): void {
  element.style.transform = 'translateZ(0)'
  element.style.willChange = 'transform'
  element.style.backfaceVisibility = 'hidden'
}

// Batch DOM updates
export function batchDOMUpdates(updates: (() => void)[]): void {
  requestAnimationFrame(() => {
    updates.forEach(update => update())
  })
}

// Measure performance
export function measurePerformance(name: string, fn: () => void): number {
  const start = performance.now()
  fn()
  const end = performance.now()
  const duration = end - start
  console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
  return duration
}

// Web Worker helper for heavy computations
export function createWorker(workerFunction: () => void): Worker | null {
  try {
    const blob = new Blob([`(${workerFunction.toString()})()`], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    URL.revokeObjectURL(url)
    return worker
  } catch {
    console.warn('Web Workers not supported')
    return null
  }
}

// Compress image data using canvas
export async function compressImage(
  imageData: ImageData,
  quality = 0.8
): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = imageData.width
  canvas.height = imageData.height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  
  ctx.putImageData(imageData, 0, 0)
  
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/webp', quality)
  })
}

// Binary data utilities
export const BinaryUtils = {
  // Convert float array to binary
  floatArrayToBuffer(arr: number[]): ArrayBuffer {
    const buffer = new ArrayBuffer(arr.length * 4)
    const view = new Float32Array(buffer)
    arr.forEach((val, i) => view[i] = val)
    return buffer
  },
  
  // Convert binary to float array
  bufferToFloatArray(buffer: ArrayBuffer): number[] {
    const view = new Float32Array(buffer)
    return Array.from(view)
  },
  
  // Compress data using simple RLE
  compressRLE(data: Uint8Array): Uint8Array {
    const result: number[] = []
    let i = 0
    
    while (i < data.length) {
      let count = 1
      while (i + count < data.length && data[i] === data[i + count] && count < 255) {
        count++
      }
      result.push(count, data[i])
      i += count
    }
    
    return new Uint8Array(result)
  }
}
