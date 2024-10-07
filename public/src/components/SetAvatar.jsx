import React, { useEffect, useState } from 'react';
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { setAvatarRoute } from '../utils/APIRoutes';
import styled from 'styled-components';
import { Buffer } from "buffer";

export default function SetAvatar() {
    const api = `https://api.multiavatar.com/4645646`;
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    // Redirect to login if no user is found in localStorage
    useEffect(() => {
        if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            navigate("/login");
        }
    }, [navigate]);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        } else {
            const user = await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            );
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });
            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(user));
                navigate("/");
            } else {
                toast.error("Error setting avatar, please try again", toastOptions);
            }
        }
    };

    // Fetch avatars with retry logic for rate limit (429) errors
    const fetchAvatarWithRetry = async (retryCount = 3) => {
        const data = [];
        for (let i = 0; i < 4; i++) { // Reduced the number of avatars
            try {
                const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = new Buffer(response.data);
                data.push(buffer.toString("base64"));
            } catch (error) {
                if (error.response && error.response.status === 429 && retryCount > 0) {
                    toast.warning("Rate limit hit, retrying...", toastOptions);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
                    return fetchAvatarWithRetry(retryCount - 1);
                } else {
                    console.error("Error fetching avatar:", error);
                    toast.error("Failed to fetch avatars", toastOptions);
                    break;
                }
            }
        }
        setAvatars(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAvatarWithRetry();
    }, []);

    return (
        <>
            {
                isLoading ? (
                    <Container>
                        <img src={loader} alt="loader" className='loader' />
                    </Container>
                ) : (
                    <Container>
                        <div className="title-container">
                            <h1>Pick an Avatar as Your Profile Picture</h1>
                        </div>
                        <div className="avatars">
                            {avatars.map((avatar, index) => (
                                <div
                                    key={index}
                                    className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                                    onClick={() => setSelectedAvatar(index)}
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                    />
                                </div>
                            ))}
                        </div>
                        <button onClick={setProfilePicture} className='submit-btn'>
                            Set as Profile Picture
                        </button>
                        <ToastContainer />
                    </Container>
                )
            }
        </>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
