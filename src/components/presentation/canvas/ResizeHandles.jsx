import React, { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';

const MIN_SIZE = 24;

const ResizeHandles = ({ targetRef, isVisible, scale = 1, onResize, selectionKey }) => {
  const transformerRef = useRef(null);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    if (isVisible && targetRef?.current) {
      transformer.nodes([targetRef.current]);
    } else {
      transformer.nodes([]);
    }
    transformer.getLayer()?.batchDraw();
  }, [isVisible, targetRef, selectionKey]);

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
        if (Math.abs(newBox.width) < scaledMin || Math.abs(newBox.height) < scaledMin) {
          return oldBox;
        }
        return newBox;
      }}
      onTransformEnd={completeResize}
      onDragEnd={completeResize}
    />
  );
};

export default ResizeHandles;

