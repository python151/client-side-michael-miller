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
  fetch("https://michaelmiller.pythonanywhere.com/create/new/post/?session-key="+sessionKey, {
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

          <div className="container">
            <button className="btn btn-primary plus" onClick={() => makeNewPost()}>
              <span className="rotate-45">
                <svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                  <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
                </svg>
              </span>

            </button>
            <div className="under-plus"></div>
          </div>


          <NewestPosts amount={5} />
        </div>
    </div>
  )
}
