import { signInWithEmailAndPassword, signOut , sendPasswordResetEmail} from 'firebase/auth';
import React, { useState , useEffect} from 'react';
import { auth } from '../../utilities/firebase';
import "./SignIn.css";
import { getAuth} from 'firebase/auth'
import GoogleSignInButton from './GoogleSignInButton.jsx';
import { googleSignInUp } from './SignUp.jsx';
import logo from "../../Assets/logo2.svg"


function signIn(email, password) {
    
    document.getElementById('message').textContent = "    ";
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log('signed in as fuck girlie..');
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    document.getElementById('message').textContent = errorMessage;
  });
}

export function signOutCustom() {
    signOut(auth).then(() => {
        // signed out
        console.log("bye girl.");
    }).catch((error) => {
        // error
        console.log(error.message);
    });
}

 


function SignInUI(props) {
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [loginMessage, setLoginMessage] = useState('');
    const [showPasswordForgot, setShowPasswordForgot] = useState('')
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')


    const handleReset = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log("Password reset email sent successfully");
        } catch (error) {
            console.error("Error sending password reset email:", error.message);
        }
        setShowPasswordForgot(false)
    };
    useEffect(() => {
        const message = localStorage.getItem('loginMessage');
        if (message) {
            setLoginMessage(message);
            localStorage.removeItem('loginMessage'); // Clean up the message from storage
        }
    }, []);
    


    return(
        <div className='mainContainer'>

            <img className='logo' src={logo}></img>
            <p className='title' >Wildcat Spotlight</p>

            <div className='signInComponents'>

            <p className="signIn" style={{ marginTop: "25px" }}>Sign in</p>
                <input type="email" className="input" placeholder='abc@email.com' value={emailInput} onChange={(e)=> setEmailInput(e.target.value)} ></input>
                <input type="password" className="input" placeholder='Your password' value={passwordInput} onChange={(e)=> setPasswordInput(e.target.value)} ></input>

            </div>

            <p onClick={() => setShowPasswordForgot(true)} style={{fontSize: "13px"}}>Forgot Password?</p>
            <p id="message" className='errorMessage'> {loginMessage}</p>
            <button className="signInbutton" disabled={emailInput.trim()=="" || passwordInput.trim().length < 6} onClick={() => signIn(emailInput, passwordInput)}>SIGN IN</button>

            <p className='signIn' style={{color: "gray", fontSize:"18px"}}>OR</p>

            <button style={{border: "none", "backgroundColor":"transparent"}} onClick={() => googleSignInUp()}>
                    <GoogleSignInButton text="Sign in with Google"/>
            </button>

            <div className='noAccountSection'>
                <p className='noAccount'>Don't have an account?</p>
                <button className="signUpButton" onClick={() => {props.toggleVisibility(true); localStorage.removeItem('loginMessage')}}>Sign Up</button>
            </div>
            
            {showPasswordForgot && (
                    <div className="confirmation-modal">
                        <div className="confirmation-content">
                            <p>Enter your email to receive a password reset link</p>
                            <input type="email" className="input" placeholder='abc@email.com' value={forgotPasswordEmail} onChange={(e)=> setForgotPasswordEmail(e.target.value)} ></input>
                            <div className="confirmation-buttons">
                                <button className="cancel" onClick={() => setShowPasswordForgot(false)}>Cancel</button>
                                <button className="confirm" onClick={() => handleReset(forgotPasswordEmail)}>Send</button>
                            </div>
                        </div>
                    </div>
                )}

        </div>



    )
}



export default SignInUI
