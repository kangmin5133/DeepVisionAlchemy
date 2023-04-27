import React, { useState, useEffect, useRef } from "react";
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
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSquare, 
  faHandPointer, 
  faPlus, 
  faMinus, 
  faEraser, 
  faExchangeAlt  
} from "@fortawesome/free-solid-svg-icons";
import "../css/Predict.css";
import "../css/Button.css";
import "../css/Cursor.css"
import MaskedImage from "./modules/maskImageDraw";

function Predict() {
  // for original & masked image
  const [image, setImage] = useState(null);
  const imageRef = useRef(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [maskedImage, setMaskedImage] = useState(null);

  //for key event
  const [keyStatus, setKeyStatus] = useState({ alt: false, ctrl: false ,delete:false});
  const [imageUpdate, setImageUpdate] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const canvasRef = useRef(null);

  //for bbox
  const [pointerMode, setPointerMode] = useState(true)
  const [bboxMode, setBboxMode] = useState(false);
  const [plusMode, setPlusMode] = useState(false);
  const [minusMode, setMinusMode] = useState(false);
  const [rectStart, setRectStart] = useState(null);
  const [rectEnd, setRectEnd] = useState(null);

  //drawing realtime bbox
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Alt") {
        setKeyStatus((prevStatus) => ({ ...prevStatus, alt: true }));
      }
      if (e.key === "Control") {
        setKeyStatus((prevStatus) => ({ ...prevStatus, ctrl: true }));
      }
      if (e.key === "Delete") {
        // Delete 키를 눌렀을 때의 동작을 여기에 추가하세요
        setKeyStatus((prevStatus) => ({ ...prevStatus, delete: true })) 
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Alt") {
        setKeyStatus((prevStatus) => ({ ...prevStatus, alt: false }));
      }
      if (e.key === "Control") {
        setKeyStatus((prevStatus) => ({ ...prevStatus, ctrl: false }));
      }
      if (e.key === "Delete") {
        // Delete 키를 눌렀을 때의 동작을 여기에 추가하세요
        console.log("Delete Key inserted");
        setDelButtonActive(true);
        setImageUpdate(true);
        setKeyStatus((prevStatus) => ({ ...prevStatus, delete: false })) 
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

   useEffect(() => {
    const updateImage = async () => {
      console.log("image : ",image)
      console.log("imageBlob : ",imageBlob)
      let maskData = null
      if (mouseX !== null && mouseY !== null && !bboxMode && (!plusMode && !minusMode) && !delButtonActive) {
        const formData = new FormData();
        formData.append("image", imageBlob);
        formData.append("x", mouseX);
        formData.append("y", mouseY);
        formData.append("alt_key", keyStatus.alt);
        formData.append("ctrl_key", keyStatus.ctrl);

        const response = await fetch("http://210.113.122.196:8834/predict/point", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (imageRef.current) {
          const mask = data.mask
          maskData = mask.maskData
          const maskSize = mask.size
          const [height, width] = maskSize;
          console.log(maskData);

          setMaskedImage(
            <MaskedImage
              imageSrc={imageRef.current.src}
              binaryMask={maskData}
              width={width}
              height={height}
            />
          );
          console.log("updateImage end");
        }
      }
      else if (mouseX !== null && mouseY !== null && bboxMode && (rectStart && rectEnd) && !delButtonActive){
        const formData = new FormData();
        formData.append("image", imageBlob);
        formData.append("x1", rectStart.x);
        formData.append("y1", rectStart.y);
        formData.append("x2", rectEnd.x);
        formData.append("y2", rectEnd.y);
    
        const response = await fetch("http://210.113.122.196:8834/predict/bbox", {
          method: "POST",
          body: formData,
        });
    
        // 서버 응답 처리
        const data = await response.json();
        if (imageRef.current) {
          const mask = data.mask
          maskData = mask.maskData
          const maskSize = mask.size
          const [height, width] = maskSize;
          const [x1,y1,x2,y2]= mask.bbox
          setMaskedImage(
            <MaskedImage
              imageSrc={imageRef.current.src}
              binaryMask={maskData}
              width={width}
              height={height}
              bbox={{ x1: x1, y1: y1, x2: x2, y2: y2 }}
            />
          );
        }
      }
      else if (mouseX !== null && mouseY !== null && plusMode && !delButtonActive){
        console.log("plus mode")
        const formData = new FormData();
        formData.append("image", imageBlob);
        formData.append("x", mouseX);
        formData.append("y", mouseY);
        formData.append("alt_key", false);
        formData.append("ctrl_key", true);

        const response = await fetch("http://210.113.122.196:8834/predict/point", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (imageRef.current) {
          const mask = data.mask
          maskData = mask.maskData
          const maskSize = mask.size
          const [height, width] = maskSize;
          console.log(maskData);

          setMaskedImage(
            <MaskedImage
              imageSrc={imageRef.current.src}
              binaryMask={maskData}
              width={width}
              height={height}
            />
          );        
        }
      }
      else if (mouseX !== null && mouseY !== null && minusMode && !delButtonActive){
        console.log("minus mode")
        const formData = new FormData();
        formData.append("image", imageBlob);
        formData.append("x", mouseX);
        formData.append("y", mouseY);
        formData.append("alt_key", true);
        formData.append("ctrl_key", false);

        const response = await fetch("http://210.113.122.196:8834/predict/point", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (imageRef.current) {
          const mask = data.mask
          maskData = mask.maskData
          const maskSize = mask.size
          const [height, width] = maskSize;
          console.log(maskData);

          setMaskedImage(
            <MaskedImage
              imageSrc={imageRef.current.src}
              binaryMask={maskData}
              width={width}
              height={height}
            />
          );        
        }
      }
      else if (currentMask && delButtonActive){
        console.log("remove anything mode")
        const formData = new FormData();
        formData.append("image", imageBlob);
        formData.append("mask", JSON.stringify(currentMask));
 
        const response = await fetch("http://210.113.122.196:8834/predict/remove", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (imageRef.current) {
          console.log("data : ",data)
          const imageSize = data.size;
          const [height, width] = imageSize;
          const removedImageData = data.image;
          console.log("removedImageData : ",removedImageData)
          loadImageOntoCanvas("data:image/jpeg;base64," + removedImageData);
          setDelButtonActive(false)

        }
      }
      setCurrentMask(maskData)
    };
    if (imageUpdate) {
      updateImage();
      setImageUpdate(false);
    }
  }, [imageUpdate, mouseX, mouseY,imageBlob]);

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

const onImageChange = (e) => {
  resetStates();
  resizeImage(e.target.files[0], (resizedImage) => {
    setImageBlob(resizedImage); // 이 부분을 추가해주세요.
    fileToDataURL(resizedImage, (dataURL) => {
      setImage(dataURL);
      setPointButtonActive(true);
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

const { getRootProps, getInputProps } = useDropzone({
  accept: "image/*",
  onDrop: (acceptedFiles) => {
    resetStates();
    setImage(acceptedFiles[0]);
    setPointButtonActive(true);
  },
  preventDropOnDocument: true, // 이 부분을 추가
  noClick: true, // 이 부분을 추가
});

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

const onClick = async (e) => {
  e.preventDefault();
  setMouseX(e.nativeEvent.offsetX);
  setMouseY(e.nativeEvent.offsetY);
  setImageUpdate(true);
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
  setPointButtonActive(!pointButtonActive);
  setBboxButtonActive(false);
  setPlusButtonActive(false)
  setMinusButtonActive(false)
};
const handleBboxButtonClick = () => {
  console.log("Bbox Button clicked");
  setBboxMode(true);
  setPointerMode(false)
  setBboxButtonActive(!bboxButtonActive);
  setPointButtonActive(false);
};
const handlePlusButtonClick = () => {
  console.log("+ Button clicked");
  setBboxMode(false);
  setPointerMode(false)
  setPlusMode(true);
  setMinusMode(false);
  setMinusButtonActive(false)
  setPointButtonActive(false);
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
  setMinusButtonActive(!minusButtonActive);
};
const handleDelButtonClick = () => {
  console.log("del Button clicked");
  setDelButtonActive(true);
  setImageUpdate(true);
};
const handleReplaceButtonClick = () => {
  console.log("replace Button clicked");
  setReplaceButtonActive(true);
  setImageUpdate(true);
};

  return (
    <Box className="predict" p={8} bgColor="gray.500" minH="100vh" w="100%">
      <Center>
      <Flex alignItems="center">
        {/* 사이드 툴 박스 */}
          <Box
          bgColor="gray.700"
          borderRadius="20px"
          padding="4"
          boxShadow="xl"
          width="120px"
          marginRight="150px"
          position="absolute" // 위치를 절대적으로 설정
          top="50%" // 상위 요소 대비 세로 위치 50%
          left="10%" // 상위 요소 대비 수평 위치 10%
          transform="translateY(-50%)" // 세로 위치를 정확하게 가운데로 조정
          >
          <VStack spacing={4}>
            <Heading size="lg" color="white">
              Tool
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
              <FontAwesomeIcon icon={faExchangeAlt } />
            </Button>
          </VStack>
          </Box>
        <VStack spacing={8} alignItems="center">
          <Heading as="h1" size="2xl" color="white" marginTop="10">
              Model Inference Demo Space!😉
              </Heading>
              <Button
                onClick={() => {
                  document.querySelector("input[type=file]").click();
                }}
              >
                Select Image
              </Button>
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
                position="relative"
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
                position="relative"
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
              </Box>
              )}
            </VStack>
            </Flex>
          </Center>
        </Box>
      );
    }

export default Predict;

