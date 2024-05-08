import { InputAdornment, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { AppContext } from '../../AppContext';
import { categoryList } from '../EventUploadComponent/EventUpload';
import CategoryFilter from './CategoryFiltersComponent/CategoryFilters';
import "./searchBar.css";
const style = {
    position: 'absolute',
    top: '50vh',
    left: '50vw',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 5
};

const WholeSearch = ({ setData, initialData }) => {
    const [query, setQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const { appTheme } = useContext(AppContext);

    const handleSearch = (newQuery) => {
        let filteredData = initialData;
        if (newQuery !== '') {
            filteredData = filteredData.filter(user =>
                user.eventName.toLowerCase().includes(newQuery.toLowerCase())
            );
        }

        if (categories.length > 0) {
            const lowerCaseCategories = categories
                .filter(item => item.length > 0)
                .map(item => item[0].toLowerCase());
            filteredData = filteredData.filter(item =>
                item.eventType && lowerCaseCategories.includes(item.eventType.toLowerCase())
            );
        }

        setData(filteredData);
    };

    const onSelectingFilter = (category) => {
        const index = categories.findIndex(c => c[0] === category[0]);
        if (index > -1) {
            setCategories(categories.filter((_, i) => i !== index));
        } else {
            setCategories([...categories, category]);
        }
    };

    useEffect(() => {
        handleSearch(query);
    }, [query, categories]); // Trigger the filtering process whenever query or categories change

    return (

        <div className="nobkg" style={{ alignItems: 'center', justifyContent: 'space-between', backgroundColor: appTheme.themeColor }}>
            <div className="iconsContainer" style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: "left", margin: '8px', alignItems: 'center' }}>
                <TextField
                    sx={{ display: 'flex', width: '90%' }}
                    hiddenLabel
                    variant="standard"
                    id="filled-hidden-label-small"
                    placeholder='Search'
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" style={{ borderRight: `solid ${appTheme.tint} 2px`, height: '100%', paddingRight: '1%' }}>
                                <FaSearch style={{ marginRight: '2%', color: appTheme.tint }} />
                            </InputAdornment>
                        ),
                        disableUnderline: true,
                        style: { color: 'white' }
                    }}
                />
                <div className='categoryHolder'>
                    {categoryList.map((category, index) => (
                        <CategoryFilter
                            key={index}
                            favicon={category[1]}
                            categoryName={category[0]}
                            isSelected={categories.findIndex(c => c[0] === category[0]) > -1}
                            onSelect={() => onSelectingFilter(category)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WholeSearch;