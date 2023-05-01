import { useEffect } from "react";
import MaskedImage from "../utils/maskImageDraw";

export const useUpdateImage = (props) => {
  useEffect(() => {
        const updateImage = async () => {
        let maskData = null
        props.setLoading(true);
        if (props.mouseX !== null && props.mouseY !== null && !props.bboxMode && (!props.plusMode && !props.minusMode) 
        && !props.delButtonActive && props.textPrompt == "") {
            const formData = new FormData();
            formData.append("image", props.imageBlob);
            formData.append("x", props.mouseX);
            formData.append("y", props.mouseY);
            formData.append("alt_key", props.keyStatus.alt);
            formData.append("ctrl_key", props.keyStatus.ctrl);

            const response = await fetch("http://210.113.122.196:8834/predict/point", {
                method: "POST",
                body: formData,
        });

        const data = await response.json();
        if (props.imageRef.current) {
            const mask = data.mask
            maskData = mask.maskData
            const maskSize = mask.size
            const [height, width] = maskSize;
            console.log(maskData);

            props.setMaskedImage(
            <MaskedImage
                imageSrc={props.imageRef.current.src}
                binaryMask={maskData}
                width={width}
                height={height}
            />
            );
            console.log("updateImage end");
        }
        }
        else if (props.mouseX !== null && props.mouseY !== null && props.bboxMode && (props.rectStart && props.rectEnd) 
        && !props.delButtonActive && props.textPrompt == ""){
            const formData = new FormData();
            formData.append("image", props.imageBlob);
            formData.append("x1", props.rectStart.x);
            formData.append("y1", props.rectStart.y);
            formData.append("x2", props.rectEnd.x);
            formData.append("y2", props.rectEnd.y);
        
            const response = await fetch("http://210.113.122.196:8834/predict/bbox", {
                method: "POST",
                body: formData,
        });
    
        // 서버 응답 처리
        const data = await response.json();
        if (props.imageRef.current) {
            const mask = data.mask
            maskData = mask.maskData
            const maskSize = mask.size
            const [height, width] = maskSize;
            const [x1,y1,x2,y2]= mask.bbox
            props.setMaskedImage(
            <MaskedImage
                imageSrc={props.imageRef.current.src}
                binaryMask={maskData}
                width={width}
                height={height}
                bbox={{ x1: x1, y1: y1, x2: x2, y2: y2 }}
            />
            );
        }
        }
        else if (props.mouseX !== null && props.mouseY !== null && props.plusMode && !props.delButtonActive && props.textPrompt == ""){
            console.log("plus mode")
            const formData = new FormData();
            formData.append("image", props.imageBlob);
            formData.append("x", props.mouseX);
            formData.append("y", props.mouseY);
            formData.append("alt_key", false);
            formData.append("ctrl_key", true);

            const response = await fetch("http://210.113.122.196:8834/predict/point", {
                method: "POST",
                body: formData,
        });

        const data = await response.json();
        if (props.imageRef.current) {
            const mask = data.mask
            maskData = mask.maskData
            const maskSize = mask.size
            const [height, width] = maskSize;
            console.log(maskData);

            props.setMaskedImage(
            <MaskedImage
                imageSrc={props.imageRef.current.src}
                binaryMask={maskData}
                width={width}
                height={height}
            />
            );        
        }
        }
        else if (props.mouseX !== null && props.mouseY !== null && props.minusMode && !props.delButtonActive && props.textPrompt == ""){
            console.log("minus mode")
            const formData = new FormData();
            formData.append("image", props.imageBlob);
            formData.append("x", props.mouseX);
            formData.append("y", props.mouseY);
            formData.append("alt_key", true);
            formData.append("ctrl_key", false);

            const response = await fetch("http://210.113.122.196:8834/predict/point", {
                method: "POST",
                body: formData,
        });

            const data = await response.json();
            if (props.imageRef.current) {
                const mask = data.mask
                maskData = mask.maskData
                const maskSize = mask.size
                const [height, width] = maskSize;
                console.log(maskData);

                props.setMaskedImage(
                <MaskedImage
                    imageSrc={props.imageRef.current.src}
                    binaryMask={maskData}
                    width={width}
                    height={height}
                />
                );        
            }
        }
        else if (props.currentMask && props.delButtonActive && props.textPrompt == ""){
            console.log("remove anything mode")
            const formData = new FormData();
            formData.append("image", props.imageBlob);
            formData.append("mask", JSON.stringify(props.currentMask));

            const response = await fetch("http://210.113.122.196:8834/predict/remove", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (props.imageRef.current) {
                console.log("data : ",data)
                const imageSize = data.size;
                const [height, width] = imageSize;
                const removedImageData = data.image;
                console.log("removedImageData : ",removedImageData)
                props.loadImageOntoCanvas("data:image/jpeg;base64," + removedImageData);
                props.setDelButtonActive(false)

            }
        }
        else if (props.currentMask && props.textPrompt != "" && props.replaceButtonActive){
            console.log("replace anything mode")
            const formData = new FormData();
            formData.append("image", props.imageBlob);
            formData.append("mask", JSON.stringify(props.currentMask));
            formData.append("prompt", props.textPrompt);

            const response = await fetch("http://210.113.122.196:8834/predict/replace", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (props.imageRef.current) {
                console.log("data : ",data)
                const imageSize = data.size;
                const [height, width] = imageSize;
                const removedImageData = data.image;
                console.log("removedImageData : ",removedImageData)
                props.loadImageOntoCanvas("data:image/jpeg;base64," + removedImageData);

                props.setReplaceButtonActive(false)
                props.setTextPrompt("")
                props.setGoButtonActive(false)
            }
        }
        else if (props.currentMask && props.textPrompt != "" && props.relocateButtonActive){
            console.log("relocate anything mode")
            const formData = new FormData();
            formData.append("image", props.imageBlob);
            formData.append("mask", JSON.stringify(props.currentMask));
            formData.append("prompt", props.textPrompt);

            const response = await fetch("http://210.113.122.196:8834/predict/relocate", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (props.imageRef.current) {
                console.log("data : ",data)
                const imageSize = data.size;
                const [height, width] = imageSize;
                const removedImageData = data.image;
                props.loadImageOntoCanvas("data:image/jpeg;base64," + removedImageData);
                props.setRelocateButtonActive(false)
                props.setTextPrompt("")
                props.setGoButtonActive(false)
            }
        }

        props.setCurrentMask(maskData)
        props.setLoading(false);
    };
    if (props.imageUpdate) {
        updateImage();
        props.setImageUpdate(false);
        
    }
    }, [props.imageUpdate, props.mouseX, props.mouseY,props.imageBlob]);
};