import { MapNode, NodeType } from '../types';
import { getWorldTheme, PathShape } from '../data/bosses';

function seededRandom(seed: number): () => number {
  let s = Math.abs(seed) || 1;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function computeNodeX(
  pathShape: PathShape,
  progress: number,
  index: number,
  nodeCount: number,
  worldId: number,
  rand: () => number
): number {
  switch (pathShape) {
    case 'zigzag': {
      const amplitude = 28 + (worldId % 3) * 4;
      const base = index % 2 === 0 ? 50 - amplitude : 50 + amplitude;
      return base + (rand() - 0.5) * 8;
    }

    case 'spiral': {
      const angle = progress * Math.PI * 2.5;
      const radius = 12 + progress * 22;
      return 50 + Math.cos(angle + worldId * 0.7) * radius;
    }

    case 'cascade': {
      const tier = Math.floor(index / 3);
      const posInTier = index % 3;
      const tierOffset = tier % 2 === 0 ? -1 : 1;
      const spread = 22;
      if (posInTier === 0) return 50 + tierOffset * spread;
      if (posInTier === 1) return 50;
      return 50 - tierOffset * spread;
    }

    case 'diamond': {
      const mid = (nodeCount - 1) / 2;
      const distFromMid = mid > 0 ? Math.abs(index - mid) / mid : 0;
      const width = (1 - distFromMid) * 32;
      const side = index % 2 === 0 ? -1 : 1;
      return 50 + side * width + (rand() - 0.5) * 6;
    }

    case 'serpentine': {
      const freq = 1.5;
      const amplitude = 25 + (worldId % 4) * 3;
      return 50 + Math.sin(progress * Math.PI * freq * 2 + worldId * 1.2) * amplitude;
    }

    case 'staircase': {
      const step = Math.floor(index / 2);
      const isLeft = step % 2 === 0;
      const xBase = isLeft ? 30 : 70;
      const nudge = index % 2 === 0 ? -8 : 8;
      return xBase + nudge + (rand() - 0.5) * 6;
    }

    case 'vortex': {
      const angle = progress * Math.PI * 3;
      const radius = 30 - progress * 18;
      return 50 + Math.cos(angle + worldId) * radius;
    }

    case 'sine':
    default: {
      const amplitude = 20 + (worldId % 5) * 3;
      const freq = 1 + (worldId % 3) * 0.5;
      return 50 + Math.sin(progress * Math.PI * freq * 2 + worldId * 0.8) * amplitude;
    }
  }
}

export function generateWorldNodes(worldId: number): MapNode[] {
  const theme = getWorldTheme(worldId);
  const nodeCount = theme.nodeCount;
  const nodes: MapNode[] = [];
  const rand = seededRandom(worldId * 7919 + 1013);

  for (let i = 0; i < nodeCount; i++) {
    const progress = nodeCount > 1 ? i / (nodeCount - 1) : 0;

    let x = computeNodeX(theme.pathShape, progress, i, nodeCount, worldId, rand);
    x = Math.max(14, Math.min(86, x));

    const yStart = 82;
    const yEnd = 12;
    const y = yStart - progress * (yStart - yEnd);

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
      reward: type === 'treasure' ? baseReward + Math.floor(rand() * rewardRange) : undefined,
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
    const dx = curr.position.x - prev.position.x;
    const dy = curr.position.y - prev.position.y;

    const cx1 = prev.position.x + dx * 0.15;
    const cy1 = prev.position.y + dy * 0.5;
    const cx2 = curr.position.x - dx * 0.15;
    const cy2 = prev.position.y + dy * 0.5;

    path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.position.x} ${curr.position.y}`;
  }

  return path;
}

export function generateSegmentPaths(nodes: MapNode[]): { d: string; completed: boolean }[] {
  if (nodes.length < 2) return [];

  const segments: { d: string; completed: boolean }[] = [];

  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const dx = curr.position.x - prev.position.x;
    const dy = curr.position.y - prev.position.y;

    const cx1 = prev.position.x + dx * 0.15;
    const cy1 = prev.position.y + dy * 0.5;
    const cx2 = curr.position.x - dx * 0.15;
    const cy2 = prev.position.y + dy * 0.5;

    const d = `M ${prev.position.x} ${prev.position.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.position.x} ${curr.position.y}`;
    const completed = prev.status === 'completed';

    segments.push({ d, completed });
  }

  return segments;
}
