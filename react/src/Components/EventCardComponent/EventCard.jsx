import { faBookmark as farFaBookmark } from '@fortawesome/free-regular-svg-icons'; // regular (outline) bookmark
import { faLocationDot, faBookmark as fasFaBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { arrayRemove, arrayUnion, doc, runTransaction } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { firestore, getCurrentUserID } from '../../utilities/firebase';
import EventDisplay from '../EventDetailComponent/EventDisplay';
import './EventCard.css';

function EventCard({ eventInfo, clicked, cardId, setCardId, setClicked }) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showComponent, setShowComponent] = useState(false);

    const [loading, setLoading] = useState(false); // State to handle loading status
    useEffect(() => {
        console.log("Initinal fetch")
        const userId = getCurrentUserID();
        const userDocRef = doc(firestore, "users", userId);
        runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setIsBookmarked(userData.favoriteEvents?.includes(eventInfo.id));
                console.log(isBookmarked)
            }
        }).catch(err => console.error("Failed to fetch user data:", err));
    }, [eventInfo.id]);

    const handleBookmarkClick = async () => {
        console.log("Changing bookmark")
        setIsBookmarked(!isBookmarked);
        setLoading(true);
        const userId = getCurrentUserID();
        const userRef = doc(firestore, "users", userId);

        try {
            await runTransaction(firestore, async (transaction) => {
                const userDoc = await transaction.get(userRef);

                if (userDoc.exists()) {
                    if (isBookmarked) {
                        transaction.update(userRef, { favoriteEvents: arrayRemove(eventInfo.id) });
                    } else {
                        transaction.update(userRef, { favoriteEvents: arrayUnion(eventInfo.id) });
                    }
                }
            });


        } catch (e) {
            console.error("Transaction failed: ", e);
        }
        setLoading(false); // Set loading to false once the operation is complete
        console.log(isBookmarked)
    };

    const toggleBookmark = (event) => {
        console.log("clicked bookmark")
        // Prevent the event from propagating to the parent div
        event.stopPropagation();

        handleBookmarkClick()
    }


    const formatDate = (date) => {
        const newDate = new Date(date);
        const day = ('0' + newDate.getDate()).slice(-2);
        const month = newDate.toLocaleString('en-us', { month: 'short' }).toUpperCase();
        return `${day} ${month}`;
    };

    const toggleShowComponent = () => {
        setShowComponent(prev => !prev);
    };

    const maxLength = 30; // Set the maximum character limit
    let eventLoc = eventInfo.eventLoc;

    if (eventLoc.length > maxLength) {
        eventLoc = eventLoc.substring(0, maxLength) + '...'; // Truncate and add ellipses
    }

    return (
        <div className="event-card">
            <div className="event-photo" style={{ backgroundImage: `url(${eventInfo.eventPhoto})` }} onClick={toggleShowComponent}>
                <div className="event-date">
                    <span>{formatDate(eventInfo.eventStart).split(' ')[0]}</span>
                    <span>{formatDate(eventInfo.eventStart).split(' ')[1]}</span>
                </div>
                <button className="bookmark-button" onClick={toggleBookmark}>
                    <FontAwesomeIcon
                        icon={isBookmarked ? fasFaBookmark : farFaBookmark}
                        style={{ color: "#4a43ec", width: 15 }}
                    />
                </button>
            </div>
            <div className="event-info" onClick={toggleShowComponent}>
                <h2 className="event-name">{eventInfo.eventName}</h2>
                <div className="event-location" style={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faLocationDot} style={{ color: 'LightGray' }} />
                    <span style={{ marginLeft: '8px', color: "gray" }}>{eventLoc}</span>
                </div>
            </div>
            {showComponent && <div className={`additional-component ${showComponent ? 'visible' : ''}`}>
                <EventDisplay eventData={eventInfo}
                    clicked={clicked}
                    cardId={cardId}
                    setCardId={setCardId}
                    setClicked={setClicked} />
            </div>}
        </div>
    );
}

export default EventCard;
