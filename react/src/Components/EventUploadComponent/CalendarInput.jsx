import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const CalendarInput = ({ value, onChange, onFocus, onBlur }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    const handleCalendarIconClick = () => {
        setShowCalendar(!showCalendar);
    };

const handleDateChange = (date) => {
    // Update the selectedDate state
    setSelectedDate(date);
    
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    // Call the onChange callback with the formatted date
    onChange(formattedDate);
};

const handleCloseCalendar = () => {
    // Close the calendar dropdown
    setShowCalendar(false);

    // Call onChange with the selectedDate
    onChange(selectedDate.toISOString());
};


    const handleClickOutside = (event) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) {
            setShowCalendar(false);
        }
    };
    const formatDate = (date) => {
        // Format the date according to the desired format
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);

        return formattedDate;
    };
    useEffect(() => {
        if (value) {
            const date = new Date(value);
            setSelectedDate(date);
        }
    }, [value]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <input
                type="text"
                value={selectedDate ? formatDate(selectedDate) : ''}
                placeholder="Select Date"
                readOnly // Prevent direct user input
                onClick={handleCalendarIconClick} // Open calendar dropdown when input is clicked
                onFocus={onFocus} // Pass the onFocus prop to the input
                onBlur={onBlur} // Pass the onBlur prop to the input
                onChange={onChange}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    border: 'solid #828282B2 1px',
                    height: '34px',
                    width: '260px',
                    position: 'relative',
                    padding: '8px',
                    fontSize: '14px' 
                }}
            />
            <FontAwesomeIcon icon={faCalendar} onClick={handleCalendarIconClick} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#5669FF', cursor: 'pointer' }} />
            {showCalendar && (
                <div style={{ position: 'absolute', zIndex: '999', top: '100%', left: '0' }} ref={calendarRef}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        showTimeInput
                        inline // Display the calendar dropdown inline
                    />
                </div>
            )}
        </div>
    );
};

export default CalendarInput;
