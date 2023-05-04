import { useState, useEffect } from "react";

export const useSampleImages = (sampleActive, onImageSelect,setIsLoading) => {
  const [sampleImages, setSampleImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!sampleActive) return; // sampleActive가 false일 경우 로직을 실행하지 않음
    console.log("fetch images")
    const fetchImages = async () => {
      setIsLoading(true);
      const images = await fetchSampleImages();
      setSampleImages(images);
      setIsLoading(false);
    };

    fetchImages();
  }, [sampleActive]);

  const fetchSampleImages = async () => {
    const response = await fetch("http://210.113.122.196:8834/image/sample")
    const data = await response.json();
    const dataUrl = "data:image/jpeg;base64,";
  
    // 각 이미지에 "data:image/jpeg;base64,"를 추가
    const processedImages = data.images.map((image) => {
      return {
        ...image,
        url: dataUrl + image,
      };
    });
  
    return processedImages;
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    // 여기에 이미지 선택 처리 로직을 추가합니다.
    console.log("선택된 이미지:", image.url);
    onImageSelect(image);
  };

  return {
    sampleImages,
    selectedImage,
    handleImageSelect,
  };
};

export const useGeneratedImages = () => {
  const fetchGeneratedImages = async (textPrompt, manualSeed) => {
    const response = await fetch("http://210.113.122.196:8834/image/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text_prompt: textPrompt, manual_seed: manualSeed }),
    });
    const data = await response.json();
    const dataUrl = "data:image/jpeg;base64,";
    const images = data.images.map((image) => ({
      url: dataUrl + image,
      name: "Generated Image",
    }));
    return images;
  };

  return fetchGeneratedImages;
};
