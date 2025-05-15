import React from 'react';
import PropTypes from 'prop-types';
import './ErrorMessages.css';

const ErrorMessages = ({ otherError, duplicateCitiesError, networkError, geolocationError }) => {
  if (!otherError && !duplicateCitiesError && !networkError && !geolocationError) return null;

  return (
    <div className="error-messages" role="alert" aria-live="polite">
      {networkError && (
        <div className="error-message error-network" data-testid="network-error-message">
          <p>Network error. Please check your internet connection and try again.</p>
        </div>
      )}
      {otherError && (
        <div className="error-message error-not-found" data-testid="error-message">
          <p>City not found. Please check the spelling and try again.</p>
        </div>
      )}
      {duplicateCitiesError && (
        <div className="error-message error-duplicate" data-testid="duplicate-error-message">
          <p>This city is already in your list.</p>
        </div>
      )}
      {geolocationError && (
        <div className="error-message error-geolocation" data-testid="geolocation-error-message">
          <p>Unable to get your location. Please check your browser settings and try again.</p>
        </div>
      )}
    </div>
  );
};

ErrorMessages.propTypes = {
  otherError: PropTypes.bool.isRequired,
  duplicateCitiesError: PropTypes.bool.isRequired,
  networkError: PropTypes.bool,
  geolocationError: PropTypes.bool
};

ErrorMessages.defaultProps = {
  networkError: false,
  geolocationError: false
};

export default ErrorMessages;
