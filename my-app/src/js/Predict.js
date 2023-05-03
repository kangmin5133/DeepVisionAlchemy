import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Text,
  Center,
  Flex,
  Heading,
  Input,
  VStack,
  Button,
  Spinner,
  HStack
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSquare, 
  faHandPointer, 
  faPlus, 
  faMinus, 
  faEraser, 
  faExchangeAlt,
  faRandom,
  faGlobe 
} from "@fortawesome/free-solid-svg-icons";
import "../css/Predict.css";
import "../css/Button.css";
import "../css/Cursor.css"

import MaskedImage from "./modules/utils/maskImageDraw";
import { usePredictStates } from "./modules/components/predictStates";
import { useKeyboardControls } from "./modules/hooks/useKeyboardControls";
import { useUpdateImage } from "./modules/hooks/useUpdateImage";
import { useDraggingControls } from "./modules/hooks/useDraggingControls";
import ImageSidebar from "./modules/components/imageSidebar";

function Predict() {

  //states
  const {
    image, setImage, imageRef, imageBlob, setImageBlob, maskedImage, setMaskedImage,
    keyStatus, setKeyStatus, imageUpdate, setImageUpdate, mouseX, setMouseX, mouseY, setMouseY, canvasRef,
    pointerMode, setPointerMode, bboxMode, setBboxMode, plusMode, setPlusMode, minusMode, setMinusMode,
    rectStart, setRectStart, rectEnd, setRectEnd, mouseDown, setMouseDown,
    bboxButtonActive, setBboxButtonActive, pointButtonActive, setPointButtonActive, plusButtonActive, setPlusButtonActive,
    minusButtonActive, setMinusButtonActive, delButtonActive, setDelButtonActive, replaceButtonActive, setReplaceButtonActive,
    relocateButtonActive, setRelocateButtonActive,MAX_WIDTH, MAX_HEIGHT,
    currentMask, setCurrentMask,textPrompt, setTextPrompt,goButtonActive, setGoButtonActive,
    dragging, setDragging, position, setPosition, toolBox, startPos, animationFrame,
    loading, setLoading, isOpen, onToggle,
    sampleImageButtonActive, setSampleImageButtonActive,generateImageButtonActive, setGenerateImageButtonActive
  } = usePredictStates();

  //functions
const resetStates = () => {
  // 마스크 초기화
  setMaskedImage(null);

  // 마우스 좌표 초기화
  setMouseX(null);
  setMouseY(null);

  // Bounding box 관련 상태 초기화
  setBboxMode(false);
  setRectStart(null);
  setRectEnd(null);

  // Button 상태 초기화
  setBboxButtonActive(false);
  setPointButtonActive(false);
};
const getCursorStyle = () => {
  if (bboxMode) {
    return "crosshair";
  } else if (plusMode) {
    return "url(http://210.113.122.196:8839/plus.png), auto";
    // return "url(../image/plus.png), auto";
    // return "custom-plus"
  } else if (minusMode) {
    return "url(http://210.113.122.196:8839/minus.png), auto";
    // return "url(../image/minus.png), auto";
    // return "custom-minus"
  } else if (pointerMode) {
    return "pointer";
  }
};
const loadImageOntoCanvas = (base64Image) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const tempImage = new Image();
  tempImage.src = base64Image;
  tempImage.onload = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    canvas.width = tempImage.width;
    canvas.height = tempImage.height;
    ctx.drawImage(tempImage, 0, 0, tempImage.width, tempImage.height);

    // 캔버스의 이미지 데이터를 원본 이미지로 설정
    const updatedImageData = canvas.toDataURL();
    setImage(updatedImageData);
    setMaskedImage(
      <MaskedImage
        imageSrc={base64Image}
        width={canvas.width}
        height={canvas.height}
      />
    );
    canvas.toBlob((blob) => {
      setImageBlob(blob);
    }, "image/jpeg", 1);
  };
};
const resizeImage = (imageFile, callback) => {
  if (!imageFile) return;
  const img = new Image();
  img.src = URL.createObjectURL(imageFile);
  img.onload = () => {
    const canvas = document.createElement("canvas");
    let { width, height } = img;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
  }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob((blob) => {
      callback(blob);
    }, "image/jpeg", 0.95); // 이미지 포맷과 압축률을 설정합니다
  };
};
const fileToDataURL = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => callback(reader.result);
};
const drawRectangle = (x1, y1, x2, y2) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(x1, y1, x2 - x1, y2 - y1);

  // 네온 사인 효과를 위한 그림자 설정
  ctx.shadowColor = "lime";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.strokeStyle = "rgba(0, 255, 0, 1)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 그림자 효과를 초기화
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
};
const { getRootProps, getInputProps } = useDropzone({
  accept: "image/*",
  onDrop: (acceptedFiles) => {
    resetStates();
    resizeImage(acceptedFiles[0], (resizedImage) => {
      setImageBlob(resizedImage);
      fileToDataURL(resizedImage, (dataURL) => {
        setImage(dataURL);
        setPointButtonActive(true);
        setReplaceButtonActive(false)
        setDelButtonActive(false)
        // loadImageOntoCanvas(dataURL);
      });
    });
  },
  preventDropOnDocument: true, // 이 부분을 추가
  noClick: true, // 이 부분을 추가
});

