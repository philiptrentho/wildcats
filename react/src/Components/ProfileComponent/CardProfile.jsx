import { updateDoc, doc, getDoc, setDoc, arrayUnion, arrayRemove  } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { VscOrganization } from "react-icons/vsc";
import { auth, firestore } from "../../utilities/firebase";
import './ProfilePage.css';

import { AppContext } from '../../AppContext/index.jsx';

import OrganizerUI from "../OrganizerComponent/OrganizerApplication";

// Note. name and userBio are states based on inputs. The name and user bio that
// are previewed are nameDisplay and descDisplay. They change in effect
// when forceRender state changes; the forceRender state changes 
// when the change desc/ name button is pressed.

const CardProfile = ({ userId }) => {
    const { appTheme } = useContext(AppContext)
    const [name, setName] = useState('');
    const [nameDisplay, setNameDisplay] = useState('');
    const [descDisplay, setDescDisplay] = useState('');
    const [userBookmarks, setUserBookmarks] = useState([]);
    const [pictureURL, setPictureURL] = useState('');
    const yourUserId = auth.currentUser.uid;
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [eventsData, setEventsData] = useState([]);
    const [eventsData2, setEventsData2] = useState([]);
    const [attendingIDs, setAttendingIDs] = useState([]);
    const [userBio, setUserBio] = useState('');
    const [displayedName, setDisplayedName] = useState('');
    const [buttonState, setButtonState] = useState(1);
    const [followerNumber, setFollowerNumber] = useState(0);
    const [followingNumber, setFollowingNumber] = useState(0);
    const [orgStat, setOrgStat] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [forceRender, setForceRender] = useState(false);
    const [bkNumber, setBkNumber] = useState(0);
    const [attendNumber, setAttendNumber] = useState(0);

    const [eventsData3, setEventsData3] = useState([]);
    const [hostNumber, setHostNumber] = useState(0);
    const [follArray, setFollArray] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formSent, setFormSent] = useState(false);
    const [isFollow, setIsFollow] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state
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
                    const followingCount = userData.following ? userData.following.length : 0;
                    const followerCount = userData.followers ? userData.followers.length : 0;
                    const followersArray = userData.followers || [];
                    setFollArray(followersArray);
                    setNameDisplay(userName);
                    setDescDisplay(bio);
                    setFollowerNumber(followerCount);
                    setFollowingNumber(followingCount);
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
                    const followersArray = userData.followers || [];
                    setFollArray(followersArray);
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
    const removeFollower = async (userId, followerId) => {
        const userRef = doc(firestore, "users", userId);
        const followerRef = doc(firestore, "users", followerId);
    
        try {
            await updateDoc(userRef, {
                following: arrayRemove(followerId)
            });
            await updateDoc(followerRef, {
                followers: arrayRemove(userId)
            });
            setFollowerNumber(prev => prev - 1);
            setFollArray(prevArray => prevArray.filter(id => id !== userId));
        } catch (error) {
            console.error("Error removing follower: ", error);
        }
        setForceRender(!forceRender);
    };
    
    const addFollower = async (userId, followerId) => {
        const userRef = doc(firestore, "users", userId);
        const followerRef = doc(firestore, "users", followerId);
    
        try {
            await updateDoc(userRef, {
                following: arrayUnion(followerId)
            });
            await updateDoc(followerRef, {
                followers: arrayUnion(userId)
            });
            setFollowerNumber(prev => prev + 1);
            setFollArray(prevArray => [...prevArray, userId]);
        } catch (error) {
            console.error("Error adding follower: ", error);
        }
        setForceRender(!forceRender);
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
                            <div>
                                {!follArray.includes(yourUserId) ? (
                                    <button className="followButton" onClick={() => addFollower(yourUserId, userId)}>
                                        Follow
                                    </button>
                                ) : (
                                    <button className="followButton" onClick={() => removeFollower(yourUserId, userId)}>
                                        Unfollow
                                    </button>
                                )}
                            </div>

                        </div>

                        <div className="user-bio">
                            {descDisplay && descDisplay}
                        </div>

                        <div className="buttonContainer">
                            
                            {orgStat && (
                                <button onClick={button1} className={buttonState === 1 ? "blueUnderlineButton" : "whiteButton"}>Hosting ({hostNumber})</button>
                            )}
                        </div>

                        {buttonState === 1 && (
                            <div className="events-container">
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

export default CardProfile;
