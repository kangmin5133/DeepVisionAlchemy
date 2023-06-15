import React,{useState,} from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

const UserAuthState = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  return {
    isLoggedIn,user
  }
}

export default UserAuthState;