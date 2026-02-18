import { MapNode, NodeType } from '../types';
import { getWorldTheme } from '../data/bosses';

export function generateWorldNodes(worldId: number): MapNode[] {
  const theme = getWorldTheme(worldId);
  const nodeCount = theme.nodeCount;
  const nodes: MapNode[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const progress = i / (nodeCount - 1);
    let x: number;

    switch (theme.pathShape) {
      case 'zigzag':
        x = i % 2 === 0 ? 25 + (worldId % 3) * 5 : 75 - (worldId % 3) * 5;
        x += (Math.random() - 0.5) * 10;
        break;
      case 'spiral': {
        const angle = progress * Math.PI * 3;
        const radius = 20 + progress * 15;
        x = 50 + Math.cos(angle + worldId) * radius;
        break;
      }
      default: {
        const xBase = 15 + progress * 70;
        const xOffset = Math.sin(progress * Math.PI * 2 + worldId) * 18;
        x = xBase + xOffset;
        break;
      }
    }

    x = Math.max(12, Math.min(88, x));
    const y = 85 - progress * 75;

    let type: NodeType;
    if (i === nodeCount - 1) {
      type = 'boss';
    } else if (i === Math.floor(nodeCount * 0.3) || i === Math.floor(nodeCount * 0.7)) {
      type = 'treasure';
    } else if (i % 3 === 2) {
      type = 'blind';
    } else {
      type = 'battle';
    }

    const baseReward = 200 + (worldId - 1) * 50;
    const rewardRange = 100 + (worldId - 1) * 50;

    nodes.push({
      id: `world-${worldId}-node-${i}`,
      type,
      status: i === 0 ? 'unlocked' : 'locked',
      position: { x, y },
      reward: type === 'treasure' ? baseReward + Math.floor(Math.random() * rewardRange) : undefined,
    });
  }

  return nodes;
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
