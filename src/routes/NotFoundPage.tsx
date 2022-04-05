import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      <p style={{ textAlign: 'center' }}>
        <Link to="/">Go to Kanban Home </Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
