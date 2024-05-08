import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaSignOutAlt } from "react-icons/fa";
import { MdOutlineExplore, MdOutlineMap } from 'react-icons/md';
import { AppContext } from '../../AppContext/index.jsx';
import { signOutCustom } from '../AuthComponent/SignIn.jsx';
import EventUpload from '../EventUploadComponent/EventUpload.jsx';
import Home from '../Home/Home.jsx';
import ProfilePage from '../ProfileComponent/ProfilePage.jsx';
import CardProfile from '../ProfileComponent/CardProfile.jsx';
import Map from './Map.jsx';
import useIconLinks from './icons.jsx';
import Notifications from './Notifications.jsx'
import './navBar.css';
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { auth, getCurrentUserID, firestore, getUserInfo } from '../../utilities/firebase.js'
import { doc, getDoc, setDoc } from "firebase/firestore";
const NavBar = () => {
  // const wholeSearchComponent = <WholeSearch />; 
  const {cardId, setCardId, clicked, setClicked, IconExplore, IconProfile, IconUpload, IconMap, IconNotif, IconOtherProfile } = useIconLinks(); 
  
  const [] = useState('');
  const { appTheme } = useContext(AppContext)
  const [refresh, setRefresh] = useState(false);
  const [orgStatus, setOrgStatus] = useState(false);
  const authUserId = auth.currentUser.uid;


  async function checkApplicationStatus() {
    const userData = await getUserInfo()
    const status = userData.orgStatus
    setOrgStatus(status)

  }

  useEffect(() => {
    checkApplicationStatus()
  })

  useEffect(() => {
    if (clicked === 4 && !orgStatus) {
      alert("You need to be an organization to post events. Apply now in the profile tab!");
      setClicked(0);
    }
  }, [clicked, orgStatus]);


  // Function to update event data in Home component
  const updateEventData = () => {
    setRefresh(prevState => !prevState); // Toggle refresh state to force re-render
  };
  const handlePostButtonClick = () => {
    // Update the state in NavBar component when the post button is clicked
    setClicked(0);
    // window.location.reload();
  };
  
   const handleCancelButtonClick = () => {
    setClicked(0);
  }

 

  return (
    <div>
      <div className={clicked === 9 ? "nav-bar-hidden" : "bottom-nav-bar"} style={{ zIndex: 99 }}>
        <div className="nav-icon" onClick={IconExplore}>
          <MdOutlineExplore style={{ cursor: 'pointer' }} />
          <div className="navFont">
            Explore
          </div>
        </div>
        <div className="nav-icon" onClick={IconNotif}>
          <IoNotificationsCircleOutline style={{ cursor: 'pointer' }} />
          <div className="navFont">
            Notifications
          </div>
        </div>
        

        <div className="nav-icon special-icon" onClick={IconUpload} style={{ width: "40px", position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}>

          <div className="icon-with-shape">
            <FontAwesomeIcon icon="fa-solid fa-circle-plus" className={orgStatus ? "addButton" : "addButtonDisabled"} />
            <div className="white-shape"></div> {/* This is the white shape */}
          </div>
        </div>

        <div className="nav-icon" onClick={IconMap}>
          <MdOutlineMap style={{ cursor: 'pointer' }} />
          <div className="navFont">
            Map
          </div>
        </div>
        <div className="nav-icon" onClick={IconProfile}>
          <CgProfile style={{ cursor: 'pointer' }} />
          <div className="navFont">
            Profile
          </div>
        </div>
        {/* <div className="nav-icon" onClick={signOutCustom} style={{color: appTheme.themeColor}}>

          <FaSignOutAlt style={{ cursor: 'pointer' }} />
          <div className="navFont">
            Sign Out
          </div>
        </div> */}
      </div>
      <div className="webbody">
        {clicked == 0 && (
          <Home
            clicked={clicked}
            cardId={cardId}
            setCardId={setCardId}
            setClicked={setClicked}
          />
        )}
        {clicked == 1 && (
          <ProfilePage userId={authUserId} />
        )}
        {clicked == 2 && (
           <EventUpload onPostButtonClick={handlePostButtonClick} onCancelButtonClick={handleCancelButtonClick} updateEventData={updateEventData} />
        )}
        {clicked == 3 && (
          <Map />
        )}
        {clicked === 4 && (
            <Notifications />
        )}
        {clicked === 5 && (
          <CardProfile userId={cardId} />
        )}



      </div>
    </div>
  );



}
export default NavBar;