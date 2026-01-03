import { MapNode, NodeType } from '../types';

export function generateWorldNodes(worldId: number): MapNode[] {
  const nodes: MapNode[] = [];
  const nodeCount = 12;

  for (let i = 0; i < nodeCount; i++) {
    const progress = i / (nodeCount - 1);
    const xBase = 15 + progress * 70;
    const xOffset = Math.sin(progress * Math.PI * 2 + worldId) * 15;
    const x = Math.max(10, Math.min(90, xBase + xOffset));
    const y = 85 - progress * 75;

    let type: NodeType;
    if (i === nodeCount - 1) {
      type = 'boss';
    } else if (i === 3 || i === 7) {
      type = 'treasure';
    } else if (i === 2 || i === 5 || i === 9) {
      type = 'blind';
    } else {
      type = 'battle';
    }

    nodes.push({
      id: `world-${worldId}-node-${i}`,
      type,
      status: i === 0 ? 'unlocked' : 'locked',
      position: { x, y },
      reward: type === 'treasure' ? 200 + Math.floor(Math.random() * 300) : undefined,
    });
  }

  return nodes;
}

export function getNodeIcon(type: NodeType): string {
  switch (type) {
    case 'battle': return '?';
    case 'blind': return '?';
    case 'treasure': return '?';
    case 'boss': return '?';
    default: return '?';
  }
}

export function getNodeColor(type: NodeType, status: string): string {
  if (status === 'locked') return 'bg-gray-700 border-gray-600';
  if (status === 'completed') return 'bg-green-700 border-green-500';

  switch (type) {
    case 'battle': return 'bg-blue-600 border-blue-400';
    case 'blind': return 'bg-purple-600 border-purple-400';
    case 'treasure': return 'bg-yellow-600 border-yellow-400';
    case 'boss': return 'bg-red-600 border-red-400';
    default: return 'bg-gray-600 border-gray-400';
  }
}

export function generatePathPoints(nodes: MapNode[]): string {
  if (nodes.length < 2) return '';

  let path = `M ${nodes[0].position.x} ${nodes[0].position.y}`;

  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const midY = (prev.position.y + curr.position.y) / 2;

    path += ` Q ${prev.position.x} ${midY}, ${curr.position.x} ${curr.position.y}`;
  }

  return path;
}
