import React from 'react'
import { Link } from 'react-router-dom'
import NotificationCell from './NotificationCell.jsx'

function NotificationHandler(props) {
  return (
    <div>
      {props.notifications.map((notification) => (
        <NotificationCell notification={notification}/>
      ))}
    </div>
  )
}

export default NotificationHandler