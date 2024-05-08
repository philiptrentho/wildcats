import React, { useState, useEffect } from 'react';
import './EventDisplay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { firestore } from '../../utilities/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, runTransaction } from "firebase/firestore";
import { getCurrentUserID } from '../../utilities/firebase';


function EventDisplay({ eventData, clicked, cardId, setCardId, setClicked  }) {
    const [eventInfo, setEventInfo] = useState({});
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [attending, setAttending] = useState(false);
    const [loading, setLoading] = useState(false); // State to handle loading status
    useEffect(() => {
        if (eventData) {
            console.log("Entered");
            setEventInfo(eventData);
            setAttendeeCount(eventData.attending || 0);
        }
    }, [eventData]);

    useEffect(() => {
        if (eventInfo.id) {
            console.log("Entered2");
            console.log(eventInfo.id);
            console.log(eventInfo.userID);
            setCardId(eventInfo.userID);
            const userId = getCurrentUserID();
            const userDocRef = doc(firestore, "users", userId);
            runTransaction(firestore, async (transaction) => {
                const userDoc = await transaction.get(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setAttending(userData.attendingEvents?.includes(eventInfo.id));
                }
            }).catch(err => console.error("Failed to fetch user data:", err));
        }
    }, [eventInfo.id]);
    const handleAttendClick = async () => {
        setLoading(true); // Set loading to true when the operation begins
        const userId = getCurrentUserID();
        const eventRef = doc(firestore, "events", eventData.id);
        const userRef = doc(firestore, "users", userId);

        try {
            await runTransaction(firestore, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                const userDoc = await transaction.get(userRef);

                if (eventDoc.exists() && userDoc.exists()) {
                    const newAttendeeCount = attending ? eventDoc.data().attending - 1 : eventDoc.data().attending + 1;
                    if (newAttendeeCount >= 0) {
                        transaction.update(eventRef, { attending: newAttendeeCount });
                    }

                    if (attending) {
                        transaction.update(userRef, { attendingEvents: arrayRemove(eventData.id) });
                    } else {
                        transaction.update(userRef, { attendingEvents: arrayUnion(eventData.id) });
                    }
                }
            });

            setAttending(!attending);

            setAttendeeCount(prev => attending ?  (prev - 1) : prev + 1);
        } catch (e) {
            console.error("Transaction failed: ", e);
        }
        setLoading(false); // Set loading to false once the operation is complete
    };
    const handleOrgClick = () => {
        console.log("Clicked");
        setCardId(eventInfo.userID);
        console.log(cardId);
        setClicked(5);
    }
    return (
        <div>
            <div className="event-actions">
                <div className='attending-div'>
                    <p className="attending-count">{attendeeCount}</p>
                    <p className="attending-text">Attending</p>
                    <button className={(attending ? "attending-button-yes" : "attending-button-no")} onClick={handleAttendClick} disabled={loading}>
                        {loading ? "Processing..." : (attending ? "✓ Attending" : "+ Attending")}
                    </button>

                </div>
            </div>
            <div className="event-info">
                <p className="event-desc">{eventInfo.eventDesc}</p>
                <p className="event-detail">Category: {eventInfo.eventType}</p>
                <p className="event-detail">Start: {new Date(eventInfo.eventStart).toLocaleString()}</p>
                <p className="event-detail">End: {new Date(eventInfo.eventEnd).toLocaleString()}</p>
                {eventInfo.maxCapacity && <p className="event-detail">Max Capacity: {eventInfo.eventCapacity}</p>}
            </div>
            {eventInfo.eventTicket !== "" && (
                <a href={eventInfo.eventTicket} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', width: '120px', height: "42.5px" }}>
                    <div className='tickets-div'>
                        <FontAwesomeIcon icon="fa-solid fa-ticket" />
                        <p style={{ margin: '0px' }}>Buy tickets</p>
                    </div>
                </a>
            )}
            <button className="event-org" onClick={handleOrgClick}>{eventInfo.orgName}</button>
        </div>
    );
}

export default EventDisplay;
