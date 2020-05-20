import React, { useState, useEffect } from 'react'
import '../static/home.css';

export default class UserPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      html: null,
    }
  }

  handleApiResponse = (response) => {
    if (response.success) {
      this.setState({
        title: response.title,
        id: response.id,
        html: response.html,
        date: response.date,
        loading: false,
      })
      return;
    }
 }

  ApiCall = (id) => {
    fetch("https://michaelmiller.pythonanywhere.com/get/post/"+id+"/")
    .then(response => response.json())
    .then(response => this.handleApiResponse(response))
  }

  componentWillMount() {
    let id = (window.location+"").split("/").reverse()[0]
    this.ApiCall(id)
  }

  runHtmlEval = (id) => {
    let domElement = document.getElementById(id+"")
    domElement.innerHTML = domElement.innerText
    return ""
  }

  componentDidUpdate() {
    if (this.state.loading !== true) {
      this.runHtmlEval("html")
    }
  }
  
  formatDate = (date) => {
    return date.split("T")[0].split("-").join("/")
  }

  render () {
    return this.state.loading === true ? (
        <div class="spinner-border text-success" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="container">
          <h1 className="display-3">
            {this.state.title}
          </h1>
          <div className="date">
            <small>{this.formatDate(this.state.date)}</small>
          </div>
          <div className="m-3" id="html">
            {this.state.html}
          </div>
        </div>
      )
  }

}
