/**
 * Career Path Visualization - Map View Component
 * 
 * This component displays career milestones as an interactive node-based map
 * with connections showing career progression.
 * 
 * @fileoverview Interactive career map visualization
 * @author Career Path Visualization Team
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, GraduationCap, Briefcase, Award, Code } from 'lucide-react';
import type { CareerData, Milestone } from '../../types';
import { useAppContext } from '../Layout/AppLayout';

// ============================================================================
// INTERFACES
// ============================================================================

interface MapViewProps {
  className?: string;
}

interface NodePosition {
  x: number;
  y: number;
}

interface MilestoneNode extends Milestone {
  position: NodePosition;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get icon for milestone type
 */
function getMilestoneIcon(type: string) {
  const icons = {
    job: Briefcase,
    promotion: Zap,
    education: GraduationCap,
    side_project: Code,
    certification: Award,
    achievement: Award
  };
  return icons[type as keyof typeof icons] || Briefcase;
}

/**
 * Get color for milestone type
 */
function getMilestoneColor(type: string): string {
  const colors = {
    job: 'from-blue-500 to-blue-600',
    promotion: 'from-green-500 to-green-600',
    education: 'from-purple-500 to-purple-600',
    side_project: 'from-orange-500 to-orange-600',
    certification: 'from-yellow-500 to-yellow-600',
    achievement: 'from-red-500 to-red-600'
  };
  return colors[type as keyof typeof colors] || 'from-gray-500 to-gray-600';
}

/**
 * Generate positions for milestones in a flowing path
 */
function generateNodePositions(milestones: Milestone[]): MilestoneNode[] {
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.dateRange.start).getTime() - new Date(b.dateRange.start).getTime()
  );

  return sortedMilestones.map((milestone, index) => {
    // Create a flowing S-curve path
    const progress = index / (sortedMilestones.length - 1 || 1);
    const angle = progress * Math.PI * 2; // Two full curves
    
    const baseX = progress * 800; // Horizontal progression
    const offsetY = Math.sin(angle) * 150; // Vertical wave
    
    return {
      ...milestone,
      position: {
        x: baseX + 100,
        y: 300 + offsetY
      }
    };
  });
}

// ============================================================================
// NODE COMPONENT
// ============================================================================

interface NodeComponentProps {
  node: MilestoneNode;
  isSelected: boolean;
  onSelect: (node: MilestoneNode) => void;
  onHoverChange: (isHovering: boolean) => void;
}

function NodeComponent({ node, isSelected, onSelect, onHoverChange }: NodeComponentProps): JSX.Element {
  const Icon = getMilestoneIcon(node.type);

  return (
    <motion.div
      className="absolute cursor-pointer z-20 milestone-node"
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: 'translate(-50%, -50%)'
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling to drag container
        onSelect(node);
      }}
      onMouseDown={(e) => {
        e.stopPropagation(); // Prevent drag from starting on node
      }}
      onPointerDown={(e) => {
        e.stopPropagation(); // Prevent drag from starting on node
      }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* Node Circle */}
      <motion.div
        className={`
          w-16 h-16 rounded-full bg-gradient-to-br ${getMilestoneColor(node.type)}
          shadow-lg flex items-center justify-center text-white
          ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}
        `}
        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
      >
        <Icon size={24} />
      </motion.div>

      {/* Label */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
            {node.title}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {new Date(node.dateRange.start).getFullYear()}
          </p>
        </div>
      </div>

      {/* Pulse animation for current position */}
      {!node.dateRange.end && (
        <motion.div
          className={`absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br ${getMilestoneColor(node.type)} opacity-30`}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
}

// ============================================================================
// CONNECTION LINES COMPONENT
// ============================================================================

interface ConnectionLinesProps {
  nodes: MilestoneNode[];
}

function ConnectionLines({ nodes }: ConnectionLinesProps): JSX.Element {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {nodes.map((node, index) => {
        if (index === nodes.length - 1) return null;
        
        const nextNode = nodes[index + 1];
        const startX = node.position.x;
        const startY = node.position.y;
        const endX = nextNode.position.x;
        const endY = nextNode.position.y;
        
        // Create a curved path
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const controlX = midX;
        const controlY = midY - 50;
        
        return (
          <motion.path
            key={`${node.id}-${nextNode.id}`}
            d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
            stroke="url(#gradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: index * 0.2 }}
          />
        );
      })}
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ============================================================================
// DETAIL PANEL COMPONENT
// ============================================================================

interface DetailPanelProps {
  node: MilestoneNode | null;
  onClose: () => void;
}

function DetailPanel({ node, onClose }: DetailPanelProps): JSX.Element | null {
  if (!node) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="absolute top-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 z-30 detail-panel"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        ×
      </button>

      {/* Content */}
      <div className="pr-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {node.title}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">
          {node.organization}
        </p>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {new Date(node.dateRange.start).toLocaleDateString()} - {' '}
            {node.dateRange.end 
              ? new Date(node.dateRange.end).toLocaleDateString()
              : 'Present'
            }
          </p>
          {node.location && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              📍 {node.location}
            </p>
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
          {node.description}
        </p>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
            Key Achievements:
          </h4>
          <ul className="space-y-1">
            {node.highlights.map((highlight, idx) => (
              <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
            Skills:
          </h4>
          <div className="flex flex-wrap gap-2">
            {node.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Map view component
 */
export function MapView({ className = '' }: MapViewProps): JSX.Element {
  const { careerData } = useAppContext();
  const [selectedNode, setSelectedNode] = useState<MilestoneNode | null>(null);
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [isHoveringNode, setIsHoveringNode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!careerData) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No career data available</p>
        </div>
      </div>
    );
  }

  const nodes = generateNodePositions(careerData.milestones);

  const handlePan = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    setViewportOffset(prev => ({
      x: prev.x + info.delta.x,
      y: prev.y + info.delta.y
    }));
  };

  return (
    <div className={`relative h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 ${className}`}>
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Career Map
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Drag to explore • Click nodes for details
        </p>
      </div>

      {/* Map Container */}
      <motion.div
        ref={containerRef}
        className={`relative w-full h-full transition-all ${
          isHoveringNode ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        }`}
        drag={!isHoveringNode && !selectedNode}
        onPan={handlePan}
        dragConstraints={{
          left: -500,
          right: 500,
          top: -300,
          bottom: 300
        }}
        dragElastic={0.1}
        dragMomentum={false}
        style={{
          x: viewportOffset.x,
          y: viewportOffset.y
        }}
      >
        {/* Connection Lines */}
        <ConnectionLines nodes={nodes} />

        {/* Milestone Nodes */}
        {nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            onSelect={setSelectedNode}
            onHoverChange={setIsHoveringNode}
          />
        ))}
      </motion.div>

      {/* Detail Panel */}
      <DetailPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">
          Milestone Types
        </h3>
        <div className="space-y-2">
          {[
            { type: 'job', label: 'Job Position', icon: Briefcase },
            { type: 'promotion', label: 'Promotion', icon: Zap },
            { type: 'education', label: 'Education', icon: GraduationCap },
            { type: 'side_project', label: 'Side Project', icon: Code }
          ].map(({ type, label, icon: Icon }) => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getMilestoneColor(type)} flex items-center justify-center`}>
                <Icon size={8} className="text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
