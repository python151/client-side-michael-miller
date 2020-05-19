import React from 'react'
import '../static/edit.css'

export default function HomePage() {
    localStorage.clear()
    window.location = "/"
    return (
        <p className="lead text-center mt-4">
            Should be redirected... <br />
            If not <a href="/">click here</a>
        </p>
    )
  }