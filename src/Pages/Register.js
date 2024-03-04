import React from 'react';
import { useState } from 'react';

export default function Register() {
    const [innerEmail, setInnerEmail] = useState('');
    const [innerPass, setInnerPass] = useState('');
    const [innerPass2, setInnerPass2] = useState('');
    const [error, setError] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [errorMessagePass1, setErrorMessagePass1] = useState();
    const [errorMessagePass2, setErrorMessagePass2] = useState();
    const [errorMessagePass3, setErrorMessagePass3] = useState();
    const [errorMessagePass4, setErrorMessagePass4] = useState();
    const [errorMessagePass5, setErrorMessagePass5] = useState();
    const loggingStatus = localStorage.getItem('status')
    // console.log('Email: ', innerEmail);
    // console.log('Password: ', innerPass);
    // console.log('Password2: ', innerPass2);
    
    const {registerURL} = require('../URL/apiURL')
    const register = () => {
        
        if (innerPass2 != innerPass) { // If password and retyped password doesnt match
            setErrorMessagePass5("Password have to match")
        } else {
            setErrorMessagePass5()
        }
        if (!innerEmail) { // If email input's empty
            setErrorMessage('An email address is required')
        }
        if (!innerPass) { // If password input's empty
            setErrorMessagePass1('A password is required')
        }
        
        if (!errorMessage && 
            !errorMessagePass1 &&
            !errorMessagePass2 &&
            !errorMessagePass3 &&
            !errorMessagePass4 &&
            innerPass2 == innerPass) { // If there's no error messages, proceed with POST method
               return fetch(registerURL, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: innerEmail, password: innerPass }),
        })
            .then((res) => {
                console.log(res.status);
                if (res.status == 409) { // If user already existed
                    console.log('409'); 
                    setErrorMessagePass5("User already existed");
                    console.log(res);
                }
                else if (res.status == 400) { // If one of the inputs are missing
                    console.log('400');
                    setErrorMessagePass5("Request body incomplete, both email and password are required");
                    console.log(res);
                }
                else { // Otherwise user has created an account
                    console.log('User Created')
                    setErrorMessagePass5('Your accounted has created. Please log in using the details registered!')
                    return res.json();
                }
            })
            .then((res) => res.json())

            .catch((error) => {
                console.log('Another error', error)
            }); 
            } else {
                console.log("Cant register")
            }
        
    };

    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; // Regex to check email

    if (loggingStatus == 'loggedOut') {
        

        return (
            <div className='RegisterMain'>
                <div>
                    <h1 className='RegisterTitle'>Register</h1>
                    <label for="email" className="LoginForms">
                        <input
                            aria-labelledby="email-button"
                            name="email"
                            id="email"
                            type="email"
                            value={innerEmail}
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
                                setInnerEmail(e.target.value);
                            }}

                            placeholder="&nbsp;"
                        />
                        <span class="label">Email</span>
                        <span class="focus-bg"></span>
                    </label>
                    {
                        errorMessage != null ? <p className='ErrorMessageRegister'>{errorMessage}</p> : null
                    }
                    <label for="password" className="LoginForms">
                        <input
                            aria-labelledby="password-button"
                            name="password"
                            id="password"
                            type="password"
                            value={innerPass}
                            onChange={(e) => {
                                const { value } = e.target;
                                if (/[a-z]/g.test(value)) {
                                    setErrorMessagePass1()
                                } else {
                                    setErrorMessagePass1("Lowercase letters required")
                                }
                                if (/[A-Z]/g.test(value)) {
                                    setErrorMessagePass2()
                                } else {
                                    setErrorMessagePass2("Uppercase letters required")
                                }
                                if (/[0-9]/g.test(value)) {
                                    setErrorMessagePass3()
                                } else {
                                    setErrorMessagePass3("Numbers required")
                                }
                                if (value.length >= 8) {
                                    setErrorMessagePass4()
                                } else {
                                    setErrorMessagePass4("Minimum 8 characters")
                                }
                                if (!value) {
                                    setErrorMessagePass1("A password is required");
                                    setErrorMessagePass2();
                                    setErrorMessagePass3();
                                    setErrorMessagePass4()
                                }


                                setInnerPass(e.target.value);
                            }}

                            placeholder="&nbsp;"
                        />
                        <span class="label">Password</span>
                        <span class="focus-bg"></span>
                    </label>
                    <div className='ErrorRegisterPass'>
                        {errorMessagePass1 != null ? <p className='ErrorMessageRegister'>{errorMessagePass1}</p> : null}
                        {errorMessagePass2 != null ? <p className='ErrorMessageRegister'>{errorMessagePass2}</p> : null}
                        {errorMessagePass3 != null ? <p className='ErrorMessageRegister'>{errorMessagePass3}</p> : null}
                        {errorMessagePass4 != null ? <p className='ErrorMessageRegister'>{errorMessagePass4}</p> : null}
                    </div>
                    <label for="password2" className="LoginForms">
                        <input
                            aria-labelledby="password2-button"
                            name="password2"
                            id="password2"
                            type="password"
                            value={innerPass2}
                            onChange={(e) => {
                                setInnerPass2(e.target.value);
                                setErrorMessagePass5();
                            }}
                            placeholder="&nbsp;"
                        />
                        <span class="label">Retype Password</span>
                        <span class="focus-bg"></span>
                    </label>
                    
                    {errorMessagePass5 != null ? <p className='ErrorMessageRegister'>{errorMessagePass5}</p> : null}
                </div>
                <div>
                    <button className="loginPageButton" onClick={register}>Register</button>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='RegisterMain'>
                <h1>Please log out to register</h1>
            </div>
        )
    }


}