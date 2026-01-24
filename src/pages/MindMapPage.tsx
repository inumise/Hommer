import { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Plus, Trash2, ZoomIn, ZoomOut, Download, Upload, Undo, Redo,
  MessageSquare, Globe, ShoppingCart, Phone, Bot, Cog, 
  Palette, Database, Shield, Zap, ArrowRight, ArrowLeft,
  Link2, Unlink
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

// Premade tech items with inputs and outputs
const techItems = [
  { 
    id: 'ai-chatbot', 
    name: 'AI Chatbot', 
    icon: MessageSquare, 
    color: '#e879a9',
    description: 'Intelligent conversational assistant',
    inputs: ['Training Data', 'Business Rules', 'Knowledge Base'],
    outputs: ['Customer Support', 'Lead Generation', 'FAQ Handling'],
    category: 'AI'
  },
  { 
    id: 'web-design', 
    name: 'Web Design', 
    icon: Palette, 
    color: '#7ec8d8',
    description: 'Custom responsive website design',
    inputs: ['Brand Guidelines', 'Content', 'Wireframes'],
    outputs: ['Responsive Website', 'UI Components', 'Style Guide'],
    category: 'Design'
  },
  { 
    id: 'ecommerce', 
    name: 'E-Commerce', 
    icon: ShoppingCart, 
    color: '#7dd3a8',
    description: 'Online store with payment processing',
    inputs: ['Product Catalog', 'Payment Setup', 'Shipping Rules'],
    outputs: ['Online Store', 'Order Management', 'Analytics'],
    category: 'Commerce'
  },
  { 
    id: 'phone-assistant', 
    name: 'Phone Assistant', 
    icon: Phone, 
    color: '#f4a574',
    description: 'AI-powered phone call handling',
    inputs: ['Call Scripts', 'Knowledge Base', 'Routing Rules'],
    outputs: ['Call Handling', 'Appointment Booking', 'Lead Capture'],
    category: 'AI'
  },
  { 
    id: 'automation', 
    name: 'Automation', 
    icon: Bot, 
    color: '#a78bcc',
    description: 'Workflow and task automation',
    inputs: ['Workflows', 'Triggers', 'API Connections'],
    outputs: ['Automated Tasks', 'Notifications', 'Reports'],
    category: 'Backend'
  },
  { 
    id: 'api-integration', 
    name: 'API Integration', 
    icon: Cog, 
    color: '#f0d878',
    description: 'Connect external services and APIs',
    inputs: ['API Keys', 'Endpoints', 'Data Mapping'],
    outputs: ['Data Sync', 'Webhooks', 'Real-time Updates'],
    category: 'Backend'
  },
  { 
    id: 'database', 
    name: 'Database', 
    icon: Database, 
    color: '#7ba3d8',
    description: 'Data storage and management',
    inputs: ['Schema Design', 'Data Models', 'Queries'],
    outputs: ['Data Storage', 'Backups', 'Analytics'],
    category: 'Backend'
  },
  { 
    id: 'security', 
    name: 'Security', 
    icon: Shield, 
    color: '#c9a0c9',
    description: 'Authentication and data protection',
    inputs: ['Auth Rules', 'Encryption Keys', 'Access Policies'],
    outputs: ['User Auth', 'Data Protection', 'Audit Logs'],
    category: 'Backend'
  },
  { 
    id: 'hosting', 
    name: 'Hosting', 
    icon: Globe, 
    color: '#8b7355',
    description: 'Cloud hosting and deployment',
    inputs: ['Domain', 'SSL Cert', 'Server Config'],
    outputs: ['Live Website', 'CDN', 'Monitoring'],
    category: 'Infrastructure'
  },
  { 
    id: 'performance', 
    name: 'Performance', 
    icon: Zap, 
    color: '#98fb98',
    description: 'Speed optimization and caching',
    inputs: ['Performance Audit', 'Cache Rules', 'CDN Config'],
    outputs: ['Fast Loading', 'Optimized Assets', 'Core Web Vitals'],
    category: 'Infrastructure'
  },
]

interface TechNode {
  id: string
  techId: string
  x: number
  y: number
  width: number
  height: number
}

interface Connection {
  id: string
  fromNodeId: string
  fromPort: 'output'
  fromIndex: number
  toNodeId: string
  toPort: 'input'
  toIndex: number
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function TechNodeComponent({ 
  node, 
  tech,
  isSelected, 
  onSelect, 
  onDelete,
  onDragStart,
  onStartConnection,
  onEndConnection,
  colors,
  connectingFrom
}: { 
  node: TechNode
  tech: typeof techItems[0]
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDragStart: (e: React.MouseEvent) => void
  onStartConnection: (nodeId: string, port: 'input' | 'output', index: number) => void
  onEndConnection: (nodeId: string, port: 'input' | 'output', index: number) => void
  colors: ReturnType<typeof useTheme>['colors']
  connectingFrom: { nodeId: string; port: 'input' | 'output'; index: number } | null
}) {
  const Icon = tech.icon

  return (
    <div
      className="absolute cursor-move group"
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
      }}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onMouseDown={onDragStart}
    >
      {/* Node container */}
      <div
        className="relative rounded-2xl p-4 transition-all duration-200"
        style={{
          background: `linear-gradient(135deg, ${tech.color}15, ${colors.surface})`,
          border: `2px solid ${isSelected ? tech.color : colors.border}`,
          boxShadow: isSelected ? `0 0 30px ${tech.color}40` : `0 4px 20px ${colors.background}80`,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${tech.color}25` }}
          >
            <Icon className="w-5 h-5" style={{ color: tech.color }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm" style={{ color: colors.text }}>{tech.name}</h3>
            <p className="text-xs" style={{ color: colors.textMuted }}>{tech.category}</p>
          </div>
          <span 
            className="text-xs px-2 py-1 rounded-full"
            style={{ background: `${tech.color}20`, color: tech.color }}
          >
            Tech
          </span>
        </div>

        {/* Description */}
        <p className="text-xs mb-4" style={{ color: colors.textMuted }}>
          {tech.description}
        </p>

        {/* Inputs */}
        <div className="mb-3">
          <p className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: colors.text }}>
            <ArrowRight className="w-3 h-3" style={{ color: '#7dd3a8' }} />
            Inputs
          </p>
          <div className="space-y-1">
            {tech.inputs.map((input, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 text-xs p-2 rounded-lg cursor-pointer transition-all hover:scale-102"
                style={{ background: colors.background }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (connectingFrom && connectingFrom.port === 'output') {
                    onEndConnection(node.id, 'input', i)
                  } else {
                    onStartConnection(node.id, 'input', i)
                  }
                }}
              >
                <div 
                  className="w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all"
                  style={{ 
                    borderColor: '#7dd3a8',
                    background: connectingFrom?.nodeId === node.id && connectingFrom?.port === 'input' && connectingFrom?.index === i 
                      ? '#7dd3a8' 
                      : 'transparent'
                  }}
                />
                <span style={{ color: colors.textMuted }}>{input}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Outputs */}
        <div>
          <p className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: colors.text }}>
            <ArrowLeft className="w-3 h-3" style={{ color: '#e879a9' }} />
            Outputs
          </p>
          <div className="space-y-1">
            {tech.outputs.map((output, i) => (
              <div 
                key={i}
                className="flex items-center justify-end gap-2 text-xs p-2 rounded-lg cursor-pointer transition-all hover:scale-102"
                style={{ background: colors.background }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (connectingFrom && connectingFrom.port === 'input') {
                    onEndConnection(node.id, 'output', i)
                  } else {
                    onStartConnection(node.id, 'output', i)
                  }
                }}
              >
                <span style={{ color: colors.textMuted }}>{output}</span>
                <div 
                  className="w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all"
                  style={{ 
                    borderColor: '#e879a9',
                    background: connectingFrom?.nodeId === node.id && connectingFrom?.port === 'output' && connectingFrom?.index === i 
                      ? '#e879a9' 
                      : 'transparent'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Delete button on hover */}
        <button
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: '#ef4444', color: 'white' }}
          onClick={(e) => { e.stopPropagation(); onDelete() }}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

export default function MindMapPage() {
  const { colors } = useTheme()
  const [nodes, setNodes] = useState<TechNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connectingFrom, setConnectingFrom] = useState<{ nodeId: string; port: 'input' | 'output'; index: number } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [history, setHistory] = useState<{ nodes: TechNode[]; connections: Connection[] }[]>([{ nodes: [], connections: [] }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addNode = (techId: string) => {
    const tech = techItems.find(t => t.id === techId)
    if (!tech) return
    
    const newNode: TechNode = {
      id: generateId(),
      techId,
      x: 100 + Math.random() * 300,
      y: 100 + Math.random() * 200,
      width: 280,
      height: 300,
    }
    const newNodes = [...nodes, newNode]
    setNodes(newNodes)
    saveToHistory(newNodes, connections)
    setSelectedNode(newNode.id)
  }

  const deleteNode = (id: string) => {
    const newNodes = nodes.filter(n => n.id !== id)
    const newConnections = connections.filter(c => c.fromNodeId !== id && c.toNodeId !== id)
    setNodes(newNodes)
    setConnections(newConnections)
    saveToHistory(newNodes, newConnections)
    setSelectedNode(null)
  }

  const saveToHistory = (newNodes: TechNode[], newConnections: Connection[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ nodes: newNodes, connections: newConnections })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setNodes(history[historyIndex - 1].nodes)
      setConnections(history[historyIndex - 1].connections)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setNodes(history[historyIndex + 1].nodes)
      setConnections(history[historyIndex + 1].connections)
    }
  }

  const handleDragStart = (nodeId: string, e: React.MouseEvent) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return
    setIsDragging(true)
    setSelectedNode(nodeId)
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    })
  }

  const handleDrag = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
    
    if (!isDragging || !selectedNode) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const newX = (e.clientX - rect.left - dragOffset.x + rect.left) / zoom
    const newY = (e.clientY - rect.top - dragOffset.y + rect.top) / zoom
    
    setNodes(prev => prev.map(n => n.id === selectedNode ? { ...n, x: newX, y: newY } : n))
  }, [isDragging, selectedNode, dragOffset, zoom])

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      saveToHistory(nodes, connections)
    }
  }, [isDragging, nodes, connections])

  useEffect(() => {
    window.addEventListener('mousemove', handleDrag)
    window.addEventListener('mouseup', handleDragEnd)
    return () => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [handleDrag, handleDragEnd])

  const handleStartConnection = (nodeId: string, port: 'input' | 'output', index: number) => {
    setConnectingFrom({ nodeId, port, index })
  }

  const handleEndConnection = (nodeId: string, port: 'input' | 'output', index: number) => {
    if (!connectingFrom) return
    if (connectingFrom.nodeId === nodeId) {
      setConnectingFrom(null)
      return
    }
    
    // Only allow output -> input connections
    if (connectingFrom.port === 'output' && port === 'input') {
      const newConnection: Connection = {
        id: generateId(),
        fromNodeId: connectingFrom.nodeId,
        fromPort: 'output',
        fromIndex: connectingFrom.index,
        toNodeId: nodeId,
        toPort: 'input',
        toIndex: index,
      }
      const newConnections = [...connections, newConnection]
      setConnections(newConnections)
      saveToHistory(nodes, newConnections)
    } else if (connectingFrom.port === 'input' && port === 'output') {
      const newConnection: Connection = {
        id: generateId(),
        fromNodeId: nodeId,
        fromPort: 'output',
        fromIndex: index,
        toNodeId: connectingFrom.nodeId,
        toPort: 'input',
        toIndex: connectingFrom.index,
      }
      const newConnections = [...connections, newConnection]
      setConnections(newConnections)
      saveToHistory(nodes, newConnections)
    }
    
    setConnectingFrom(null)
  }

  const deleteConnection = (connId: string) => {
    const newConnections = connections.filter(c => c.id !== connId)
    setConnections(newConnections)
    saveToHistory(nodes, newConnections)
  }

  const getPortPosition = (nodeId: string, port: 'input' | 'output', index: number) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { x: 0, y: 0 }
    
    const tech = techItems.find(t => t.id === node.techId)
    if (!tech) return { x: 0, y: 0 }
    
    // Calculate port positions based on node layout
    const headerHeight = 80
    const inputsStart = headerHeight + 30
    const inputHeight = 36
    const outputsStart = inputsStart + tech.inputs.length * inputHeight + 30
    
    if (port === 'input') {
      return {
        x: node.x + 20,
        y: node.y + inputsStart + index * inputHeight + inputHeight / 2
      }
    } else {
      return {
        x: node.x + node.width - 20,
        y: node.y + outputsStart + index * inputHeight + inputHeight / 2
      }
    }
  }

  const exportMap = () => {
    const data = JSON.stringify({ nodes, connections }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tech-architecture.json'
    a.click()
  }

  const importMap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        setNodes(data.nodes || [])
        setConnections(data.connections || [])
        saveToHistory(data.nodes || [], data.connections || [])
      } catch (err) {
        console.error('Invalid file format')
      }
    }
    reader.readAsText(file)
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
            Tech Architecture Builder
          </h1>
          <p className="text-sm sm:text-base px-2" style={{ color: colors.textMuted }}>
            Design your tech stack visually - drag, connect, and build your perfect solution
          </p>
        </div>

        {/* Tech Palette */}
        <div 
          className="p-3 sm:p-4 rounded-lg sm:rounded-xl mb-3 sm:mb-4 overflow-x-auto scrollbar-hide"
          style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
        >
          <p className="text-xs font-medium mb-2 sm:mb-3 flex items-center gap-2" style={{ color: colors.textMuted }}>
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Click to add tech components:
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {techItems.map((tech) => {
              const Icon = tech.icon
              return (
                <button
                  key={tech.id}
                  onClick={() => addNode(tech.id)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all hover:scale-105"
                  style={{ 
                    background: `${tech.color}15`,
                    color: colors.text,
                    border: `1px solid ${tech.color}40`
                  }}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: tech.color }} />
                  <span className="text-xs sm:text-sm font-medium">{tech.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Toolbar */}
        <div 
          className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg sm:rounded-xl mb-3 sm:mb-4"
          style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={undo}
              className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: historyIndex > 0 ? colors.text : colors.textMuted }}
              disabled={historyIndex <= 0}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: historyIndex < history.length - 1 ? colors.text : colors.textMuted }}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
            <div className="w-px h-5 sm:h-6 mx-1 sm:mx-2 hidden sm:block" style={{ background: colors.border }} />
            <button
              onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
              className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-white/10 hidden sm:block"
              style={{ color: colors.textMuted }}
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs sm:text-sm min-w-[40px] sm:min-w-[50px] text-center hidden sm:block" style={{ color: colors.textMuted }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
              className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-white/10 hidden sm:block"
              style={{ color: colors.textMuted }}
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {connectingFrom && (
              <button
                onClick={() => setConnectingFrom(null)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
                style={{ background: '#ef444420', color: '#ef4444' }}
              >
                <Unlink className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Cancel Connection</span>
                <span className="sm:hidden">Cancel</span>
              </button>
            )}
            <div className="w-px h-5 sm:h-6 mx-1 sm:mx-2" style={{ background: colors.border }} />
            <button
              onClick={exportMap}
              className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: colors.textMuted }}
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: colors.textMuted }}
              title="Import"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={importMap}
            />
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="relative rounded-xl sm:rounded-2xl overflow-hidden touch-pan-x touch-pan-y"
          style={{ 
            background: `radial-gradient(circle at center, ${colors.surface}, ${colors.background})`,
            border: `1px solid ${colors.border}`,
            height: 'calc(100vh - 320px)',
            minHeight: '400px',
            maxHeight: '600px',
            cursor: connectingFrom ? 'crosshair' : 'default'
          }}
          onClick={() => {
            setSelectedNode(null)
            setConnectingFrom(null)
          }}
        >
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(${colors.border} 1px, transparent 1px),
                linear-gradient(90deg, ${colors.border} 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* SVG for connections */}
          <svg 
            ref={svgRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Existing connections */}
            {connections.map(conn => {
              const fromPos = getPortPosition(conn.fromNodeId, conn.fromPort, conn.fromIndex)
              const toPos = getPortPosition(conn.toNodeId, conn.toPort, conn.toIndex)
              const midX = (fromPos.x + toPos.x) / 2
              
              return (
                <g key={conn.id} className="pointer-events-auto cursor-pointer" onClick={() => deleteConnection(conn.id)}>
                  <path
                    d={`M ${fromPos.x} ${fromPos.y} C ${midX} ${fromPos.y}, ${midX} ${toPos.y}, ${toPos.x} ${toPos.y}`}
                    fill="none"
                    stroke={`${colors.primary}60`}
                    strokeWidth="3"
                    className="transition-all hover:stroke-red-500"
                  />
                  {/* Connection dot */}
                  <circle cx={midX} cy={(fromPos.y + toPos.y) / 2} r="4" fill={colors.primary} />
                </g>
              )
            })}
            
            {/* Active connection being drawn */}
            {connectingFrom && (
              <path
                d={`M ${getPortPosition(connectingFrom.nodeId, connectingFrom.port, connectingFrom.index).x} ${getPortPosition(connectingFrom.nodeId, connectingFrom.port, connectingFrom.index).y} L ${mousePos.x - (canvasRef.current?.getBoundingClientRect().left || 0)} ${mousePos.y - (canvasRef.current?.getBoundingClientRect().top || 0)}`}
                fill="none"
                stroke={connectingFrom.port === 'output' ? '#e879a9' : '#7dd3a8'}
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
          </svg>

          {/* Nodes */}
          <div 
            className="absolute inset-0"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          >
            {nodes.map(node => {
              const tech = techItems.find(t => t.id === node.techId)
              if (!tech) return null
              
              return (
                <TechNodeComponent
                  key={node.id}
                  node={node}
                  tech={tech}
                  isSelected={selectedNode === node.id}
                  onSelect={() => setSelectedNode(node.id)}
                  onDelete={() => deleteNode(node.id)}
                  onDragStart={(e) => handleDragStart(node.id, e)}
                  onStartConnection={handleStartConnection}
                  onEndConnection={handleEndConnection}
                  colors={colors}
                  connectingFrom={connectingFrom}
                />
              )
            })}
          </div>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="text-center">
                <Link2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" style={{ color: colors.textMuted, opacity: 0.5 }} />
                <p className="text-base sm:text-lg font-medium mb-2" style={{ color: colors.textMuted }}>
                  Start Building Your Tech Stack
                </p>
                <p className="text-xs sm:text-sm" style={{ color: colors.textMuted, opacity: 0.7 }}>
                  Click on tech components above to add them, then connect inputs and outputs
                </p>
              </div>
            </div>
          )}

          {/* Instructions - hidden on mobile */}
          <div 
            className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 p-2 sm:p-3 rounded-lg sm:rounded-xl text-xs hidden sm:block"
            style={{ 
              background: `${colors.surface}95`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`
            }}
          >
            <p style={{ color: colors.textMuted }}>
              <strong>Tips:</strong> Drag nodes to position. Click ports to connect. Click connections to delete.
            </p>
          </div>
        </div>

        {/* Legend - simplified on mobile */}
        <div 
          className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg sm:rounded-xl"
          style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
        >
          <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3" style={{ color: colors.text }}>Connection Guide:</p>
          <div className="flex flex-wrap gap-3 sm:gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2" style={{ borderColor: '#7dd3a8' }} />
              <span className="text-xs sm:text-sm" style={{ color: colors.textMuted }}>Input</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2" style={{ borderColor: '#e879a9' }} />
              <span className="text-xs sm:text-sm" style={{ color: colors.textMuted }}>Output</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-6 sm:w-8 h-0.5" style={{ background: colors.primary }} />
              <span className="text-xs sm:text-sm" style={{ color: colors.textMuted }}>Connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
