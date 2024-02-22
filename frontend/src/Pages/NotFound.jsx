

import React from 'react'
import { Link } from 'react-router-dom';
  
 function NotFound() {
    return (
        <div>
          <h1>Sayfa bulunamadı</h1>
          <Link to="/">Ana sayfaya dön</Link>
        </div>
      );
  }
  
  export default NotFound