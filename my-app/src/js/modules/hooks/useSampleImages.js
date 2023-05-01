import { useState, useEffect } from "react";

export const useSampleImages = () => {
  const [sampleImages, setSampleImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      const images = await fetchSampleImages();
      setSampleImages(images);
    };

    fetchImages();
  }, []);

  const fetchSampleImages = async () => {
    const response = await fetch("YOUR_SERVER_API/sample_images");
    const data = await response.json();
    return data.images;
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    // 여기에 이미지 선택 처리 로직을 추가합니다.
    console.log("선택된 이미지:", image);
  };

  return {
    sampleImages,
    selectedImage,
    handleImageSelect,
  };
};