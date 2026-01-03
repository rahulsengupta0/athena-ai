import React, { useState, useRef, useEffect } from 'react';
import { Circle, Group, Text as KonvaText } from 'react-konva';

const ROTATE_SNAP_ANGLE = 15; // Degrees to snap to when Shift is held

/**
 * RotateHandle - CSS-style rotation using Konva rotation property
 * 
 * Features:
 * - Rotation around center (transform-origin: center equivalent)
 * - No scale usage - rotation only
 * - Smooth mouse-based rotation
 * - Optional angle snapping (15° with Shift)
 * - No size changes on click/reselect
 */
const RotateHandle = ({ targetRef, isVisible, scale = 1, onRotate, layer }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const groupRef = useRef(null);
  const isDraggingRef = useRef(false);
  const initialAngleRef = useRef(0);
  const initialRotationRef = useRef(0);

  // Position handle below element, centered
  useEffect(() => {
    if (!isVisible || !targetRef?.current || !groupRef.current) return;

    const targetNode = targetRef.current;
    const handleGroup = groupRef.current;

    // Get bounding box - this gives us the visual bounds after rotation
    const box = targetNode.getClientRect();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // Position handle below the element, centered
    const handleY = box.y + box.height + 20 / scale;
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
      stage.container().style.cursor = 'grab';
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

  /**
   * Calculate angle from point to center (in degrees, 0-360)
   */
  const getAngleFromPoint = (pointX, pointY, centerX, centerY) => {
    const dx = pointX - centerX;
    const dy = pointY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // Normalize to 0-360
    if (angle < 0) angle += 360;
    return angle;
  };

  /**
   * Snap angle to nearest ROTATE_SNAP_ANGLE increment
   */
  const snapAngle = (angle) => {
    return Math.round(angle / ROTATE_SNAP_ANGLE) * ROTATE_SNAP_ANGLE;
  };

  /**
   * Get the visual center of the node (accounting for rotation)
   * This ensures rotation happens around the element's center
   */
  const getNodeCenter = (node) => {
    if (!node) return { x: 0, y: 0 };
    
    // Get the absolute position (center of the Group)
    const absPos = node.getAbsolutePosition?.();
    if (absPos) {
      // The node's position is already at center due to offsetX/offsetY
      // So absPos is the center point
      return absPos;
    }
    
    // Fallback: calculate from bounding box
    const box = node.getClientRect();
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  };

  const handleMouseDown = (e) => {
    e.cancelBubble = true;
    setIsDragging(true);
    isDraggingRef.current = true;
    
    const targetNode = targetRef.current;
    if (!targetNode) return;

    // Get the center point for rotation (transform-origin: center equivalent)
    const { x: centerX, y: centerY } = getNodeCenter(targetNode);

    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    
    // Calculate initial angle from mouse to center
    const startAngle = getAngleFromPoint(pointerPos.x, pointerPos.y, centerX, centerY);
    initialAngleRef.current = startAngle;
    initialRotationRef.current = layer?.rotation || 0;

    const stageContainer = stage.container();
    stageContainer.style.cursor = 'grabbing';
    stageContainer.style.userSelect = 'none';

    const handleMouseMove = (evt) => {
      if (!isDraggingRef.current) return;

      const currentStage = groupRef.current?.getStage();
      if (!currentStage) return;
      
      const pointerPos = currentStage.getPointerPosition();
      if (!pointerPos) return;

      // Recalculate center in case element moved
      const { x: currentCenterX, y: currentCenterY } = getNodeCenter(targetNode);

      // Calculate current angle from mouse to center
      let currentAngle = getAngleFromPoint(pointerPos.x, pointerPos.y, currentCenterX, currentCenterY);
      
      // Calculate angle delta (handling wrap-around at 0/360 boundary)
      let angleDelta = currentAngle - initialAngleRef.current;
      if (angleDelta > 180) {
        angleDelta -= 360;
      } else if (angleDelta < -180) {
        angleDelta += 360;
      }

      // Apply rotation delta to initial rotation
      let newRotation = initialRotationRef.current + angleDelta;

      // Apply angle snapping if Shift is held
      const shiftKey = evt.shiftKey || (evt.evt && evt.evt.shiftKey);
      if (shiftKey) {
        newRotation = snapAngle(newRotation);
      }

      // Normalize rotation to 0-360 range
      while (newRotation < 0) newRotation += 360;
      while (newRotation >= 360) newRotation -= 360;

      // Callback with new rotation (CSS transform: rotate equivalent)
      onRotate?.(newRotation);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      
      // CRITICAL: Reset scale immediately after rotation ends
      // Ensure no scale transforms are left behind from rotation
      const targetNode = targetRef.current;
      if (targetNode) {
        targetNode.scaleX(1);
        targetNode.scaleY(1);
        targetNode.getLayer()?.batchDraw();
      }
      
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
