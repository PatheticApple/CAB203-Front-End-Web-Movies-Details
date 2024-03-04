import { Link } from "react-router-dom";
import { useState } from "react";



export default function Nav() {
    // Get page value the user is on
    const [selectedPage, setSelectedPage] = useState();

    // Set page value when user changes page
    const settingSelectedPage = (value) => {
        localStorage.setItem("selectedPage", value);
        const selectedPage2 = localStorage.getItem("selectedPage");
        setSelectedPage(selectedPage2);

    };

    // Function to render buttons on Nav
    function HomeButton() {
        const selectedPage = localStorage.getItem("selectedPage");
        if (selectedPage == 'Home') {
            return (
                <li style={{ "backgroundColor": '#8E000A' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Home');

                    }}
                        to="/">Home</Link>
                </li>
            )
        }
        else {
            return (
                <li style={{ "backgroundColor": '' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Home');

                    }}
                        to="/">Home</Link>
                </li>
            )
        };
    }
    function RegisterButton() {
        const selectedPage = localStorage.getItem("selectedPage");
        if (selectedPage == 'Register') {
            return (
                <li style={{ "backgroundColor": '#8E000A' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Register');

                    }}
                        to="/Register">Register</Link>
                </li>
            )
        }
        else {
            return (
                <li style={{ "backgroundColor": '' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Register');

                    }}
                        to="/Register">Register</Link>
                </li>
            )
        };
    }
    function LoginButton() {
        const selectedPage = localStorage.getItem("selectedPage");
        if (selectedPage == 'Login') {
            return (
                <li style={{ "backgroundColor": '#8E000A' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Login');

                    }}
                        to="/Login">Login</Link>
                </li>
            )
        }
        else {
            return (
                <li style={{ "backgroundColor": '' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Login');

                    }}
                        to="/Login">Login</Link>
                </li>
            )
        };
    }
    function MovieButton() {
        const selectedPage = localStorage.getItem("selectedPage");
        if (selectedPage == 'Movie') {
            return (
                <li style={{ "backgroundColor": '#8E000A' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Movie');

                    }}
                        to="/Movies">Movies</Link>
                </li>
            )
        }
        else {
            return (
                <li style={{ "backgroundColor": '' }}>
                    <Link onClick={() => {
                        settingSelectedPage('Movie');

                    }}
                        to="/Movies">Movies</Link>
                </li>
            )
        };
    }


    return (
        <nav>
            <ul>
                <HomeButton />
                <MovieButton />
                <RegisterButton />
                <LoginButton />
            </ul>
        </nav>
    );
}