//handlers
const handleSampleImageButtonClick = () => {
  if (generateImageButtonActive) return;
  console.log("use sample image Button clicked");
  setSampleImageButtonActive(!sampleImageButtonActive);
  setGenerateImageButtonActive(false);
  onToggle();
};
const handleGenerateImageButtonClick = () => {
  if (sampleImageButtonActive) return;
  console.log("generate image Button clicked");
  setGenerateImageButtonActive(!generateImageButtonActive);
  setSampleImageButtonActive(false);
  onToggle();
};

const onClick = async (e) => {
  e.preventDefault();
  setMouseX(e.nativeEvent.offsetX);
  setMouseY(e.nativeEvent.offsetY);
  setImageUpdate(true);
};
const onImageChange = (e) => {
  resetStates();
  resizeImage(e.target.files[0], (resizedImage) => {
    setImageBlob(resizedImage); // 이 부분을 추가해주세요.
    fileToDataURL(resizedImage, (dataURL) => {
      setImage(dataURL);
      setPointButtonActive(true);
      setReplaceButtonActive(false)
      setDelButtonActive(false)
      // loadImageOntoCanvas(dataURL);
    });
  });
};
const onCanvasDrop = (e) => {
  resetStates();
  resizeImage(e.dataTransfer.files[0], (resizedImage) => {
    setImageBlob(resizedImage); // 이 부분을 추가해주세요.
    fileToDataURL(resizedImage, (dataURL) => {
      setImage(dataURL);
      setPointButtonActive(true);
    });
  });
};
const handleMouseDown = (e) => {
  if (bboxMode) {
    setRectStart({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setMouseDown(true)
    console.log("rectStart", rectStart);
  }
};
const handleMouseUp = (e) => {
  if (bboxMode) {
    setRectEnd({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setMouseDown(false)
    console.log("RectEnd", rectEnd);
  }
};
const handleMouseMove = (e) => {
  if (bboxMode && mouseDown && rectStart) {
    console.log("mouse move detected");
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    drawRectangle(rectStart.x, rectStart.y, x, y);
  }
};


const handlePointButtonClick = () => {
  console.log("point Button clicked");
  setBboxMode(false);
  setPointerMode(true)
  setMinusMode(false)
  setPlusMode(false)
  setTextPrompt("")
  setPointButtonActive(!pointButtonActive);
  setBboxButtonActive(false);
  setPlusButtonActive(false)
  setMinusButtonActive(false)
};
const handleBboxButtonClick = () => {
  console.log("Bbox Button clicked");
  setBboxMode(true);
  setPointerMode(false);
  setTextPrompt("");
  setBboxButtonActive(!bboxButtonActive);
  setPointButtonActive(false);
};
const handlePlusButtonClick = () => {
  console.log("+ Button clicked");
  setBboxMode(false);
  setPointerMode(false);
  setPlusMode(true);
  setMinusMode(false);
  setMinusButtonActive(false);
  setPointButtonActive(false);
  setTextPrompt("");
  setPlusButtonActive(!plusButtonActive);
};
const handleMinusButtonClick = () => {
  console.log("- Button clicked");
  setBboxMode(false);
  setPointerMode(false)
  setPlusMode(false);
  setMinusMode(true);
  setPlusButtonActive(false)
  setPointButtonActive(false);
  setTextPrompt("")
  setMinusButtonActive(!minusButtonActive);
};
const handleDelButtonClick = () => {
  console.log("del Button clicked");
  setDelButtonActive(!delButtonActive);
  setImageUpdate(true);
  setTextPrompt("")
};
const handleReplaceButtonClick = () => {
  console.log("replace Button clicked");
  setReplaceButtonActive(!replaceButtonActive);
  setTextPrompt("")
};
const handleRelocateButtonClick = () => {
  console.log("relocate Button clicked");
  setRelocateButtonActive(!relocateButtonActive);
  setTextPrompt("")
};


const handleToolBoxMoveDown = (e) => {
  e.preventDefault();
  startPos.current = { x: e.clientX - parseFloat(position.x), y: e.clientY - parseFloat(position.y) };
  setDragging(true);
};
const handleToolBoxMove = (e) => {
  if (!dragging) return;

  e.preventDefault();
  let newX = e.clientX - startPos.current.x;
  let newY = e.clientY - startPos.current.y;

   // 툴박스의 너비와 높이
   const boxWidth = toolBox.current.offsetWidth;
   const boxHeight = toolBox.current.offsetHeight;
 
   // 화면의 너비와 높이
   const screenWidth = window.innerWidth;
   const screenHeight = window.innerHeight;

   // topbar의 높이
  const topBarHeight = 60;
 
   // 툴박스가 화면 경계를 벗어나지 않도록 위치를 조절
   newX = Math.max(0 + boxWidth / 2, Math.min(screenWidth - boxWidth / 2, newX));
   newY = Math.max(topBarHeight + boxHeight / 2, Math.min(screenHeight - boxHeight / 2, newY));

  requestAnimationFrame(() => {
    setPosition({ x: newX + "px", y: newY + "px" }); 
  });
};
const handleToolBoxMoveUp = (e) => {
  setDragging(false)
  cancelAnimationFrame(animationFrame.current);
};

const handleSampleImageSelect = async (image) => {
  console.log("샘플 이미지가 선택되었습니다:", image);

  // 이미지 데이터를 가져옵니다.
  const response = await fetch(image.url);
  const imageBlob = await response.blob();

  resetStates();

  resizeImage(imageBlob, (resizedImage) => {
    setImageBlob(resizedImage);
    fileToDataURL(resizedImage, (dataURL) => {
      setImage(dataURL);
      setPointButtonActive(true);
      setReplaceButtonActive(false);
      setDelButtonActive(false);
    });
  });
};

//props for hooks
const propsUseUpdateImage = {
  delButtonActive,
  imageUpdate,
  setImageUpdate,
  mouseX,
  mouseY,
  imageBlob,
  setCurrentMask,
  textPrompt,
  setTextPrompt,
  replaceButtonActive,
  setReplaceButtonActive,
  relocateButtonActive,
  setRelocateButtonActive, 
  goButtonActive,
  setGoButtonActive,
  setMaskedImage,
  imageRef,
  loadImageOntoCanvas,
  currentMask,
  setDelButtonActive,
  keyStatus, 
  bboxMode, 
  rectStart, 
  rectEnd, 
  plusMode, 
  minusMode,
  loading, 
  setLoading
};
const propsUseKeyboardControls={
  setKeyStatus, 
  setDelButtonActive, 
  setImageUpdate
};
const propsUseDraggingControls={
  dragging, 
  handleToolBoxMove, 
  handleToolBoxMoveUp
}

// hooks
useKeyboardControls(propsUseKeyboardControls);
useUpdateImage(propsUseUpdateImage);
useDraggingControls(propsUseDraggingControls);

//useEffect - console
useEffect(() => {
  console.log("loading : ",loading)
  console.log("isOpen : ",isOpen)
},[loading,isOpen]);

  return (
    <Box className="predict" p={8} bgColor="gray.500" minH="100vh" w="100%">
      <Center>
      <Flex alignItems="center">
        {/* 사이드 툴 박스 */}
          <Box id = "toolbox"
          ref={toolBox}
          bgColor="gray.700"
          borderRadius="20px"
          padding="4"
          boxShadow="xl"
          width="150px"
          position="absolute"
          top={position.y}
          left={position.x}
          transform="translate(-50%, -50%)"
          onMouseDown={handleToolBoxMoveDown}
          onMouseMove={handleToolBoxMove}
          onMouseUp={handleToolBoxMoveUp}
          zIndex={100}
          >
          <VStack spacing={4}>
            <Heading size="lg" color="white">
              Tools 🛠️
            </Heading>
            <Heading size="lg">
            </Heading>
            <Button onClick={handlePointButtonClick} colorScheme="blue" 
            className={`custom-button ${pointButtonActive ? "custom-button-active" : ""}`}>
              <FontAwesomeIcon icon={faHandPointer} />
            </Button>
            <Button onClick={handleBboxButtonClick} colorScheme="blue" 
            className={`custom-button ${bboxButtonActive ? "custom-button-active" : ""}`}>
              <FontAwesomeIcon icon={faSquare} />
            </Button>
            <Button onClick={handlePlusButtonClick} colorScheme="blue"
            className={`custom-button ${plusButtonActive ? "custom-button-active" : ""}`}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Button onClick={handleMinusButtonClick} colorScheme="blue"
            className={`custom-button ${minusButtonActive ? "custom-button-active" : ""}`}>
              <FontAwesomeIcon icon={faMinus} />
            </Button>
            <Button onClick={handleDelButtonClick} colorScheme="blue"
            className={`custom-button ${delButtonActive ? "custom-button-active" : ""}`}>
              <FontAwesomeIcon icon={faEraser} />
            </Button>
            <Button onClick={handleReplaceButtonClick} colorScheme="blue"
            className={`custom-button ${replaceButtonActive ? "custom-button-active" : ""}`}>
              <FontAwesomeIcon icon={faExchangeAlt} />
            </Button>
            <Button onClick={handleRelocateButtonClick} colorScheme="blue"
            className={`custom-button ${relocateButtonActive ? "custom-button-active" : ""}`}>
              <FontAwesomeIcon icon={faRandom} />
            </Button>
          </VStack>
          </Box>
        <VStack spacing={8} alignItems="center">
          <Heading as="h1" size="2xl" color="white" marginTop="10">
              Model Inference Demo Space!😉
          </Heading>
          <HStack spacing={10}>
              <Button fontStyle="italic"
                onClick={() => {
                  document.querySelector("input[type=file]").click();
                }}
              >
                Select Image
                
              </Button>
              <Text color="white" fontSize="xl" fontStyle="italic">OR</Text>
              <Button fontStyle="italic"
                onClick={handleSampleImageButtonClick}
              >
                Use Sample Image
                
              </Button>
              <Text color="white" fontSize="xl" fontStyle="italic">OR</Text>
              <Button fontStyle="italic"
                onClick={handleGenerateImageButtonClick}
              >
                Generate Image
                
              </Button>
          </HStack>  
              {/* 수정된 이미지 업로드 부분 */}
              <Box
                {...getRootProps()}
                w="540px" // 수정된 크기
                h="640px" // 수정된 크기
                border="2px dashed white"
                borderRadius="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                textAlign="center"
                position="absolute" // 수정된 속성: "relative"에서 "absolute"로 변경
                top="55%" // 수정된 속성: 상단에서 55% 위치
                left="50%" // 수정된 속성: 좌측에서 50% 위치
                transform="translate(-50%, -50%)" // 수정된 속성: 부모 요소의 중앙에 위치하도록 설정
                style={{
                  display: maskedImage ? "none" : "flex", 
                  display : imageRef.current ? "none" : "flex"
                }}
              >
              <input {...getInputProps({ onChange: onImageChange })} />
              <Text color="white" fontWeight="bold" fontSize={"2xl"}>
                Drag Image Here!
              </Text>
            </Box>
              {image && (
              <Box
                display="inline-block"
                position="absolute" // 수정된 속성: "relative"에서 "absolute"로 변경
                top="55%" // 수정된 속성: 상단에서 55% 위치
                left="50%" // 수정된 속성: 좌측에서 50% 위치
                transform="translate(-50%, -50%)" // 수정된 속성: 부모 요소의 중앙에 위치하도록 설정
                mt={4}
                w="fit-content"
                borderRadius="20px"
                boxShadow={"0 0 8px #3182ce, 0 0 16px #3182ce, 0 0 24px #3182ce, 0 0 32px #3182ce"}
              >
                <Box style={{ cursor: getCursorStyle() }}>
                <canvas id="canvas-1"
                  ref={canvasRef}
                  width={imageRef.current ? imageRef.current.width : 0}
                  height={imageRef.current ? imageRef.current.height : 0}
                  onClick={onClick}
                  onMouseDown={handleMouseDown} // 추가된 이벤트 핸들러
                  onMouseUp={handleMouseUp} // 추가된 이벤트 핸들러
                  onMouseMove={handleMouseMove} // 추가된 이벤트 핸들러
                  // onLoad={handleImageLoad}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: "20px",
                    zIndex: 1,
                    // display : maskedImage ? "none" : "block"
                  }}
                  onDrop={onCanvasDrop}
                  onDragOver={(e) => e.preventDefault()}
                />
                <img id="img-1"
                  ref={imageRef}
                  src={image}
                  onClick={onClick}
                  onMouseDown={handleMouseDown} // 추가된 이벤트 핸들러
                  onMouseUp={handleMouseUp} // 추가된 이벤트 핸들러
                  onMouseMove={handleMouseMove} // 추가된 이벤트 핸들러
                  style={{
                    borderRadius : "20px",
                    // cursor: bboxMode ? "crosshair" : "pointer", // Bbox 모드일 때 커서 모양 변경
                    display : maskedImage ? "none" : "block"
                  }}
                  onLoad={() => {
                  // handleImageLoad()
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext("2d");
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  }}
                />
                {maskedImage}
                </Box>
                {(replaceButtonActive || relocateButtonActive) &&  (
                   <Box
                   display="inline-block"
                   position="absolute"
                   top="102%" // 이미지의 바로 아래에 위치하도록 설정
                   left="45%" // 이미지의 중앙에 위치하도록 설정
                   transform="translate(-50%, 0)" // 부모 요소의 중앙에 위치하도록 설정
                   w={imageRef.current ? imageRef.current.width : 0}
                 >
                   <Input
                     placeholder="여기에 텍스트를 입력하세요"
                     value={textPrompt}
                     onChange={(e) => setTextPrompt(e.target.value)}
                     width="calc(100% - 50px)" // 이미지의 너비에서 "Go" 버튼의 너비를 빼고 남은 공간에 입력창을 배치합니다.
                     bg = "gray.700"
                     color="white"
                    // width="100%"
                   />
                   <Button
                     position="absolute"
                     right={-8} // "Go" 버튼을 입력창의 오른쪽 끝에 위치하도록 설정합니다.
                     top={0}
                     width="50px"
                     colorScheme="blue"
                     onClick={() => {
                      console.log("입력된 값: ", textPrompt);
                      setGoButtonActive(true);
                      setImageUpdate(true);
                     }}
                   >
                     🚀
                   </Button>
                 </Box>

                  )}
                {loading && (
                  <Box
                  display="flex"
                  position="absolute"
                  justifyContent="center"
                  alignItems="center"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  zIndex={100}
                  w="100%"
                  h="100%"
                  borderRadius="20px"
                  bg="gray.400"
                  opacity={0.8}             
                >
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                  </Box>
                )}
              </Box>
              )}
            </VStack>
            </Flex>
            <ImageSidebar 
            isOpen={isOpen} 
            generateActive={generateImageButtonActive} 
            sampleActive={sampleImageButtonActive} 
            onImageSelect={handleSampleImageSelect} />
          </Center>
        </Box>
      );
    }

export default Predict;

