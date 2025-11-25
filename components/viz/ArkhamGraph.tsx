'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

import { GraphData, GraphNode } from '@/lib/mock-data';

// Dynamically import ForceGraph2D with no SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-cyan-500">Initializing Neural Link...</div>
});

interface ArkhamGraphProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
  onReady?: (resetFn: () => void) => void;
}

export default function ArkhamGraph({ data, onNodeClick, onReady }: ArkhamGraphProps) {
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});

  // Resize handler
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: Record<string, HTMLImageElement> = {};
      const promises = data.nodes.map((node) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = node.imgUrl;
          img.onload = () => {
            loadedImages[node.id] = img;
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load image for node ${node.id}`);
            resolve(); // Resolve anyway to avoid blocking
          };
        });
      });

      await Promise.all(promises);
      setImages(loadedImages);
    };

    loadImages();
  }, [data]);



  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const size = 12; // Base node size
    const img = images[node.id];
    
    // Draw Label
    const label = node.label;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

    // Draw Image Circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.clip();

    if (img) {
      try {
        ctx.drawImage(img, node.x - size, node.y - size, size * 2, size * 2);
      } catch (e) {
        // Fallback color if image fails or not ready
        ctx.fillStyle = '#333';
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#1a1a2e';
      ctx.fill();
    }
    ctx.restore();

    // Draw Neon Border
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2 / globalScale;
    
    // Gold for ROOT, Blue/Cyan for DERIVATIVE
    if (node.type === 'ROOT') {
      ctx.strokeStyle = '#FFD700'; // Gold
      ctx.shadowColor = '#FFD700';
    } else {
      ctx.strokeStyle = '#00FFFF'; // Cyan
      ctx.shadowColor = '#00FFFF';
    }
    
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // Draw Text Background
    ctx.fillStyle = 'rgba(5, 5, 16, 0.8)';
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + size + 2, bckgDimensions[0], bckgDimensions[1]);

    // Draw Text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ededed';
    ctx.fillText(label, node.x, node.y + size + 2 + bckgDimensions[1] / 2);

    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
  }, [images]);

  const nodePointerAreaPaint = useCallback((node: any, color: string, ctx: CanvasRenderingContext2D) => {
    const size = 12;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.fill();
  }, []);

  return (
    <div className="w-full h-full bg-transparent">
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        backgroundColor="rgba(0,0,0,0)" // Transparent
        nodeLabel="label"
        nodeCanvasObject={nodeCanvasObject}
        nodePointerAreaPaint={nodePointerAreaPaint}
        linkColor={() => 'rgba(0, 255, 255, 0.4)'} // Neon Cyan
        linkWidth={1}
        linkCurvature={0.2} // Add curvature for smoother, more organic look
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={() => '#00FFFF'}
        onNodeClick={(node) => onNodeClick && onNodeClick(node as GraphNode)}
        d3VelocityDecay={0.1} // Physics damping
        cooldownTicks={100}
        onEngineStop={() => {
          graphRef.current?.zoomToFit(400);
          // Expose reset function after graph initialization
          if (onReady) {
            onReady(() => graphRef.current?.zoomToFit(400));
          }
        }}
      />
    </div>
  );
}
