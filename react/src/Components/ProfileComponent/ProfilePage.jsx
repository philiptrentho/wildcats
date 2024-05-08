import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { VscOrganization } from "react-icons/vsc";
import { auth, firestore } from "../../utilities/firebase.js";
import './ProfilePage.css';
import { FaSignOutAlt } from "react-icons/fa";
import { AppContext } from '../../AppContext/index.jsx';
import { signOutCustom } from '../AuthComponent/SignIn.jsx';
import { IoEllipse } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import OrganizerUI from "../OrganizerComponent/OrganizerApplication.jsx";

// Note. name and userBio are states based on inputs. The name and user bio that
// are previewed are nameDisplay and descDisplay. They change in effect
// when forceRender state changes; the forceRender state changes 
// when the change desc/ name button is pressed.

const ProfilePage = ({ userId }) => {
  const { appTheme } = useContext(AppContext)
  const [name, setName] = useState('');
  const [nameDisplay, setNameDisplay] = useState('');
  const [descDisplay, setDescDisplay] = useState('');
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [pictureURL, setPictureURL] = useState('');
  // const userId = auth.currentUser.uid;
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [eventsData, setEventsData] = useState([]);
  const [eventsData2, setEventsData2] = useState([]);
  const [attendingIDs, setAttendingIDs] = useState([]);
  const [userBio, setUserBio] = useState('');
  const [displayedName, setDisplayedName] = useState('');
  const [buttonState, setButtonState] = useState(2);
  const [followerNumber, setFollowerNumber] = useState(0);
  const [followingNumber, setFollowingNumber] = useState(0);
  const [orgStat, setOrgStat] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const [bkNumber, setBkNumber] = useState(0);
  const [attendNumber, setAttendNumber] = useState(0);

  const [eventsData3, setEventsData3] = useState([]);
  const [hostNumber, setHostNumber] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [popupVisible2, setPopupVisible2] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const togglePopup2 = () => {
    setPopupVisible2(!popupVisible2);
  };
  const toggleForm = () => {
    setShowForm(!showForm);
  };


  const MAX_NAME_LENGTH = 20;
  const MAX_BIO_LENGTH = 100;
  // editOpen just allows us to force the state to change so we can render
  // default input values.
  const [editOpen, setEditOpen] = useState(false);
  useEffect(() => {
    console.log("first use");
    console.log(userId);
    // this use effect is for whenever the name or desc field is changed. State
    //forced render forces a rerendering only for name and desc
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);
        const applicationStatusRef = doc(firestore, 'orgApplications', userId)
        const applicationStatus = await getDoc(applicationStatusRef);
        if (applicationStatus.exists()) {
          setFormSent(true)
        } else {
          setFormSent(false)
        }

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const bio = userData.bio || '';
          const userName = userData.fullName || '';
          setNameDisplay(userName);
          setDescDisplay(bio);
          console.log("Test");
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }finally {
        setLoading(false); // Set loading to false when data fetching is done
    }
    };
    fetchUserData();
  }, [forceRender])

  useEffect(() => {
    // this use effect is for whenever the name or desc field is changed. State
    //forced render forces a rerendering only for name and desc
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);
        const applicationStatusRef = doc(firestore, 'orgApplications', userId)
        const applicationStatus = await getDoc(applicationStatusRef);
        if (applicationStatus.exists()) {
          setFormSent(true)
        } else {
          setFormSent(false)
        }

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const bio = userData.bio || '';
          const userName = userData.fullName || '';
          const picURL = userData.profilePicture || '';
          setName(userName);
          setUserBio(bio);
          setImagePreview(picURL);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }finally {
        setLoading(false); // Set loading to false when data fetching is done
    }
    };
    fetchUserData();
  }, [editOpen])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(firestore, 'users', userId);

        const userDocSnapshot = await getDoc(userDocRef);
        const applicationStatusRef = doc(firestore, 'orgApplications', userId)
        const applicationStatus = await getDoc(applicationStatusRef);
        if (applicationStatus.exists()) {
          setFormSent(true)
        } else {
          setFormSent(false)
        }
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const bookmarksArray = userData.favoriteEvents || [];
          const attendingArray = userData.attendingEvents || [];
          const hostArray = userData.hostingEvents || [];
          const picURL = userData.profilePicture || '';
          const bio = userData.bio || '';
          const userName = userData.fullName || '';
          const followerCount = userData.followers ? userData.followers.length : 0;
          const orgStatus = userData.orgStatus || false;
          const followingCount = userData.following ? userData.following.length : 0;
          const bCount = userData.favoriteEvents ? userData.favoriteEvents.length : 0;
          const aCount = userData.attendingEvents ? userData.attendingEvents.length : 0;
          const hCount = userData.hostingEvents ? userData.hostingEvents.length : 0;
          setBkNumber(bCount);
          setAttendNumber(aCount);
          setHostNumber(hCount);
          setUserBookmarks(bookmarksArray);
          setPictureURL(picURL);
          setAttendingIDs(attendingArray);
          setUserBio(bio);
          // setDisplayedName(userName);
          setFollowerNumber(followerCount);
          setFollowingNumber(followingCount);
          setOrgStat(orgStatus);
          setImagePreview(picURL);
          setNameDisplay(userName);
          setDescDisplay(bio);
          // setImagePreview(imagePreview);
          // Fetch events data for userBookmarks
          const events = await fetchEvents(bookmarksArray);
          const events2 = await fetchEvents(attendingArray);
          const events3 = await fetchEvents(hostArray);
          setEventsData(events);
          setEventsData2(events2);
          setEventsData3(events3);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }finally {
        setLoading(false); // Set loading to false when data fetching is done
    }
    };

    fetchUserData();
  }, []);
  const formatDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    return formattedDate;
  };
  const button1 = () => {
    setButtonState(1);
  }
  const button2 = () => {
    setButtonState(2);
  }
  const button3 = () => {
    setButtonState(3);
  }
  const fetchEvents = async (bookmarkArray) => {
    try {
      const eventsData = [];
      for (const eventId of bookmarkArray) {
        if (eventId) {
          const eventDocRef = doc(firestore, 'events', eventId);
          const eventDocSnapshot = await getDoc(eventDocRef);
          if (eventDocSnapshot.exists()) {
            const eventData = eventDocSnapshot.data();
            eventsData.push(eventData);
          } else {
            console.log(`Event with ID ${eventId} does not exist.`);
          }
        }
      }
      return eventsData;
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };




  const updateUserField = async (userId, fieldName, fieldValue) => {
    const userDocRef = doc(firestore, `users/${userId}`);

    try {
      await setDoc(userDocRef, {
        [fieldName]: fieldValue
      }, { merge: true });

      console.log(`Field '${fieldName}' of user with ID '${userId}' updated successfully.`);
    } catch (error) {
      console.error(`Error updating field '${fieldName}' of user with ID '${userId}':`, error);
    }
  };

  const handleKeyPress = async (event, val_case) => {
    if (event.key === 'Enter') {
      if (val_case == 1) {
        await updateUserField(userId, 'fullName', name);
        setName('');
      } else if (val_case == 2) {
        await updateUserField(userId, 'bio', userBio);
        setUserBio('');
      }
    }
  };
  const togglePopup = () => {
    setPopupVisible(!popupVisible);
    setEditOpen(!editOpen);
  };
  const handleButtonClick = async (val_case) => {
    if (val_case == 1) {
      await updateUserField(userId, 'fullName', name);
      setName('');
      setForceRender(!forceRender);
    } else if (val_case == 2) {
      await updateUserField(userId, 'bio', userBio);
      setUserBio('');
      setForceRender(!forceRender);
    }
  };

  const handleInputChange = (event, val_case) => {
    let newValue = event.target.value;
    // the code below allows for a max number of characters via slicing when
    // the threshold has been exceeded.
    if (val_case === 1 && newValue.length > MAX_NAME_LENGTH) {
      newValue = newValue.slice(0, MAX_NAME_LENGTH);
    } else if (val_case === 2 && newValue.length > MAX_BIO_LENGTH) {
      newValue = newValue.slice(0, MAX_BIO_LENGTH);
    }

    if (val_case === 1) {
      setName(newValue);
    } else if (val_case === 2) {
      setUserBio(newValue);
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, 'profilePictures/' + imageFile.name);

      try {
        const snapshot = await uploadBytes(storageRef, imageFile);
        console.log('Image uploaded successfully:', snapshot);

        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Download URL:', downloadURL);

        await updateUserField(userId, 'profilePicture', downloadURL);

        console.log('Profile picture URL saved to Firestore:', downloadURL);

        await setImagePreview(downloadURL);
        await setPictureURL(downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.error('No image selected.');
    }
    // setForceRender(!forceRender);
  };

  return (
    <>
      {showForm ? <OrganizerUI toggleForm={toggleForm} setFormSent={setFormSent} /> : null}
      {!showForm ? (
         loading ? (
          <div className="loading-wheel"></div>
        ) : (
        
        <div className="page-container">
          <div className="page-content">
            <div>
              {!popupVisible2 && (

                <button className="pop-up-button" onClick={togglePopup2} style={{ color: appTheme.themeColor }}>
                  <IoEllipse />
                  <IoEllipse />
                  <IoEllipse />
                </button>
              )}
              {popupVisible2 && (
                <div className="popup-hd">
                  
                  <button className="closeButton2" onClick={togglePopup2} style={{ color: appTheme.themeColor }}><IoMdCloseCircle /></button>
                  <div onClick={signOutCustom} style={{ color: appTheme.themeColor }}>
                    <FaSignOutAlt style={{ cursor: 'pointer' }} />
                  </div>
                  <button className="closeButton2" style={{ color: appTheme.themeColor }}  onClick={togglePopup}>
                    <FaEdit className="editIcon" />
                  </button>
                </div>
              )}

              {popupVisible && (
                <div className={`popupBackground ${popupVisible ? 'popupVisible' : ''}`}>
                  <div className="popupContent">
                    <button style={{ backgroundColor: appTheme.themeColor }} className="closeButton" onClick={togglePopup}>X</button>
                    <input
                      type="text"
                      placeholder="Change your name"
                      value={name}
                      onChange={(event) => handleInputChange(event, 1)}
                      onKeyPress={(event) => handleKeyPress(event, 1)}
                    />
                    <span className="char-count">Characters Left: {MAX_NAME_LENGTH - name.length} / {MAX_NAME_LENGTH}</span>
                    <button onClick={() => handleButtonClick(1)} style={{ backgroundColor: appTheme.themeColor }} className="changeName">Change Name</button>
                    <textarea
                      placeholder="Change your biography"
                      value={userBio}
                      onChange={(event) => handleInputChange(event, 2)}
                      onKeyPress={(event) => handleKeyPress(event, 2)}
                      className="bioInput"
                    />
                    <span className="char-count">Characters Left: {MAX_BIO_LENGTH - userBio.length} / {MAX_BIO_LENGTH}</span>
                    <button onClick={() => handleButtonClick(2)} style={{ backgroundColor: appTheme.themeColor }} className="changeDesc">Change Bio</button>
                    <div>

                      <img className="previewImage"
                        src={imagePreview}
                        alt="Selected Image"
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />

                      <label htmlFor="imageUploadInput" className="imageDivider">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                          id="imageUploadInput"
                        />
                        <div style={{ backgroundColor: appTheme.themeColor }} className="changeImage">
                          Change Image
                        </div>
                      </label>
                    </div>
                    <button style={{ backgroundColor: appTheme.themeColor }} className="changeImageButton" onClick={handleImageUpload}>Upload Image</button>
                  </div>
                </div>
              )}

            </div>
            <div className="circular-image-container" >
              <img
                src={pictureURL}
                alt="Selected Image"
                className="circular-image"
              />
            </div>

            <div className="profName">
              {nameDisplay}
            </div>
            <div className="orgStatus">
              {orgStat && (
                <div className="user-details">
                  <div>Organizer</div>
                  <div className="follow">
                    <div className="separator">
                      <div className="following">
                        &nbsp; {followingNumber}
                      </div>
                      <div className="following-label">
                        Following
                      </div>
                    </div>
                    <div className="divider">
                    </div>
                    <div className="separator2">
                      <div className="follower">
                        &nbsp; {followerNumber}
                      </div>
                      <div className="follower-label">
                        Followers
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {orgStat === false && (
                <div className="user-details">
                  <div style={{ fontSize: "14px" }}>
                    User
                  </div>
                  <div className="buttonContainer2">

                    <button className="followButton" onClick={toggleForm} disabled={formSent}>
                      <VscOrganization className="buttonIcon" />
                      {formSent ? "Application Sent" : "Apply to be an Organizer"}
                    </button>
                  </div>
                  <div className="follow">
                    <div className="following">
                      &nbsp; {followingNumber}
                    </div>
                    <div className="following-label">
                      following
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="user-bio">
              {descDisplay && descDisplay}
            </div>

            <div className="buttonContainer">
              <button onClick={button2} className={buttonState === 2 ? "blueUnderlineButton" : "whiteButton"}>Attending  ({attendNumber})</button>
              <button onClick={button3} className={buttonState === 3 ? "blueUnderlineButton" : "whiteButton"}>Bookmarked ({bkNumber})</button>
              {orgStat && (
                <button onClick={button1} className={buttonState === 1 ? "blueUnderlineButton" : "whiteButton"}>Hosting ({hostNumber})</button>
              )}
            </div>

            {/* Shows the differnet events  bookmarked */}
            {buttonState === 3 && (
              <div className="events-container">
                   {eventsData.length === 0 && 
                    <p>Bookmark events you are interested in!</p>
                  }

                <ul>
             
                  {eventsData.map((event, index) => (
                    <li key={index} className="event-item">
                      <div className="event-image">
                        <img src={event.eventPhoto} alt="Event Photo" />
                      </div>
                      <div className="event-details">
                        <div className="event-name">{event.eventName}</div>
                        <div style={{ color: appTheme.themeColor }} className="event-start">{formatDate(event.eventStart)}</div>
                        <div className="event-desc">{event.eventDesc}</div>
                        <div className="event-org">{event.orgName}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shows the differnet events attending */}
            {buttonState === 2 && (
              <div className="events-container">
                  {eventsData2.length === 0 && 
                    <p>Find events to attend on your feed or on the Map!</p>
                  }
                <ul>
                  {eventsData2.map((event, index) => (
                    <li key={index} className="event-item">
                      <div className="event-image">
                        <img src={event.eventPhoto} alt="Event Photo" />
                      </div>
                      <div className="event-details">
                        <div className="event-name">{event.eventName}</div>
                        <div className="event-start">{formatDate(event.eventStart)}</div>
                        <div className="event-desc">{event.eventDesc}</div>
                        <div className="event-org">{event.orgName}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {buttonState === 1 && (
              <div className="events-container">
                     {eventsData3.length === 0 && 
                    <p>Organize your first event by clicking the purple + button!</p>
                  }
                <ul>
                  {eventsData3.map((event, index) => (
                    <li key={index} className="event-item">
                      <div className="event-image">
                        <img src={event.eventPhoto} alt="Event Photo" />
                      </div>
                      <div className="event-details">
                        <div className="event-name">{event.eventName}</div>
                        <div className="event-start">{formatDate(event.eventStart)}</div>
                        <div className="event-desc">{event.eventDesc}</div>
                        <div className="event-org">{event.orgName}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )
      ) : null}
    </>
  );
};

export default ProfilePage;
