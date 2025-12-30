import React, { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';

const MIN_SIZE = 24;

const disableStrokeScaling = (node) => {
  if (!node) return;
  if (typeof node.strokeScaleEnabled === 'function') {
    node.strokeScaleEnabled(false);
  }
  const children = node.getChildren?.();
  if (children && children.length) {
    children.forEach(disableStrokeScaling);
  }
};

const ResizeHandles = ({ targetRef, isVisible, scale = 1, onResize, selectionKey, expectedWidth, expectedHeight }) => {
  const transformerRef = useRef(null);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    if (isVisible && targetRef?.current) {
      const node = targetRef.current;
      
      // CRITICAL: Reset scale to 1 before attaching Transformer
      // This prevents scale accumulation from previous rotations/transforms
      node.scaleX(1);
      node.scaleY(1);
      
      // CRITICAL: Prevent Transformer from using rotated bounding box
      // Explicitly set width/height to actual dimensions from layer state
      // This ensures Transformer uses actual size, not the larger bounding box of rotated elements
      if (expectedWidth && expectedHeight) {
        const scaledWidth = expectedWidth * scale;
        const scaledHeight = expectedHeight * scale;
        node.width(scaledWidth);
        node.height(scaledHeight);
      } else {
        // Fallback: use current node dimensions if expected dimensions not provided
        const currentWidth = node.width();
        const currentHeight = node.height();
        if (currentWidth && currentHeight) {
          node.width(currentWidth);
          node.height(currentHeight);
        }
      }
      
      // Prevent stroke from scaling which can inflate size on re-select
      disableStrokeScaling(node);
      
      transformer.nodes([node]);
      transformer.forceUpdate();
    } else {
      transformer.nodes([]);
    }
    transformer.getLayer()?.batchDraw();
  }, [isVisible, targetRef, selectionKey, expectedWidth, expectedHeight, scale]);

  if (!isVisible) {
    return null;
  }

  const completeResize = () => {
    if (targetRef?.current) {
      onResize?.(targetRef.current);
    }
  };

  const normalizedScale = Math.max(scale, 0.001);
  const scaledMin = MIN_SIZE * normalizedScale;
  const anchorSize = Math.max(5, 7 / normalizedScale);
  const padding = Math.max(3, 5 / normalizedScale);
  const borderDash = [8 / normalizedScale, 6 / normalizedScale];

  return (
    <Transformer
      ref={transformerRef}
      rotateEnabled={false}
      anchorSize={anchorSize}
      padding={padding}
      borderStroke="rgba(126, 87, 194, 0.9)"
      borderStrokeWidth={1.2}
      borderDash={borderDash}
      anchorFill="#ffffff"
      anchorStroke="rgba(126, 87, 194, 0.95)"
      anchorStrokeWidth={1.2}
      anchorCornerRadius={999}
      keepRatio={false}
      boundBoxFunc={(oldBox, newBox) => {
        // Prevent minimum size violations
        if (Math.abs(newBox.width) < scaledMin || Math.abs(newBox.height) < scaledMin) {
          return oldBox;
        }
        // Return newBox - explicit width/height set on node prevents bounding box issues
        return newBox;
      }}
      onTransformEnd={completeResize}
      onDragEnd={completeResize}
    />
  );
};

export default ResizeHandles;

