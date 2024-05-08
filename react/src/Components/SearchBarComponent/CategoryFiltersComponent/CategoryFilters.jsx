import React from 'react';
import './CategoryFilters.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CategoryFilter = ({ favicon, categoryName, isSelected, onSelect }) => {
  const buttonClass = isSelected ? 'button-selected' : 'button-not-selected';
  return (
    <div className="category-holder">
      <div className={`button-container ${buttonClass}`} onClick={onSelect}>
        <FontAwesomeIcon icon={favicon} className='icon-style' />
      </div>
      <span className="button-text">{categoryName}</span>
    </div>
  );
};

export default CategoryFilter;
