import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlinePicture } from "react-icons/ai";
import '../../AppContext/font.css';
import CategoryIcon from './CategoryIconComponent/CategoryIcon';
import './EventUpload.css';
export const categoryList = [["Theater", "fa-solid fa-masks-theater"],
["Music", "fa-solid fa-music"],
["Conference", "fa-solid fa-briefcase"],
["Poetry", "fa-solid fa-book"],
["Comedy", "fa-solid fa-microphone"],
["Cinema", "fa-solid fa-film"], ["Sports", "fa-solid fa-basketball"],
["Art", "fa-solid fa-brush"],
["Food", "fa-solid fa-cookie-bite"]
]

import { AiOutlineClose } from "react-icons/ai";
import { AppContext } from '../../AppContext';
import { addEventToOrganizer, auth, getUserInfo, writeEventData } from "../../utilities/firebase";
import CalendarInput from './CalendarInput';
import LocationInput from './LocationInput';
// import { firestore } from '../../utilities/firebase';

const EventUpload = ({ onCancelButtonClick, onPostButtonClick, updateEventData }) => {
    const { appTheme } = useContext(AppContext);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(formatDefaultStartDate());
    const [endDate, setEndDate] = useState(formatDefaultStartDate());
    const [maxCap, setMaxCap] = useState('');
    const [ticketLink, setTicketlink] = useState('');
    const [imageFile, setImageFile] = useState();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [duration, setDuration] = useState(2)
    const [durationUnit, setDurationUnit] = useState('hour')
    const [isSelectedLocation, setIsSelectedLocation] = useState(false);
    const [isSelectedDate, setIsSelectedDate] = useState(false);
    const [isSelectedEndDate, setIsSelectedEndDate] = useState(false);
    const [orgName, setOrgName] = useState('')
    const [imagePreview, setImagePreview] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userID, setUserID] = useState('')
    const MAX_NAME_LENGTH = 30;
    const MAX_DESC_LENGTH = 250;

    
    function formatDefaultStartDate() {
        const now = new Date();
        // Set time to 12:00 PM
        // Format date and time in YYYY-MM-DDTHH:MM format
        const year = now.getFullYear();
        const month = `${now.getMonth() + 1}`.padStart(2, '0'); // Month is 0-indexed
        const day = `${now.getDate()}`.padStart(2, '0');
        const hour = `${now.getHours()}`.padStart(2, '0');
        const minute = `${now.getMinutes()}`.padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minute}`;
    };

    function clearField() {
        setName("")
        setLocation("")

        setDescription("")
        setMaxCap(0)
        setTicketlink("")
        setImageFile("")
        setSelectedCategory("")
        setDuration(2)
        setDurationUnit("hour")
        setDescription('')
    }

    function makeJSONFirebase() {
        const uniqueEventID = Date.now() + Math.floor(Math.random() * 1000);
        const json = {
            "eventID": uniqueEventID,
            "eventName": name,
            "eventLoc": location,
            "eventDesc": description,
            "eventStart": startDate,
            "eventEnd": endDate,
            "userID": userID,
            "orgName": orgName,
            "eventPhoto": "https://upload.wikimedia.org/wikipedia/commons/d/dd/Teatersport_-4.jpg",
            "eventType": selectedCategory,
            "eventDuration": `${duration} ${durationUnit}`,
            "eventCapacity": maxCap,
            "attending": 0,
            "eventTicket": ticketLink,
            "longitude": longitude,
            "latitude": latitude,
            "timePosted": formatDefaultStartDate()
        };

        return json;
    }
    
    const handlePostEvent = async () => {
        console.log(auth.currentUser.uid);

        setShowConfirmation(true);
    };

    const handlePostCancel = async () => {
        onCancelButtonClick();
    }

    const handleConfirmation = async (confirmed) => {
        if (confirmed) {
            // First do validation
            const data = makeJSONFirebase()
            // Write event data to Firebase
            console.log(data)
            await writeEventData(data, imageFile);
            await addEventToOrganizer(data["orgID"], data["eventID"])
            // Clear input fields
            clearField();
            // Trigger post button click event
            onPostButtonClick();
            // Update event data in the Home component
            updateEventData();
        }
        // Hide confirmation dialog
        setShowConfirmation(false);
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImageFile(file);

            // Read the image file and set the background image URL for preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleNameChange = (value) => {
        if (value.length > MAX_NAME_LENGTH) {
            value = value.slice(0, MAX_NAME_LENGTH);
        }
        setName(value);
    }
    const handleDescriptionChange = (value) => {
        if (value.length > MAX_DESC_LENGTH) {
            value = value.slice(0, MAX_DESC_LENGTH);
        }
        setDescription(value);
    }


    const selectLocation = () => {
        setIsSelectedLocation(true);
    };

    const deSelectLocation = () => {
        setIsSelectedLocation(false);
    };

    const toggleSelectionDate = () => {
        setIsSelectedDate(!isSelectedDate);

    };
    const toggleEndSelectionDate = () => {
        setIsSelectedDate(!isSelectedEndDate);

    };

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
    };

    const handleLocationSelect = (location, lat, lng) => {
        setLocation(location);
        setLatitude(lat);
        setLongitude(lng);
        console.log(lat, lng, location)
    };

    async function getPosterData() {
        const userData = await getUserInfo()
        const name = userData.fullName
        const userID = userData.userID
        setOrgName(name)
        setUserID(userID)
        console.log(name, userID)
    }
    useEffect(() => {
        getPosterData();
    }, []);

    return (
        <div className='main-container'>
            <p className='page-title'>Create An Event</p>
            <p style={{ textAlign: 'left', marginLeft: 10 }}>Category <span style={{ "color": "red" }}>*</span></p>
            <div className='category-scroller'>
                {categoryList.map((category, index) => (
                    <CategoryIcon
                        key={index}
                        favicon={category[1]}
                        categoryName={category[0]}
                        isSelected={selectedCategory === category[0]}
                        onSelect={() => handleCategorySelect(category[0])}
                    />
                ))}
            </div>
            <div className='event-details'>
                <div className='field-combo'>
                    <p>Title <span style={{ "color": "red" }}>*</span></p>
                    <input placeholder="Enter Event Title" className="title-input" value={name}
                        onChange={(e) => { handleNameChange(e.target.value) }} />
                    <span className="char-count">Characters Left: {MAX_NAME_LENGTH - name.length} / {MAX_NAME_LENGTH}</span>
                </div>
                {/* <div className='h-stack'> */}
                <div className='field-combo'>
                    <p>Start Time&Date <span style={{ "color": "red" }}>*</span></p>
                    {/* <div className={`date-input ${isSelectedDate ? 'focus' : ''}`} style={{ cursor: 'pointer' }}> */}
                    {/* Render CalendarInput component */}
                    <CalendarInput
                        value={startDate} // Pass startDate as value
                        // onChange={setStartDate} // Pass setStartDate as onChange handler
                        onFocus={toggleSelectionDate}
                        onBlur={toggleSelectionDate}

                        onChange={(date) => { setStartDate(date) }}
                    />
                    {/* </div> */}
                </div>
                <div className='field-combo'>
                    <p>End Time&Date <span style={{ "color": "red" }}>*</span></p>
                    {/* <div className={`date-input ${isSelectedDate ? 'focus' : ''}`} style={{ cursor: 'pointer' }}> */}

                    {/* Render CalendarInput component */}
                    <CalendarInput
                        value={endDate} // Pass startDate as value
                        // onChange={setEndDate} // Pass setStartDate as onChange handler
                        onFocus={toggleEndSelectionDate}
                        onBlur={toggleEndSelectionDate}

                        onChange={(date) => { setEndDate(date) }}
                    />
                    {/* </div> */}

                </div>
                {/* </div> */}

                <div className='field-combo'>
                    <p>Location <span style={{ "color": "red" }}>*</span></p>
                    <div className={`location-input ${isSelectedLocation ? 'focus' : ''}`}>
                        <FontAwesomeIcon icon={faLocationDot} style={{ color: "#5669FF", paddingLeft: '2px', height: '18px' }} />
                        <LocationInput
                            location={location}
                            onSelect={(selectedLocation, lat, lng) => {
                                handleLocationSelect(selectedLocation, lat, lng)
                            }}
                        />

                    </div>

                </div>

                <p>Extras</p>
                <div className='extras-stack'>
                    <div className='field-combo'>
                        <div className='imageSelector'>
                            <label className="custom-file-upload">
                                <input
                                    type="file"
                                    id="imagePicker"
                                    name="imagePicker"
                                    accept="image/*" // This restricts the file input to accept only images.
                                    onChange={(e) => handleImageChange(e)}
                                />
                                <span className="button-icon">
                                    <AiOutlinePicture className="PictureIcon" />
                                    <div style={{ color: 'grey', fontStyle: 'normal' }}>
                                        Image
                                    </div>
                                </span>
                                {imagePreview && (
                                    <div className="image-preview" style={{ backgroundImage: `url(${imagePreview})` }}>
                                        {/* Optional: Add a button to remove the image preview */}
                                        <button className="remove-image-button" onClick={() => setImagePreview('')}>
                                            <AiOutlineClose className="inPreview" />
                                        </button>
                                    </div>
                                )}
                                {/* <span className="button-icon">Image</span> */}
                            </label>

                        </div>
                    </div>
                    <div className='field-combo'>
                        {/* <p>Ticket Link</p> */}
                        <input placeholder="Ticket Link" className="ticket-input" value={ticketLink}
                            onChange={(e) => setTicketlink(e.target.value)} />
                    </div>


                    <div className='field-combo'>
                        {/* <p>Max Capacity</p> */}
                        <input placeholder="Max Cap." className="capacity-input" value={maxCap}
                            onChange={(e) => setMaxCap(e.target.value)} />
                    </div>
                </div>
                <div className='field-combo'>
                    <p> Event Description <span style={{ "color": "red" }}>*</span></p>
                    <form action="/submit-event-description" method="post">
                        <textarea value={description} // Set the value to the state
                            onChange={(e) => { handleDescriptionChange(e.target.value) }}

                            className="descriptionBox" id="eventDescription" name="eventDescription" rows="10" cols="50" placeholder="Write a detailed description of the event..."></textarea><br />
                    </form>
                </div>
                <div className='h-stack'>
                    <button className='cancel-button' onClick={handlePostCancel}> CANCEL </button>
                    <button
                        className={(startDate !== "" && endDate !== "" && selectedCategory !== "" && description.trim() !== "" && location.trim() !== "" && name.trim() !== "") ? "post-button" : "post-button-disabled"}
                        disabled={!(startDate !== "" && endDate !== "" && selectedCategory !== "" && description.trim() !== "" && location.trim() !== "" && name.trim() !== "")}
                        onClick={handlePostEvent}
                    >
                        POST
                    </button>

                </div>
                {showConfirmation && (
                    <div className="confirmation-modal">
                        <div className="confirmation-content">
                            <p>Are you sure you want to post this event?</p>
                            <div className="confirmation-buttons">
                                <button className="cancel" onClick={() => handleConfirmation(false)}>Cancel</button>
                                <button className="confirm" onClick={() => handleConfirmation(true)}>Confirm</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default EventUpload;