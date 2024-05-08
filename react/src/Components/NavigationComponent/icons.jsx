import React, { useState } from 'react';
// import WholeSearch from './searchBar.jsx';
const useIconLinks = () => {
    // const clearSearch = WholeSearch();
    const [clicked, setClicked] = useState(0);
    const [cardId, setCardId] = useState('');
    const IconExplore = () => {
        setClicked(0);
        // clearSearch();
    };

    const IconProfile = () => {
        setClicked(1);
        // clearSearch();
    };
    const IconUpload = () => {
        setClicked(2);
        // clearSearch();
    };
    const IconMap = () => {
        setClicked(3);
        // clearSearch();
    };

    const IconNotif = () =>{
        setClicked(4);
    }
    const IconOtherProfile = () =>{
        setClicked(5);
    }
    return { cardId, setCardId, clicked, setClicked, IconExplore, IconProfile, IconUpload, IconMap, IconNotif, IconOtherProfile };
};

export default useIconLinks;

