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

    onChangeTitle = () => {
        let title = document.getElementById("title").value;
        this.setState({
            title: title
        })
        document.getElementById("titlePreview").innerHTML = title
        this.sendToApi()
    }

    addTextSpan = () => {
        let textarea = document.getElementById("html")

        let start = textarea.selectionStart
        let end = textarea.selectionEnd

        let htmlInList = this.state.html.split("")

        htmlInList.splice(start, 0, "<p class='lead'>")
        htmlInList.splice(end+1, 0, "</p>")
        let html = htmlInList.join("")
        this.setState({
            html: html
        })
    }

    addHeader1 = () => {
        let textarea = document.getElementById("html")

        let start = textarea.selectionStart
        let end = textarea.selectionEnd

        let htmlInList = this.state.html.split("")

        htmlInList.splice(start, 0, "<h1 class='display-4'>")
        htmlInList.splice(end+1, 0, "</h1>")
        let html = htmlInList.join("")
        this.setState({
            html: html
        })
    }

    getIdFromYoutubeLink = (link) => {
        return link.split("?")[1].split("=")[1]
    }

    addVideo = () => {
        let video = prompt("Link to video (from youtube)")

        let textarea = document.getElementById("html")
        let start = textarea.selectionStart

        let htmlInList = this.state.html.split("")

        let videoHtml = `
<iframe id="player" type="text/html" width="640" height="390"
src="https://www.youtube.com/embed/${this.getIdFromYoutubeLink(video)}?enablejsapi=1"
frameborder="0"></iframe>
        `

        htmlInList.splice(start, 0, videoHtml)
        let html = htmlInList.join("")
        this.setState({
            html: html
        })
    }

    addLineBreak = () => {
        let textarea = document.getElementById("html")
        let start = textarea.selectionStart

        let htmlInList = this.state.html.split("")

        htmlInList.splice(start, 0, "<br />")
        let html = htmlInList.join("")
        this.setState({
            html: html
        })
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
                        <div className="toolbar m-1">
                            <ul>
                                <li>
                                    <button className="btn btn-secondary" title="Text" onClick={() => this.addTextSpan()}>
                                        <svg class="bi bi-cursor-text" width="1em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M5 2a.5.5 0 01.5-.5c.862 0 1.573.287 2.06.566.174.099.321.198.44.286.119-.088.266-.187.44-.286A4.165 4.165 0 0110.5 1.5a.5.5 0 010 1c-.638 0-1.177.213-1.564.434a3.49 3.49 0 00-.436.294V7.5H9a.5.5 0 010 1h-.5v4.272c.1.08.248.187.436.294.387.221.926.434 1.564.434a.5.5 0 010 1 4.165 4.165 0 01-2.06-.566A4.561 4.561 0 018 13.65a4.561 4.561 0 01-.44.285 4.165 4.165 0 01-2.06.566.5.5 0 010-1c.638 0 1.177-.213 1.564-.434.188-.107.335-.214.436-.294V8.5H7a.5.5 0 010-1h.5V3.228a3.49 3.49 0 00-.436-.294A3.166 3.166 0 005.5 2.5.5.5 0 015 2zm3.352 1.355zm-.704 9.29z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>   
                                </li>
                                <li>
                                    <button className="btn btn-secondary" title="Video" onClick={() => this.addVideo()}>
                                        <svg class="bi bi-film" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M0 1a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H1a1 1 0 01-1-1V1zm4 0h8v6H4V1zm8 8H4v6h8V9zM1 1h2v2H1V1zm2 3H1v2h2V4zM1 7h2v2H1V7zm2 3H1v2h2v-2zm-2 3h2v2H1v-2zM15 1h-2v2h2V1zm-2 3h2v2h-2V4zm2 3h-2v2h2V7zm-2 3h2v2h-2v-2zm2 3h-2v2h2v-2z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-secondary" title="Header" onClick={() => this.addHeader1()}>
                                        <svg class="bi bi-type-h1" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z"/>
                                        </svg>
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-secondary" title="Line Break" onClick={() => this.addLineBreak()}>
                                        <svg class="bi bi-arrow-down-short" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M4.646 7.646a.5.5 0 01.708 0L8 10.293l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clip-rule="evenodd"/>
                                            <path fill-rule="evenodd" d="M8 4.5a.5.5 0 01.5.5v5a.5.5 0 01-1 0V5a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <textarea className="w-90 textarea" value={this.state.html} onChange={() => this.onChangeHTML()} id="html"></textarea>
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