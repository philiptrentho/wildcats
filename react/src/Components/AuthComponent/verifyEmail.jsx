
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth, uploadData} from '../../utilities/firebase';
import { verifyEmail } from './SignUp';
import { signOutCustom } from './SignIn';
import './SignIn.css'
import logo from "../../Assets/logo2.svg"




const VerifyEmail = () =>{

    useEffect(()=>{
        console.log
        handleVerify()
    },[])
    
    const [resent, setResent] = useState('   ')
    const logo = "src/Assets/logo2.svg"

    async function handleVerify(){
        setResent("   ")
        const result = await verifyEmail()
        setResent(result)
    }
    return(
        <div className='mainContainer'>
            <img className='logo' src={logo} style={{"margin":"10px"}}></img>
            <p className='title' style={{"marginBottom":"30px"}}>Wildcat Spotlight</p>
            <p>Verify your email to continue</p>
            <button onClick={()=>handleVerify()} className='signInbutton' >Resend</button>
            <p style={{ height: "20px", color: resent === "Verification email sent successfully" ? "green" : "red", fontFamily: 'ABeeZee, sans-serif' }}>{resent}</p>
            <p style={{cursor:"pointer", color: "#8C53E5", textDecoration: "underline"}} onClick={()=>signOutCustom()} >Logout</p>
        </div>

    )

}

export default VerifyEmail