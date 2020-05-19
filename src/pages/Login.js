import React from 'react'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  handleFormResponse = (response) => {
    if (response.success === true) {
      localStorage.setItem("logged-in", true)
      localStorage.setItem("session-key", response.sessionKey)

      console.log(localStorage.getItem("logged-in"))
      window.location = "/dashboard"
    } else {
      response.message = response.message !== undefined ? response.message : "Unknown Error"
  
      let warning = document.getElementById("warning")
      warning.display = "block"
      warning.innerText = response.message
    }
  }
  
  submitForm = () => {
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
  
    fetch("http://localhost:8000/login/?username="+username+"&password="+password)
    .then(response => response.json())
    .then(response => this.handleFormResponse(response))
    .catch((error) => {alert(error)})
  }

  render = () => {
      return (
        <div className="container mt-3">
            <div className="col w-30">
              <div className="row danger" id="warning" style={{display: 'none'}}></div>
              <div className="row">
                <input className="form-control" placeholder="Username" id="username" type="text" />
              </div>

              <div className="row mt-1">
                <input className="form-control" placeholder="Password" id="password" type="password" />
              </div>

              <div className="row justify-content-end mt-1">
                  <button className="btn btn-primary" onClick={() => this.submitForm()}>Submit</button>
              </div>
          </div>
        </div>
      )
  }

}