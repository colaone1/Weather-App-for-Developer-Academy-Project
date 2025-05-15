import React from 'react';
import PropTypes from 'prop-types';
import './ErrorMessages.css';

const ErrorMessages = ({ otherError, duplicateCitiesError }) => {
  if (!otherError && !duplicateCitiesError) return null;

  return (
    <div className="error-messages" role="alert" aria-live="polite">
      {otherError && (
        <div className="error-message" data-testid="error-message">
          <p>City not found. Please check the spelling and try again.</p>
        </div>
      )}
      {duplicateCitiesError && (
        <div className="error-message" data-testid="duplicate-error-message">
          <p>This city is already in your list.</p>
        </div>
      )}
    </div>
  );
};

ErrorMessages.propTypes = {
  otherError: PropTypes.bool.isRequired,
  duplicateCitiesError: PropTypes.bool.isRequired,
};

export default ErrorMessages;
