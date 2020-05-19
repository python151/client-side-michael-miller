import React from 'react'
import NewestPosts from '../components/LatestPosts'
import '../static/dashboard.css'

const handleApiResponse = (response) => {
  if (response.success === true) {
    window.location = '/edit/'+response.id;
  } else {
    alert("Error.")
  }
}

const makeNewPost = () => {
  let conf = window.confirm("Are you sure?");
  if (conf === false) {
    return;
  }

  let sessionKey = localStorage.getItem("session-key")
  fetch("http://localhost:8000/create/new/post/?session-key="+sessionKey, {
    method: "POST",
    body: JSON.stringify({
      title: "New Post",
      html: "<p class='lead'>Example text</p>"
    })
  })
  .then(response => response.json())
  .then(response => handleApiResponse(response))
}

export default function HomePage() {
  if (localStorage.getItem("logged-in") !== 'true') {
    window.location = "/"
  }
  return (
    <div>
        <div className="container">
          <h1 className="display-3">Dashboard</h1>
          <hr />

          <button className="btn btn-primary plus" onClick={() => makeNewPost()}>
            +
          </button>

          <hr />
          <NewestPosts amount={5} />
        </div>
    </div>
  )
}
