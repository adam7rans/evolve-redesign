'use client';

import { useEffect, useRef, useState } from 'react';

interface NeuronPosition {
  x: number;
  y: number;
}

interface Connection {
  path: string;
  length: number;
}

export default function NeuralNetworkDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const layers = [3, 15, 20, 8, 12, 25, 18, 10, 5, 2];
  const verticalSpacing = 20;
  const maxNodes = Math.max(...layers);
  const verticalPadding = 40;

  useEffect(() => {
    const updateDimensions = () => {
      const contentHeight = (maxNodes - 1) * verticalSpacing + verticalPadding * 2;
      setDimensions({
        width: window.innerWidth,
        height: contentHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [maxNodes, verticalSpacing, verticalPadding]);

  const drawNetwork = () => {
    const width = dimensions.width;
    const height = dimensions.height;
    const rightPadding = 40;
    const layerSpacing = (width - rightPadding) / (layers.length - 1);
    
    const neuronPositions: NeuronPosition[][] = layers.map((neuronsCount, layerIndex) => {
      const layerHeight = (neuronsCount - 1) * verticalSpacing;
      const layerX = layerIndex * layerSpacing + rightPadding / 2;
      const startY = (height - layerHeight) / 2;
      
      return Array.from({ length: neuronsCount }, (_, i) => ({
        x: layerX,
        y: startY + i * verticalSpacing
      }));
    });

    const connections: Connection[] = [];

    const svg = svgRef.current;
    if (!svg) return;

    svg.innerHTML = '';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    feGaussianBlur.setAttribute('result', 'coloredBlur');
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);

    const connectionsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(connectionsGroup);

    const flowingLinesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(flowingLinesGroup);

    const neuronsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(neuronsGroup);

    const createPath = (start: NeuronPosition, end: NeuronPosition): string => {
      const controlPointX = start.x + (end.x - start.x) * 0.5;
      return `M ${start.x},${start.y} C ${controlPointX},${start.y} ${controlPointX},${end.y} ${end.x},${end.y}`;
    };

    for (let i = 0; i < layers.length - 1; i++) {
      const currentLayer = neuronPositions[i];
      const nextLayer = neuronPositions[i + 1];

      currentLayer.forEach(currentNeuron => {
        nextLayer.forEach(nextNeuron => {
          const pathString = createPath(currentNeuron, nextNeuron);
          
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', pathString);
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', 'white');
          path.setAttribute('stroke-width', '1');
          path.setAttribute('stroke-opacity', '0.3');
          connectionsGroup.appendChild(path);

          connections.push({
            path: pathString,
            length: path.getTotalLength()
          });
        });
      });
    }

    const neuronElements: SVGCircleElement[][] = [];

    neuronPositions.forEach((layer, layerIndex) => {
      neuronElements[layerIndex] = [];
      layer.forEach((pos, neuronIndex) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pos.x.toString());
        circle.setAttribute('cy', pos.y.toString());
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', 'black');
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '1');
        neuronsGroup.appendChild(circle);
        neuronElements[layerIndex][neuronIndex] = circle;
      });
    });

    const activateNeuron = (layerIndex: number, neuronIndex: number) => {
      const neuron = neuronElements[layerIndex][neuronIndex];
      neuron.setAttribute('fill', 'white');
      neuron.setAttribute('filter', 'url(#glow)');
      
      const startTime = performance.now();
      const duration = 1000; 

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const color = Math.floor(255 * (1 - progress));
        neuron.setAttribute('fill', `rgb(${color},${color},${color})`);

        if (progress === 1) {
          neuron.removeAttribute('filter');
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          neuron.setAttribute('fill', 'black');
        }
      };

      requestAnimationFrame(animate);
    };

    const createFlowingLine = () => {
      const startNeuronIndex = Math.floor(Math.random() * neuronPositions[0].length);
      const startNeuron = neuronPositions[0][startNeuronIndex];
      let currentLayerIndex = 0;
      let currentNeuronIndex = startNeuronIndex;

      const gradientId = `flowGradient${Math.random().toString(36).substr(2, 9)}`;
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', gradientId);
      gradient.setAttribute('gradientUnits', 'objectBoundingBox');
      gradient.innerHTML = `
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="1"/>
      `;
      defs.appendChild(gradient);

      const flowLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      flowLine.setAttribute('fill', 'none');
      flowLine.setAttribute('stroke', `url(#${gradientId})`);
      flowLine.setAttribute('stroke-width', '1');
      flowingLinesGroup.appendChild(flowLine);

      const animateThroughPath = (pathString: string, pathLength: number, nextNeuronIndex: number) => {
        return new Promise<void>((resolve) => {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', pathString);
          
          let start = 0;
          const duration = pathLength * 4;
          const flowLength = 40;

          const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;

            if (progress >= 1) {
              activateNeuron(currentLayerIndex + 1, nextNeuronIndex);
              resolve();
              return;
            }

            const startDist = progress * pathLength;
            const endDist = Math.min(startDist + flowLength, pathLength);
            
            const subPath = [];
            const numPoints = 20;
            
            for (let i = 0; i <= numPoints; i++) {
              const dist = startDist + (endDist - startDist) * (i / numPoints);
              const point = path.getPointAtLength(dist);
              if (i === 0) {
                subPath.push(`M ${point.x},${point.y}`);
              } else {
                subPath.push(`L ${point.x},${point.y}`);
              }
            }
            
            flowLine.setAttribute('d', subPath.join(' '));
            
            requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        });
      };

      const animate = async () => {
        while (currentLayerIndex < layers.length - 1) {
          const nextLayerIndex = currentLayerIndex + 1;
          const nextNeuronIndex = Math.floor(Math.random() * neuronPositions[nextLayerIndex].length);
          const currentNeuron = neuronPositions[currentLayerIndex][currentNeuronIndex];
          const nextNeuron = neuronPositions[nextLayerIndex][nextNeuronIndex];
          
          const pathString = createPath(currentNeuron, nextNeuron);
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', pathString);
          
          await animateThroughPath(pathString, path.getTotalLength(), nextNeuronIndex);
          currentLayerIndex = nextLayerIndex;
          currentNeuronIndex = nextNeuronIndex;
        }

        gradient.remove();
        flowLine.remove();
        setTimeout(() => createFlowingLine(), Math.random() * 200);
      };

      activateNeuron(0, startNeuronIndex);
      animate();
    };

    for (let i = 0; i < 15; i++) {
      setTimeout(() => createFlowingLine(), i * 100);
    }
  };

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      drawNetwork();
    }
  }, [dimensions]);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        svgRef.current.innerHTML = '';
        drawNetwork();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-[600px] flex items-center justify-center bg-black">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="max-w-full"
        style={{ background: 'transparent' }}
      />
    </div>
  );
}
