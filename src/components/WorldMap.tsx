import { motion } from 'framer-motion';
import { MapNode, NodeType } from '../types';
import { getNodeIcon, getNodeColor, generatePathPoints } from '../utils/mapGenerator';

interface WorldMapProps {
  nodes: MapNode[];
  worldNumber: number;
  onNodeSelect: (node: MapNode) => void;
  jade: number;
}

export default function WorldMap({ nodes, worldNumber, onNodeSelect, jade }: WorldMapProps) {
  const pathD = generatePathPoints(nodes);

  const getNodeLabel = (type: NodeType): string => {
    switch (type) {
      case 'battle': return 'Battle';
      case 'blind': return 'Listening';
      case 'treasure': return 'Treasure';
      case 'boss': return 'BOSS';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <div className="p-4 sm:p-6 flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">
              The Jade Road
            </h1>
            <p className="text-white/80 text-sm sm:text-base">World {worldNumber}</p>
          </div>
          <div className="voxel-card glass-yellow px-4 py-2 sm:px-6 sm:py-3 w-fit">
            <p className="text-white text-lg font-black drop-shadow">
              {jade} Jade
            </p>
          </div>
        </div>
        <div className="w-32 sm:w-40" />
      </div>

      <div className="flex-1 relative overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00b06f" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffd700" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="0.8"
            strokeDasharray="2,1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          <motion.path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.2"
            strokeDasharray="0.5,2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
          />
        </svg>

        <div className="absolute inset-0">
          {nodes.map((node, index) => (
            <motion.button
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
              onClick={() => node.status === 'unlocked' && onNodeSelect(node)}
              disabled={node.status === 'locked'}
              className={`
                absolute transform -translate-x-1/2 -translate-y-1/2
                ${node.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
              }}
              whileHover={node.status === 'unlocked' ? { scale: 1.2 } : {}}
              whileTap={node.status === 'unlocked' ? { scale: 0.9 } : {}}
            >
              <div
                className={`
                  relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-4
                  flex items-center justify-center text-2xl sm:text-3xl
                  transition-all duration-300 shadow-lg
                  ${getNodeColor(node.type, node.status)}
                  ${node.status === 'unlocked' ? 'animate-pulse ring-2 ring-white ring-opacity-50' : ''}
                  ${node.status === 'locked' ? 'opacity-50 grayscale' : ''}
                `}
              >
                {node.status === 'locked' ? (
                  <span className="text-gray-400">?</span>
                ) : (
                  <span>{getNodeIcon(node.type)}</span>
                )}

                {node.status === 'completed' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">OK</span>
                  </div>
                )}

                {node.type === 'boss' && node.status !== 'locked' && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-red-400"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>

              {node.status === 'unlocked' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                >
                  <span className="text-white text-xs sm:text-sm font-bold bg-black/50 px-2 py-1 rounded">
                    {getNodeLabel(node.type)}
                    {node.type === 'treasure' && node.reward && ` +${node.reward}`}
                  </span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg">
            <div className="w-4 h-4 rounded bg-blue-600 border border-blue-400" />
            <span className="text-white text-xs">Battle</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg">
            <div className="w-4 h-4 rounded bg-purple-600 border border-purple-400" />
            <span className="text-white text-xs">Listening</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg">
            <div className="w-4 h-4 rounded bg-yellow-600 border border-yellow-400" />
            <span className="text-white text-xs">Treasure</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg">
            <div className="w-4 h-4 rounded bg-red-600 border border-red-400" />
            <span className="text-white text-xs">Boss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
