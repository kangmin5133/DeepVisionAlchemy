import React, { useState, useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";


function MaskedImage({ imageSrc, binaryMask=null, width, height, bbox }) {
    const imageRef = useRef(null);
    const canvasRef = useRef(null);
  
    useEffect(() => {
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        if (binaryMask){
          drawMask(ctx, binaryMask, width, height);
        }
        
        if (bbox) {
          drawBbox(ctx, bbox);
        }
      };
    }, [imageSrc, binaryMask, width, height, bbox]);
  
    const drawMask = (ctx, binaryMask, width, height) => {
      const maskImageData = ctx.createImageData(width, height);
      let maskIndex = 0;
      const blue600 = { r: 49, g: 130, b: 206 }; // blue.600 색상

      for (let i = 0; i < binaryMask.length; i++) {
        for (let j = 0; j < binaryMask[i].length; j++) {
          const value = binaryMask[i][j] ? 255 : 0;
          maskImageData.data[maskIndex * 4] = binaryMask[i][j] ? blue600.r : value;
          maskImageData.data[maskIndex * 4 + 1] = binaryMask[i][j] ? blue600.g : value;
          maskImageData.data[maskIndex * 4 + 2] = binaryMask[i][j] ? blue600.b : value;
          maskImageData.data[maskIndex * 4 + 3] = binaryMask[i][j] ? 100 : 0; // 마스크의 알파값 설정 (100은 반투명)
          maskIndex++;
        }
      }
      ctx.putImageData(maskImageData, 0, 0);

      // 네온 효과를 위한 윤곽선 그리기
      ctx.strokeStyle = `rgba(${blue600.r}, ${blue600.g}, ${blue600.b}, 0.8)`; // 윤곽선 색상 설정
      ctx.lineWidth = 2; // 윤곽선 두께 설정
      ctx.shadowColor = `rgba(${blue600.r}, ${blue600.g}, ${blue600.b}, 1)`; // 그림자 색상 설정
      ctx.shadowBlur = 8; // 그림자 흐림 정도 설정
      for (let i = 1; i < binaryMask.length - 1; i++) {
        for (let j = 1; j < binaryMask[i].length - 1; j++) {
          if (binaryMask[i][j] !== binaryMask[i - 1][j] || binaryMask[i][j] !== binaryMask[i][j - 1]) {
            ctx.beginPath();
            ctx.moveTo(j, i);
            ctx.lineTo(j + 1, i);
            ctx.lineTo(j + 1, i + 1);
            ctx.lineTo(j, i + 1);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
    };

    const drawBbox = (ctx, bbox) => {
          ctx.strokeStyle = "rgba(0, 255, 0, 1)"; // 초록색
          ctx.lineWidth = 2; // 선 두께 설정
          ctx.beginPath();
          ctx.rect(bbox.x1, bbox.y1, bbox.x2 - bbox.x1, bbox.y2 - bbox.y1);
          ctx.shadowColor = "lime";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.stroke();
          // 그림자 효과를 초기화
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        };
  
    return (
        <Box
        position="relative"
        width={width}
        height={height}
        overflow="hidden"
        borderRadius="20px" // 원하는 모서리 둥글기 값 설정
      >
        <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute' }} />
        <img ref={imageRef} src={imageSrc} width={width} height={height} alt="masked-image" />
        </Box>
    );
  }
  
  export default MaskedImage;
