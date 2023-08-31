import React,{ useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./js/pages/Sidebar";
import Topbar from "./js/pages/Topbar";
import Home from "./js/pages/Home";
import Login from "./js/pages/Login";
import Signin from "./js/pages/SignIn";
import LoginLoading from "./js/pages/LoginLoading";
//workspace pages
import LabelingWorkspace from "./js/pages/LabelingWorkspace";
import GenerationWorkspace from "./js/pages/GenerationWorkspace";
import RestorationWorkspace from "./js/pages/RestorationWorkspace";
import ModelHub from "./js/pages/ModelHub";

import Project from "./js/pages/Project";
import SelectUserType from "./js/pages/SelectUserType"
import SelectWorkspaceType from "./js/pages/SelectWorkspaceType"
import Dataset from "./js/pages/Dataset";
import { useSelector, useDispatch } from "react-redux"; 
import { restoreSession } from './js/actions/authActions';

import "./App.css";
import Dashboard from "./js/pages/Dashboard";

const App: React.FC = () => {

  const [menuButton, setMenuButtonActive] = useState(true);
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isProjectPage, setIsProjectPage] =  useState(false);
  
  const toggleMenu = () => {
    setMenuButtonActive(!menuButton);
  };

  const isLoggedIn = useSelector((state: { auth: { isLoggedIn: boolean; }; }) => state.auth.isLoggedIn);
  
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  const hideSidebar = () => {
    setShowSidebar(false);
  };

  const renderSidebar = () => {
    setShowSidebar(true);
  };
  
  return (
    <Router>
      <div className="App">
        {/* <Topbar onMenuClick={toggleMenu}></ Topbar> */}
        {isLoggedIn && <Topbar onMenuClick={toggleMenu}/>}
        {isLoggedIn && showSidebar && <Sidebar isVisible={menuButton} />} {/* 로그인 상태에 따라 사이드바를 보이게 하거나 숨김 */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/select/account" element={<SelectUserType />} />
            <Route path="/select/workspace" element={<SelectWorkspaceType onHideSidebar={() => setShowSidebar(false)} onShowSidebar={() => setShowSidebar(true)} />} />
          
            {/* 추가하려는 다른 페이지에 대한 라우트를 이곳에 추가*/}
            <Route path="/loginLoading" element={<LoginLoading />} />
            <Route path="/dashboard" element={<Dashboard sideBarVisible={menuButton}/>} />
            <Route path="/dashboard/workspace-labeling" element={<LabelingWorkspace sideBarVisible={menuButton}/>} />
            <Route path="/dashboard/workspace-generation" element={<GenerationWorkspace sideBarVisible={menuButton} />} />
            <Route path="/dashboard/workspace-restoration" element={<RestorationWorkspace sideBarVisible={menuButton}/>} />
            <Route path="/dashboard/workspace-labeling/project" element={<Project onHideSidebar={() => setShowSidebar(false)} onShowSidebar={() => setShowSidebar(true)} />} />
            <Route path="/dashboard/workspace-generation/project" element={<Project onHideSidebar={() => setShowSidebar(false)} onShowSidebar={() => setShowSidebar(true)} />} />
            <Route path="/dashboard/workspace-restoration/project" element={<Project onHideSidebar={() => setShowSidebar(false)} onShowSidebar={() => setShowSidebar(true)} />} />
            <Route path="/dashboard/dataset" element={<Dataset sideBarVisible={menuButton}/>} />
            <Route path="/dashboard/modelhub" element={<ModelHub sideBarVisible={menuButton}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;