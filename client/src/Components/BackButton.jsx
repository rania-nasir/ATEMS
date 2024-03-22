import React from 'react';

const BackButton = ({ onClick }) => {
    return (
        <button onClick={onClick} className="btn-back">
            Back
        </button>
    );
};

export default BackButton;
