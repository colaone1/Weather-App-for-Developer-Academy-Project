import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import './CityCard.css';

const CityCard = memo(({
  city,
  main,
  weather,
  wind,
  visibility,
  deleteCity,
  id,
}) => {
  const handleDelete = useCallback((e) => {
    e.stopPropagation(); // Prevent card flip when clicking delete
    deleteCity(id);
  }, [deleteCity, id]);

  const handleFlip = useCallback((e) => {
    const card = e.currentTarget;
    card.classList.toggle('flipped');
  }, []);

  return (
    <div className='card-container' onClick={handleFlip}>
      {/* card flip container */}
      <div className='flipped-container'>
        <div className='card-front'>
          <h2 className='city-name'>{city}</h2>
          <div className='weather-info'>
            <img 
              src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} 
              alt={weather[0].description} 
              className='weather-icon'
              loading="lazy"
            />
            <div className='temperature'>
              <span className='temp-value'>{Math.round(main.temp)}°C</span>
              <span className='feels-like'>Feels like: {Math.round(main.feels_like)}°C</span>
            </div>
          </div>
          <div className='weather-description'>
            {weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}
          </div>
        </div>
        <div className='card-back'>
          <div className='info-item-back'>
            <span className='info-label'>Pressure:</span>
            <span className='info-value'>{main.pressure} hPa</span>
          </div>
          <div className='info-item-back'>
            <span className='info-label'>Humidity:</span>
            <span className='info-value'>{main.humidity}%</span>
          </div>
          <div className='info-item-back'>
            <span className='info-label'>Wind Speed:</span>
            <span className='info-value'>{wind.speed} m/s</span>
          </div>
          <div className='info-item-back'>
            <span className='info-label'>Visibility:</span>
            <span className='info-value'>{visibility / 1000} km</span>
          </div>
          <button 
            className='btn-delete' 
            onClick={handleDelete}
            aria-label={`Delete ${city} weather card`}
          >
            <MdClose color='white' size={24} />
          </button>
        </div>
      </div>
    </div>
  );
});

CityCard.propTypes = {
  city: PropTypes.string.isRequired,
  main: PropTypes.shape({
    temp: PropTypes.number.isRequired,
    feels_like: PropTypes.number.isRequired,
    pressure: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
  }).isRequired,
  weather: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
  wind: PropTypes.shape({
    speed: PropTypes.number.isRequired,
  }).isRequired,
  visibility: PropTypes.number.isRequired,
  deleteCity: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default CityCard;
