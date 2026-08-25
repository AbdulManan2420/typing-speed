import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./Header.css";

function Header() {
    const navigate = useNavigate(); 

    const handleLogoClick = () => {
        navigate("/working", {
            state: {
                resetFromLogo: true,
                defaultMode: "time",
                defaultTimeLimit: 15
            }
        });
    };

    return (
        <header className="header">
            <div className="mDiv">
                <div className="logo" onClick={handleLogoClick}>
                    <span className="logoPic">T-B</span>
                    <span className="logoName">TypeBolt</span>
                </div>
                <div className="navigationIcons">
                    <span title="Info" onClick={() => navigate("/about")}>
                        AboutUs
                    </span>
                    <span title="account" onClick={() => navigate("/login-signup")}>
                        Login / SignUp
                    </span>
                </div>
            </div>
        </header>
    );
}

export default Header;
