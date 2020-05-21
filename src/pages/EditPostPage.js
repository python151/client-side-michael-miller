import React from 'react'
import '../static/edit.css'

export default class EditPostPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            timer: -1,
            timerActive: false,
            timerCallId: 0,
        }
    }

    updateTimerCallId = () => {
        this.setState({
            timerCallId: this.state.timerCallId+1,
        })
        return this.state.timerCallId
    }

    addToTimer = (timerId) => {
        if (timerId !== this.state.timerCallId) {
            return;
        }

        if (this.state.timer - 1 <= 0) {
            this.sendToApi();
            this.setState({
                timer: -1,
                timerActive: false,
            })
        } else {
            this.setState({
                timer: this.state.timer - 1,
            })
        }
    }

    restartTimer = () => {
        this.startSaveAnimation();
        this.setState({
            timer: 5,
            timerActive: true,
        })
    }

    sendToCache = () => { 
        sessionStorage.setItem("html-"+this.state.id, this.state.html)
        this.restartTimer()
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
        if (!this.state.loading && !this.state.timerActive) {
            this.loadHtml()
        }
    }

    componentDidMount() {
        window.setInterval(() => {
            if (this.state.timerActive) {this.addToTimer(this.updateTimerCallId())}
        }, 1000)
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
        this.sendToCache()
    }

    onChangeTitle = () => {
        let title = document.getElementById("title").value;
        this.setState({
            title: title
        })
        document.getElementById("titlePreview").innerHTML = title
        this.sendToCache()
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

    addHeader = (number) => {
        let textarea = document.getElementById("html")

        let start = textarea.selectionStart
        let end = textarea.selectionEnd

        let htmlInList = this.state.html.split("")

        htmlInList.splice(start, 0, "<h"+number+" class='display-"+(number+3)+"'>")
        htmlInList.splice(end+1, 0, "</h"+number+">")
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

    showHeaderOptions = () => {
        let list = document.getElementById("header-list")
        list.style.display = "block"
    }

    hideHeaderOptions = () => {
        let list = document.getElementById("header-list")
        setTimeout(() => {
            list.style.display = "none"
        }, 5000)
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

                        <span className="col"></span>
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
                                    <button className="btn btn-secondary" title="Header" onClick={() => this.addHeader(1)} onMouseOver={() => this.showHeaderOptions()} onMouseOut={() => this.hideHeaderOptions()}>
                                        <svg class="bi bi-type-h1" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z"/>
                                        </svg>
                                    </button>
                                    <ul id="header-list" className="header-list m-2">
                                        <li>
                                            <button className="btn btn-secondary" title="Header" onClick={() => this.addHeader(1)} onMouseOver={() => this.showHeaderOptions()} onMouseOut={() => this.hideHeaderOptions()}>
                                                <svg class="bi bi-type-h1" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z"/>
                                                </svg>
                                            </button>
                                        </li>
                                        <li>
                                            <button className="btn btn-secondary" title="Header" onClick={() => this.addHeader(2)} onMouseOver={() => this.showHeaderOptions()} onMouseOut={() => this.hideHeaderOptions()}>
                                                <svg class="bi bi-type-h2" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z"/>
                                                </svg>
                                            </button>
                                        </li>
                                        <li>
                                            <button className="btn btn-secondary" title="Header" onClick={() => this.addHeader(3)} onMouseOver={() => this.showHeaderOptions()} onMouseOut={() => this.hideHeaderOptions()}>
                                                <svg class="bi bi-type-h3" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z"/>
                                                </svg>
                                            </button>
                                        </li>
                                    </ul>
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