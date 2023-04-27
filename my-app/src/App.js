import React,{ useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import Sidebar from "./js/Sidebar";
import Topbar from "./js/Topbar";
import Home from "./js/Home";
import Predict from "./js/Predict";
import "./App.css";

function App() {

  const [menuButton, setMenuButtonActive] = useState(true);
  const toggleMenu = () => {
    setMenuButtonActive(!menuButton);
  };

  return (
    <Router>
      <div className="App">
        <Topbar onMenuClick={toggleMenu}></ Topbar>
        <Sidebar isVisible={menuButton} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            {/* 추가하려는 다른 페이지에 대한 라우트를 이곳에 추가*/}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;