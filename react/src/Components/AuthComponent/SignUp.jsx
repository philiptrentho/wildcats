import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, sendEmailVerification} from 'firebase/auth';
import React, { useState , useEffect} from 'react';
import { auth, uploadData, firestore} from '../../utilities/firebase';
import './SignIn.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import GoogleSignInButton from './GoogleSignInButton';
import { signOutCustom } from './SignIn';





export  async function googleSignInUp() {
  const provider = new GoogleAuthProvider();
  try {
    const result =  await signInWithPopup(auth, provider);
    const user = result.user;
    const userEmail = user.email.toString()

    console.log(userEmail)
    // Validate the email domain
    document.getElementById('message').textContent = userEmail

    if (!userEmail.endsWith("northwestern.edu")){
      console.log("wrong email");
      localStorage.setItem('loginMessage', "Access denied: Email must end with 'northwestern.edu'.");
      signOut(auth).then(() => {
        console.log("user signout")
      }).catch((error) => {
        console.error("Failed to sign out user:", error);
      });
      return
    }

    const userRef = doc(firestore, "users", user.uid); // Reference to Firestore document

    // Check if the user already exists in Firestore
    const docSnap =  await getDoc(userRef);
    if (!docSnap.exists()) {
      const userProfile = {
        userID: user.uid,
        fullName: user.displayName,
        email: user.email,
        profilePicture: "https://firebasestorage.googleapis.com/v0/b/wildcat-spotlight.appspot.com/o/eventImages%2FIMG_9710.jpeg?alt=media&token=223420e9-5fdb-464e-b6f6-72e997e94981",
        bio: "",
        orgStatus: false,
        favoriteEvents: [],
        attendingEvents: [],
        hostingEvents: [],
        following: [],
        followers: []
      };

      // Upload the user's profile to Firestore
      uploadData("users", user.uid, userProfile);
      document.getElementById('message').textContent = "    ";
    }

    console.log("Google Sign Up successful");
  } catch (error) {
    // Handle Errors here.
    console.log(error.message);
    document.getElementById('message').textContent = error.message;
     signOut(auth)
  }
}




function createAccount(fullName, email, password, props){
    console.log('hey cutie!!')
    createUserWithEmailAndPassword(auth, email, password, props)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Created yay")
      console.log(user)
      const userID = user.uid

      const userProfile = {
        "userID": userID,
        "fullName":  fullName,
        "email": email,
        "profilePicture": "https://firebasestorage.googleapis.com/v0/b/wildcat-spotlight.appspot.com/o/eventImages%2FIMG_9710.jpeg?alt=media&token=223420e9-5fdb-464e-b6f6-72e997e94981",
        "bio": "",
        "orgStatus": false,
        "favoriteEvents" : [],
        "attendingEvents" : [],
        "hostingEvents" : [],
        "following" : [],
        "followers" : []
      }

      uploadData("users", userID, userProfile)
      document.getElementById('message').textContent = "    ";
      //verifyEmail()
      props.toggleVisibility(false)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      document.getElementById('message').textContent = errorMessage;
    });
}

function checkParameters(name, email, password1, password2, props) {
  document.getElementById('message').textContent = "    ";
  if (!email.endsWith("northwestern.edu")){
    document.getElementById('message').textContent = "Email needs to end with northwestern.edu ";
  } else if (!email.includes('@')) { // Check if the email contains '@'
    document.getElementById('message').textContent = "Invalid Email";
  } else if (password1.length < 6) { // Check if the password is less than 6 characters long
    document.getElementById('message').textContent =  "Password too short";
  } else if (password1 !== password2) { // Check if the passwords do not match
    document.getElementById('message').textContent =  "Passwords do not match";
  } else {
    createAccount(name, email, password1, props); // Call a function to create the account
  }
}

export async function verifyEmail() {
  try {
      const user = auth.currentUser;

      if (user) {
          await sendEmailVerification(user);
          console.log("Verification email sent successfully");
          return "Verification email sent successfully"
      } else {
          console.error("No user signed in.");
          return "No user signed in"
      }
  } catch (error) {
      console.error("Error sending verification email:", error.message);
      return "Error sending verification email"
  }
};

function SignUpUI(props) {
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [passwordInputConfirm, setPasswordInputConfirm] = useState('')
    const [nameInput, setNameInput] = useState('')
    const [loginMessage, setLoginMessage] = useState('');

    
    useEffect(() => {
      const message = localStorage.getItem('loginMessage');
      if (message) {
          setLoginMessage(message);
          localStorage.removeItem('loginMessage'); // Clean up the message from storage
      }
  }, []);

   
    
      return(
          <div className='mainContainer'>
         
              <div className='signInComponents'>
              <FontAwesomeIcon onClick={() => props.toggleVisibility(false)} className="backArrow" icon="fa-solid fa-arrow-left"  />
                  <p className="signIn">Sign up</p>
                  <input className="input" placeholder='Full Name' value={nameInput} onChange={(e)=> setNameInput(e.target.value)} ></input>
                  <input type="email" className="input" placeholder='abc@email.com' value={emailInput} onChange={(e)=> setEmailInput(e.target.value)} ></input>
                  <input type="password" className="input" placeholder='Your password' value={passwordInput} onChange={(e)=> setPasswordInput(e.target.value)} ></input>
                  <input type="password" className="input" placeholder='Confirm password' value={passwordInputConfirm} onChange={(e)=> setPasswordInputConfirm(e.target.value)} ></input>
  
              </div>
              <p id="message" className='errorMessage'>{loginMessage}</p>
              <button className="signInbutton" disabled={emailInput.trim()=="" || passwordInput.length < 6 || passwordInputConfirm.length < 6 || nameInput.trim() ==""} onClick={() => checkParameters(nameInput, emailInput, passwordInput, passwordInputConfirm, props)}>SIGN UP</button>
  
              {/* google auth (not set up yet) */}
  
              {/* <div>
                  <p style={{color: "#9D9898", margin: "12px"}}>OR</p>
                  <button className="googleButton">Login with Google</button>
              </div> */}
              <p className='signIn' style={{color: "gray" ,fontSize:"18px"}}>OR</p>

              <button style={{border: "none", "backgroundColor":"transparent"}} onClick={() => googleSignInUp()}>
                    <GoogleSignInButton text="Sign up with Google"/>
            </button>

              <div className='noAccountSection'>
                  <p className='noAccount'>Already have an account?</p>
                  <button className="signUpButton" onClick={() => {props.toggleVisibility(false); localStorage.removeItem('loginMessage')}}>Sign In</button>
  
  
              </div>
  
          </div>
  
  
  
      )
}

export default SignUpUI
