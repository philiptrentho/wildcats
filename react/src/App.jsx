import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { AppContext } from './AppContext/index.jsx';
import SignInUI from './Components/AuthComponent/SignIn.jsx';
import SignUpUI from './Components/AuthComponent/SignUp.jsx';
import NavBar from './Components/NavigationComponent/nav-bar.jsx';
import { auth } from './utilities/firebase.js';
import VerifyEmail from './Components/AuthComponent/verifyEmail.jsx'
const App = () => {
  const { appTheme } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Add a loading state
  const [showSignUp, setShowSignUp] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false); 
    });

    return () => {
      unsubscribe(); 
    };
  }, []);

  useEffect(() => {
    let intervalId;
    if (user && !user.emailVerified) {
      intervalId = setInterval(() => {
        user.reload().then(() => {
          if (user.emailVerified) {
            setUser({...user}); // Update user state to trigger re-render
            clearInterval(intervalId); // Clear interval once verified
          }
        });
      }, 1500); // Check every 1.5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user]);
  
  if (loading) {
    return <div></div>;  // Display loading indicator while checking user status
  }

  return (
    <div className="App">
      {user ? (
        user.emailVerified ? (
        <>
          <div className="authenticated">
            <NavBar/>
          </div>
        </>
        ):
        (
          <>
          <VerifyEmail/>
          </>
        )
      ) : (
        <>
          <div className="not-authenticated">
          {showSignUp ? (
            <>
               <SignUpUI toggleVisibility={setShowSignUp}/>
            </>
          ) :(
            <SignInUI toggleVisibility={setShowSignUp}/>
       
          )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
