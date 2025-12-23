import React, { useState, useRef, useEffect } from 'react';
import { Circle, Group, Text as KonvaText } from 'react-konva';

const ROTATE_SNAP_ANGLE = 15; // Degrees to snap to when Shift is held

// Custom rotate (↻) cursor rendered as an inline SVG data URL
const ROTATE_CURSOR =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='%237E57C2' d='M12 5V2L8 6l4 4V7c2.76 0 5 2.24 5 5a5 5 0 0 1-9.9 1h-2.02A7 7 0 0 0 19 12c0-3.87-3.13-7-7-7z'/></svg>\") 12 12, auto";

const RotateHandle = ({ targetRef, isVisible, scale = 1, onRotate, layer }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const groupRef = useRef(null);
  const isDraggingRef = useRef(false);
  const initialAngleRef = useRef(0);
  const initialRotationRef = useRef(0);

  useEffect(() => {
    if (!isVisible || !targetRef?.current || !groupRef.current) return;

    const targetNode = targetRef.current;
    const handleGroup = groupRef.current;

    // Get the bounding box of the target element
    const box = targetNode.getClientRect();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // Position handle below the element, centered
    const handleY = box.y + box.height + 20 / scale; // 20px below, adjusted for scale
    const handleX = centerX;

    handleGroup.position({ x: handleX, y: handleY });
    handleGroup.getLayer()?.batchDraw();
  }, [isVisible, targetRef, scale, layer?.x, layer?.y, layer?.width, layer?.height, layer?.rotation]);

  if (!isVisible || !targetRef?.current) {
    return null;
  }

  const handleSize = Math.max(8, 10 / scale);
  const handleRadius = handleSize / 2;

  const handleMouseEnter = () => {
    setIsHovered(true);
    const stage = groupRef.current?.getStage();
    if (stage) {
      stage.container().style.cursor = ROTATE_CURSOR;
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsHovered(false);
      const stage = groupRef.current?.getStage();
      if (stage) {
        stage.container().style.cursor = 'default';
      }
    }
  };

  const getAngleFromPoint = (pointX, pointY, centerX, centerY) => {
    const dx = pointX - centerX;
    const dy = pointY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // Normalize to 0-360
    if (angle < 0) angle += 360;
    return angle;
  };

  const snapAngle = (angle) => {
    return Math.round(angle / ROTATE_SNAP_ANGLE) * ROTATE_SNAP_ANGLE;
  };

  const handleMouseDown = (e) => {
    e.cancelBubble = true;
    setIsDragging(true);
    isDraggingRef.current = true;
    
    const targetNode = targetRef.current;
    if (!targetNode) return;

    const box = targetNode.getClientRect();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    
    const startAngle = getAngleFromPoint(pointerPos.x, pointerPos.y, centerX, centerY);
    initialAngleRef.current = startAngle;
    initialRotationRef.current = layer?.rotation || 0;

    const stageContainer = stage.container();
    stageContainer.style.cursor = ROTATE_CURSOR;
    stageContainer.style.userSelect = 'none';

    const handleMouseMove = (evt) => {
      if (!isDraggingRef.current) return;

      const currentStage = groupRef.current?.getStage();
      if (!currentStage) return;
      
      const pointerPos = currentStage.getPointerPosition();
      if (!pointerPos) return;

      // Recalculate center in case element moved
      const currentBox = targetNode.getClientRect();
      const currentCenterX = currentBox.x + currentBox.width / 2;
      const currentCenterY = currentBox.y + currentBox.height / 2;

      let currentAngle = getAngleFromPoint(pointerPos.x, pointerPos.y, currentCenterX, currentCenterY);
      let angleDelta = currentAngle - initialAngleRef.current;

      // Handle wrap-around (crossing 0/360 boundary)
      if (angleDelta > 180) {
        angleDelta -= 360;
      } else if (angleDelta < -180) {
        angleDelta += 360;
      }

      let newRotation = initialRotationRef.current + angleDelta;

      // Apply angle snapping if Shift is held
      const shiftKey = evt.shiftKey || (evt.evt && evt.evt.shiftKey);
      if (shiftKey) {
        newRotation = snapAngle(newRotation);
      }

      // Normalize rotation to 0-360
      while (newRotation < 0) newRotation += 360;
      while (newRotation >= 360) newRotation -= 360;

      onRotate?.(newRotation);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      const currentStage = groupRef.current?.getStage();
      if (currentStage) {
        const stageContainer = currentStage.container();
        stageContainer.style.cursor = isHovered ? 'grab' : 'default';
        stageContainer.style.userSelect = '';
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
  };

  return (
    <Group ref={groupRef}>
      <Circle
        x={0}
        y={0}
        radius={handleRadius}
        fill="#ffffff"
        stroke={isHovered || isDragging ? "rgba(126, 87, 194, 1)" : "rgba(126, 87, 194, 0.95)"}
        strokeWidth={isHovered || isDragging ? 2 : 1.2}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        listening={true}
      />
      {isHovered && (
        <KonvaText
          x={0}
          y={handleRadius + 8 / scale}
          text="Drag to rotate"
          fontSize={10 / scale}
          fontFamily="Poppins"
          fill="#64748b"
          align="center"
          offsetX={35 / scale}
          listening={false}
        />
      )}
    </Group>
  );
};

export default RotateHandle;

