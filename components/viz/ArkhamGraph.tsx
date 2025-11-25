'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { forceCollide } from 'd3-force';

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

  const [isGraphReady, setIsGraphReady] = useState(false);

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

  // Reset ready state when data changes
  useEffect(() => {
    setIsGraphReady(false);
  }, [data]);

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
    const size = 8; // Base node size (reduced for better spacing)
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
        // Fallback color if image fails to draw
        ctx.fillStyle = '#333';
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#1a1b26';
      ctx.fill();
    }
    
    ctx.restore();

    // Draw Neon Border
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2 / globalScale;
    ctx.strokeStyle = node.type === 'ROOT' ? '#FFD700' : '#00FFFF'; // Gold for root, Cyan for others
    ctx.stroke();
    
    // Draw Glow
    ctx.shadowColor = node.type === 'ROOT' ? '#FFD700' : '#00FFFF';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Label Background
    if (node.id === (data.nodes[0] as any).id || globalScale > 1.5) { // Show label for root or when zoomed in
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + size + 2, bckgDimensions[0], bckgDimensions[1]);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(label, node.x, node.y + size + 2 + fontSize / 2);
    }
  }, [images, data]);

  const nodePointerAreaPaint = useCallback((node: any, color: string, ctx: CanvasRenderingContext2D) => {
    const size = 8;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.fill();
  }, []);

  return (
    <div className="w-full h-full relative">
      {/* Loading Overlay */}
      {!isGraphReady && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050510]/80 backdrop-blur-sm transition-opacity duration-500">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
          <p className="text-cyan-400 font-mono text-sm animate-pulse">Stabilizing Neural Link...</p>
        </div>
      )}
      
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
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
        // Balanced force parameters for spacing + stability
        d3AlphaDecay={0.015} // Faster cooling to settle quickly
        d3VelocityDecay={0.6} // Strong damping to prevent oscillation
        warmupTicks={100} // Pre-calculate for initial spread
        cooldownTicks={200} // Enough time to settle
        onEngineStop={() => {
          // Configure D3 forces for good spacing without instability
          const fg = graphRef.current;
          if (fg) {
            // Moderate repulsion - strong enough for spacing, not too strong for stability
            const chargeForce = fg.d3Force('charge');
            if (chargeForce) {
              chargeForce.strength(-400); // Balanced repulsion
              chargeForce.distanceMax(300); // Reasonable distance
            }
            
            // Moderate link distance
            const linkForce = fg.d3Force('link');
            if (linkForce) {
              linkForce.distance(120); // Good spacing
              linkForce.strength(0.5); // Reduce link strength for flexibility
            }
            
            // Collision force for overlap prevention
            fg.d3Force('collide', forceCollide(45).strength(0.7).iterations(2));
            
            // Restart simulation briefly
            fg.d3ReheatSimulation();
          }
          
          // Zoom to fit after forces are configured
          setTimeout(() => {
            graphRef.current?.zoomToFit(400, 100);
            setIsGraphReady(true); // Reveal graph when ready
            if (onReady) {
              onReady(() => graphRef.current?.zoomToFit(400, 100));
            }
          }, 300); // Wait a bit for reheat to settle
        }}
      />
    </div>
  );
}
