import { useState, useRef } from "react";

export const usePredictStates = () => {
  // for original & masked image
  const [image, setImage] = useState(null);
  const imageRef = useRef(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [maskedImage, setMaskedImage] = useState(null);

  // for key event
  const [keyStatus, setKeyStatus] = useState({ alt: false, ctrl: false, delete: false });
  const [imageUpdate, setImageUpdate] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const canvasRef = useRef(null);

  // for bbox
  const [pointerMode, setPointerMode] = useState(true);
  const [bboxMode, setBboxMode] = useState(false);
  const [plusMode, setPlusMode] = useState(false);
  const [minusMode, setMinusMode] = useState(false);
  const [rectStart, setRectStart] = useState(null);
  const [rectEnd, setRectEnd] = useState(null);

  // drawing realtime bbox
  const [mouseDown, setMouseDown] = useState(false);

  // button state management
  const [bboxButtonActive, setBboxButtonActive] = useState(false);
  const [pointButtonActive, setPointButtonActive] = useState(false);
  const [plusButtonActive, setPlusButtonActive] = useState(false);
  const [minusButtonActive, setMinusButtonActive] = useState(false);
  const [delButtonActive, setDelButtonActive] = useState(false);
  const [replaceButtonActive, setReplaceButtonActive] = useState(false);

  // max image size
  const MAX_WIDTH = 1080; // 허용되는 최대 가로 크기
  const MAX_HEIGHT = 960; // 허용되는 최대 세로 크기

  // remove anything & replace anything
  const [currentMask, setCurrentMask] = useState(null);
  const [textPrompt, setTextPrompt] = useState("");
  const [goButtonActive, setGoButtonActive] = useState(false);

  // move tool box
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth * 0.2 + "px", y: window.innerHeight * 0.6 + "px" });
  const toolBox = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);

  return {
    image, setImage, imageRef, imageBlob, setImageBlob, maskedImage, setMaskedImage,
    keyStatus, setKeyStatus, imageUpdate, setImageUpdate, mouseX, setMouseX, mouseY, setMouseY, canvasRef,
    pointerMode, setPointerMode, bboxMode, setBboxMode, plusMode, setPlusMode, minusMode, setMinusMode,
    rectStart, setRectStart, rectEnd, setRectEnd, mouseDown, setMouseDown,
    bboxButtonActive, setBboxButtonActive, pointButtonActive, setPointButtonActive, plusButtonActive, setPlusButtonActive,
    minusButtonActive, setMinusButtonActive, delButtonActive, setDelButtonActive, replaceButtonActive, setReplaceButtonActive,
    MAX_WIDTH,MAX_HEIGHT,
    currentMask, setCurrentMask,textPrompt, setTextPrompt,goButtonActive, setGoButtonActive,
    dragging, setDragging, position, setPosition, toolBox, startPos, animationFrame,
  };
};