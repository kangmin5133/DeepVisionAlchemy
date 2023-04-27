import { useEffect } from "react";

export const useDraggingControls = (props) => {
  useEffect(() => {
    if (props.dragging) {
      window.addEventListener("mousemove", props.handleToolBoxMove);
      window.addEventListener("mouseup", props.handleToolBoxMoveUp);
    } else {
      window.removeEventListener("mousemove", props.handleToolBoxMove);
      window.removeEventListener("mouseup", props.handleToolBoxMoveUp);
    }
  
    return () => {
      window.removeEventListener("mousemove", props.handleToolBoxMove);
      window.removeEventListener("mouseup", props.handleToolBoxMoveUp);
    };
  }, [props.dragging]);
};