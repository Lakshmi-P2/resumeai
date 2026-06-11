import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'application', message: 'Your application has been submitted successfully!', is_read: false, created_at: new Date() },
    { id: 2, type: 'status_update', message: 'Your application status updated to: shortlisted', is_read: false, created_at: new Date() },
    { id: 3, type: 'job', message: 'New job matching your profile: Frontend Developer at Google', is_read: true, created_at: new Date() },
  ])

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })))
  }

  const getIcon = (type) => {
    switch(type) {
      case 'application': return '📝'
      case 'status_update': return '🔔'
      case 'job': return '💼'
      default: return '📢'
    }
  }

  const unread = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            <p className="text-dark-text mt-1">{unread} unread notifications</p>
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="glass text-dark-text text-sm px-4 py-2 rounded-xl hover:text-white transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className={`glass rounded-2xl p-5 flex gap-4 ${!n.is_read ? 'border-primary/20' : ''}`}>
              <div className="text-2xl">{getIcon(n.type)}</div>
              <div className="flex-1">
                <p className={`text-sm ${!n.is_read ? 'text-white font-medium' : 'text-dark-text'}`}>
                  {n.message}
                </p>
                <p className="text-dark-text text-xs mt-1">
                  {new Date(n.created_at).toLocaleDateString()}
                </p>
              </div>
              {!n.is_read && (
                <div className="w-2 h-2 bg-primary rounded-full mt-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}