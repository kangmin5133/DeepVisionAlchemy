import { useEffect } from "react";

export const useKeyboardControls = (props) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.key === "Alt") {
            props.setKeyStatus((prevStatus) => ({ ...prevStatus, alt: true }));
          }
          if (e.key === "Control") {
            props.setKeyStatus((prevStatus) => ({ ...prevStatus, ctrl: true }));
          }
          if (e.key === "Delete") {
            // Delete 키를 눌렀을 때의 동작을 여기에 추가하세요
            props.setKeyStatus((prevStatus) => ({ ...prevStatus, delete: true })) 
          }
        };
    
        const handleKeyUp = (e) => {
          if (e.key === "Alt") {
            props.setKeyStatus((prevStatus) => ({ ...prevStatus, alt: false }));
          }
          if (e.key === "Control") {
            props.setKeyStatus((prevStatus) => ({ ...prevStatus, ctrl: false }));
          }
          if (e.key === "Delete") {
            // Delete 키를 눌렀을 때의 동작을 여기에 추가하세요
            console.log("Delete Key inserted");
            props.setDelButtonActive(true);
            props.setImageUpdate(true);
            props.setKeyStatus((prevStatus) => ({ ...prevStatus, delete: false })) 
          }
        };
    
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
    
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
          window.removeEventListener("keyup", handleKeyUp);
        };
      }, []);
    };