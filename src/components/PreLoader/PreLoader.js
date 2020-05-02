import React from 'react';

import './PreLoader.css';

const PreLoader = ({ show }) => {
  return (
    <div id="preLoader" style={show ? { "opacity": "1" } : { "opacity": "0", zIndex: "-1" }}>
      <div className="lds-ripple">
        <div className="lds-pos"></div>
        <div className="lds-pos"></div>
      </div>
    </div>
  );
}

export default PreLoader;