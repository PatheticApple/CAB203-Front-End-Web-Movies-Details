import React from 'react';
import { useState } from 'react';






export default function Login() {
    const [typedEmail, setTypedEmail] = useState('');
    const [typedPass, setTypedPass] = useState('');
    const [error, setError] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [errorMessagePass, setErrorMessagePass] = useState();
    const loggingStatus = localStorage.getItem('status');
    console.log(loggingStatus);
    const [status, setStatus] = useState(localStorage.getItem('status'));
    console.log('Email: ', typedEmail);
    console.log('Password: ', typedPass);
    const {loginURL} = require('../URL/apiURL')
    const {logoutURL} = require('../URL/apiURL')
    
    // Login Function
    const login = () => {
        return fetch(loginURL, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: typedEmail, password: typedPass }),
        })
            .then((res) => {
                if (res.status == 400) {
                    console.log('400');
                    if (!typedEmail) {
                        setErrorMessage("An email address is required");
                    }
                    if (!typedPass) {
                        setErrorMessagePass("Password is required");
                    }
                    console.log(res);
                }
                else if (res.status == 401) {
                    console.log('401');
                    setErrorMessagePass("Email or password is incorrect");
                    console.log(res);
                }
                else if (res.status == 429) {
                    console.log('429');
                    setErrorMessagePass("Too many requests. Please try again later");
                    console.log(res);
                }
                else {
                    localStorage.setItem("username", typedEmail);
                    return res.json();
                }
            })
            //.then((res) => res.json())
            .then((res) => new Promise((resolve, reject) => {
                localStorage.setItem("token", res.bearerToken.token);
                localStorage.setItem("refreshToken", res.refreshToken.token);
                localStorage.setItem("status", 'loggedIn');
                setStatus('loggedIn');
                console.log(res);
            }))

            .catch((error) => {
                console.log('Another error', error)
            });
    };

    const logout = () => {
        // User's refresh token
        const rtoken = localStorage.getItem("refreshToken")
        // Logging user out using POST method with user's refreshToken
        return fetch(logoutURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: rtoken }),
        })
            .then((res) => {
                if (res.status == 400) {
                    setError("Already Logged Out");
                    console.log(res);
                }
                else if (res.status == 401) {
                    setError("RefreshToken Not found");
                    console.log(res);
                }
                else {
                    console.log(res);
                    return res.json();
                }
            })
            .then((res) => new Promise((resolve, reject) => {
                // Clear all tokens in the browser storage
                localStorage.setItem("token", '');
                localStorage.setItem("refreshToken", '');
                localStorage.setItem("status", 'loggedOut');
                setStatus('loggedOut');
                setError();
                
            }))
            .catch((error) => {
                console.log('Another error', error)
            });
    };
    
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


    // If user is logged Out, then put on Log In Screen
    if (loggingStatus == 'loggedOut') {
        return (
            <div className='LoginMain'>
                <div>
                    <h1>Login</h1>
                    <div>
                        <label htmlFor="email" className="LoginForms">
                            <input
                                aria-labelledby="email-button"
                                name="email"
                                id="email"
                                type="email"
                                value={typedEmail}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    if (validEmail.test(value)) {
                                        setErrorMessage()
                                    }
                                    else if (!value) {
                                        setErrorMessage('An email address is required')
                                    }
                                    else {
                                        setErrorMessage("Not a valid email address")
                                    }
                                    setTypedEmail(e.target.value);
                                }}
                                placeholder="&nbsp;"
                            />

                            <span className="label">Email</span>
                            <span className="focus-bg"></span>
                        </label>
                        {
                            errorMessage != null ? <p className='ErrorMessage'>{errorMessage}</p> : null
                        }
                    </div>


                    <label htmlFor="password" className="LoginForms">
                        <input
                            aria-labelledby="password-button"
                            name="password"
                            id="password"
                            type="password"
                            value={typedPass}
                            onChange={(e) => setTypedPass(e.target.value)}
                            placeholder="&nbsp;"
                        />
                        <span className="label">Password</span>
                        <span className="focus-bg"></span>
                    </label>
                    {
                        errorMessagePass != null ? <p className='ErrorMessage'>{errorMessagePass}</p> : null
                    }
                </div>
                <button className="loginPageButton" onClick={login}>Login</button>
                <h1>{error}</h1>
            </div>
        )
    }
    // If user is logged In, then put on Log Out Screen
    else {
        return (
            <div className='LoginMain'>
                <h2 className='SuccessMessage'>Successfully Logged In As</h2>
                <h1>{localStorage.getItem('username')}</h1>
                <button className="loginPageButton" onClick={logout}>Logout</button>
                <h4>{error}</h4>
            </div>
        )
    }

}
