import React from 'react'

export default function Toast({ message }) {
  if (!message) return null
  return (
    <div className="toast toast-top toast-end">
      <div className="alert alert-info shadow">
        <span>{message}</span>
      </div>
    </div>
  )
}
