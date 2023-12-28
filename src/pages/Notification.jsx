// Notification.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../Notification.css'; // Import your CSS file for styling

const Notification = ({ notifications, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    console.log('Notification component mounted');
    return () => {
      console.log('Notification component unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('Notification component updated');
  }, [isOpen, notifications]);

  const closeNotification = () => {
    console.log('Closing notification');
    setIsOpen(false);
    onClose(); // Notify the parent component that the notification is closed
  };

  console.log('Rendering notification component');

  return (
    <div className={`notification-modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="notification-content">
        <div className="notification-header">
          <h3>Notifications</h3>
          <button onClick={closeNotification}>&times;</button>
        </div>
        <div className="notification-body">
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>{notification}</li>
              ))}
            </ul>
          ) : (
            <p>No notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

Notification.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notification;
