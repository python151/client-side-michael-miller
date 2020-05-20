import React from 'react'
import '../static/edit.css'

export default class EditPostPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }
    }

    loadHtml = () => {
        let domElement = document.getElementById("htmlPreview")
        domElement.innerHTML = this.state.html
        return ""
    }

    handleApiResponse = (response) => {
        if (response.success) {
            this.setState({
                title: response.title,
                html: response.html,
                id: response.id,
                loading: false,
            })
        }
    }

    callApi = (id) =>{
        let sessionKey = localStorage.getItem("session-key")
        fetch("https://michaelmiller.pythonanywhere.com/get/post/"+id+"/?session-key="+sessionKey)
        .then(response => response.json())
        .then(response => this.handleApiResponse(response))
    }

    componentWillMount() {
        let id = (window.location+"").split("/").reverse()[0]
        this.callApi(id)
    }

    componentDidUpdate() {
        if (!this.state.loading) {
            this.loadHtml()
        }
    }

    startSaveAnimation = () => {
        let saving = document.getElementById("saving")
        saving.innerHTML = `<img width="16" height="16" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.flaticon.com%2Ficons%2Fpng%2F512%2F100%2F100487.png&f=1&nofb=1" />` 
        saving.setAttribute("class", "saving")
    }

    handleApiEditResponse = (response) => {
        if (response.success) {
            let saving = document.getElementById("saving")
            saving.innerHTML = '<svg class="bi bi-check" width="16px" height="16px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/></svg>'
            saving.setAttribute("class", "saved text-success") 
        }
    }

    sendToApi = () => {
        this.startSaveAnimation();
        let sessionKey = localStorage.getItem("session-key")
        fetch("https://michaelmiller.pythonanywhere.com/edit/post/"+this.state.id+"/?session-key="+sessionKey, {
            method: 'POST',
            body: JSON.stringify({
                title: this.state.title,
                html: this.state.html,
            })
        })
        .then(response => response.json())
        .then(response => this.handleApiEditResponse(response))
    }

    onChangeHTML = () => {
        let html = document.getElementById("html").value;
        this.setState({
            html: html
        })
        this.loadHtml()
        this.sendToApi()
    }

    onChangeTitle = () =>{
        let title = document.getElementById("title").value;
        this.setState({
            title: title
        })
        document.getElementById("titlePreview").innerHTML = title
        this.sendToApi()
    }
    
    render() {
        if (localStorage.getItem("logged-in") !== 'true') {
            window.location = "/"
        }
        return this.state.loading ? (
            <div className="text-center mt-4">
                <div class="spinner-border text-success" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>

        ) : (
            <div className="container">
                <div className="col h-100 mt-3">
                    <div className="row">
                        <span className="col card">
                            <input className="w-100 m-0 mt-1 mb-1" placeholder="title" value={this.state.title} onChange={() => this.onChangeTitle()} id="title"/>
                        </span>

                        <span className="col">
                            
                        </span>
                    </div>
                    
                    <div className="row h-100 mt-3">
                        <textarea className="w-100 textarea" value={this.state.html} onChange={() => this.onChangeHTML()} id="html">
                            
                        </textarea>
                    </div>
                </div>
                <hr className="mb-3 mt-3" />
                <div id="saving" className="saving"></div>
                <div className="preview">
                    <h1 className="display-3" id="titlePreview">
                        {this.state.title}
                    </h1>
                    <div id="htmlPreview"></div>
                </div>
            </div>
        )
    }

  }