import React, { useContext, useEffect, useState } from 'react';
import { getDoc, getDocs, collection, doc } from 'firebase/firestore';
import { auth, firestore } from '../../utilities/firebase';
import './Notifications.css';
import { AppContext } from '../../AppContext/index.jsx';

const Notifications = () => {
    const { appTheme } = useContext(AppContext);
    const userId = auth.currentUser.uid;
    const [eventArray, setEventArray] = useState([]);
    const [followingArray, setFollowingArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const day = date.getDate();
        return `${month} ${day} ${year}`;
    };

    const fetchAllEvents = async () => {
        try {
            const eventsCollectionRef = collection(firestore, 'events');
            const querySnapshot = await getDocs(eventsCollectionRef);
            const events = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return events;
        } catch (error) {
            console.error('Error fetching events:', error);
            setError(error.message);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDocRef = doc(firestore, 'users', userId);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setFollowingArray(userData.following || []);
                } else {
                    console.log("No such document!");
                }

                const events = await fetchAllEvents();
                setEventArray(events);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId]); // Dependency added to rerun effect when userId changes

    const groupEventsByDay = (events) => {
        return events.reduce((acc, event) => {
            const day = event.timePosted.split('T')[0];
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(event);
            return acc;
        }, {});
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    const filteredEvents = eventArray.filter(event => followingArray.includes(event.userID));
    const groupedEvents = groupEventsByDay(filteredEvents);

    return (
        <div>
            <p className="Noti-title" style={{ color: appTheme.themeColor }}>
                Notifications
            </p>
            {isLoading ? (
                <div className="loading-wheel"></div>
            ) : (
                <div className="Noti-scroll">
                    {Object.keys(groupedEvents).length === 0 && (
                        <p>Follow more organizers to see their activity!</p>
                    )}
                    {Object.entries(groupedEvents).map(([day, events]) => (
                        <div key={day}>
                            <h3 className='Noti-date-title'>{formatDate(day)}</h3>
                            {events.sort((a, b) => new Date(a.eventStart) - new Date(b.eventStart)).map((event) => (
                                <div className="event-item" key={event.id}>
                                    <div className="event-image">
                                        <img src={event.eventPhoto} alt="Event Photo" />
                                    </div>
                                    <div className="event-details">
                                        <div className="event-name">{event.eventName}</div>
                                        <div className="event-start">{formatDate(event.eventStart)}</div>
                                        <div className="event-desc">{event.eventDesc}</div>
                                        <div className="event-org">{event.orgName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
