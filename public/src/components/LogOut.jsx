import React from 'react';
import styled from 'styled-components';
import {BiPowerOff} from 'react-icons/bi';
// import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function LogOut() {
    const navigate = useNavigate();
    const handleClick = async () =>{
        localStorage.clear();
        navigate("/login");
    }
  return (
    <Button onClick={handleClick}>
    <BiPowerOff />
    </Button>
  )
}
const Button = styled.div`
display:flex;
align-items: center;
justify-content: center;
padding:0.5rem;
border-radius: 0.5rem;
border:none;
cursor: pointer;
background-color: #9a86f3;
svg{
    font-size: 1.3rem;
    color:#ebe7ff;
}
`;
