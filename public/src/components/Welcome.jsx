import React from 'react'
import Robot from  "../assets/robot.gif";
import styled from 'styled-components';

export default function Welcome({ currentUser}) {
  return (
    <Container>
    <img src={Robot} alt='robot' />
    <h1>
        Welcome,<span>{currentUser.username}!</span>
    </h1>
     <h3>Please Select a chat to Start Messaging</h3>
    </Container>
  )
}
const Container = styled.div`
display:flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: white;
font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
font-size: 20px;
img{
    height: 20rem;

}
span{
    color: #4e00ff;
}
h3{
  line-height: 50px;
}

`;
