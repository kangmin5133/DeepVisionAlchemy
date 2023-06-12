import React,{ useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./js/pages/Sidebar";
import Topbar from "./js/pages/Topbar";
import Home from "./js/pages/Home";
import Login from "./js/pages/Login";
import Signin from "./js/pages/SignIn";
import LoginLoading from "./js/pages/LoginLoading";
import Workspace from "./js/pages/Workspace";
import Project from "./js/pages/Project";
import SelectUserType from "./js/pages/SelectUserType"
import Dataset from "./js/pages/Dataset";
import { useSelector, useDispatch } from "react-redux"; 
import { restoreSession } from './js/actions/authActions';

import "./App.css";
import Dashboard from "./js/pages/Dashboard";

const App: React.FC = () => {

  const [menuButton, setMenuButtonActive] = useState(true);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setMenuButtonActive(!menuButton);
  };

  const isLoggedIn = useSelector((state: { auth: { isLoggedIn: boolean; }; }) => state.auth.isLoggedIn);
  
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);
  
  return (
    <Router>
      <div className="App">
        {/* <Topbar onMenuClick={toggleMenu}></ Topbar> */}
        {isLoggedIn && <Topbar onMenuClick={toggleMenu} />}
        {isLoggedIn && <Sidebar isVisible={menuButton} />} {/* 로그인 상태에 따라 사이드바를 보이게 하거나 숨김 */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/usertype" element={<SelectUserType />} />
            {/* 추가하려는 다른 페이지에 대한 라우트를 이곳에 추가*/}
            <Route path="/loginLoading" element={<LoginLoading />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/workspace" element={<Workspace />} />
            <Route path="/dashboard/workspace/project" element={<Project />} />
            <Route path="/dataset" element={<Dataset />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;