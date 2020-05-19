import React, { useState, useEffect } from 'react'
import {API} from '../App.js'
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
        loading: false,
      })
      return;
    }
 }

  ApiCall = (id) => {
    fetch("http://localhost:8000/get/post/"+id+"/")
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
          <div className="m-3" id="html">
            {this.state.html}
          </div>
        </div>

      )
  }
}
