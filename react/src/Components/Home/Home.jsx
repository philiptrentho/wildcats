import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContext/index.jsx';
import { getAllEventsData } from '../../utilities/firebase.js';
import EventCard from '../EventCardComponent/EventCard.jsx';
import WholeSearch from '../SearchBarComponent/searchBar.jsx';
import './Home.css';

function Home({clicked, cardId, setCardId, IconLink, setClicked}) {

  const [filteredResults, setFilteredResults] = useState([]);
  const [initialData, setInitialData] = useState([])
  const { appTheme } = useContext(AppContext);
  const [loading, setLoading] = useState(true); // Loading state
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllEventsData();
      setInitialData(data)
      setFilteredResults(data);
      setLoading(false);
    };

    fetchData();

  }, []);

  return (
    <div>
      <WholeSearch initialData={initialData} setData={setFilteredResults} />
      {loading ? (
        <div className="loading-wheel"></div>
      ) : (
        <div className="card-container" style={{ paddingBottom: "70px" }}>
          {filteredResults && filteredResults.map(item => (
            <EventCard
              eventInfo={item}
              clicked={clicked}
              cardId={cardId}
              setCardId={setCardId}
              IconLink={IconLink}
              setClicked={setClicked}
              key={item.eventID}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
