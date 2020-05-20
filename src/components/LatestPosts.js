import React from 'react'

export default class NewestPosts extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        posts: null,
        amount: props.amount === undefined ? 3 : props.amount,
      }
    }
   
    handleApiResponse = (response) => {
       if (response.success) {
         this.setState({
           posts: response.posts,
           loading: false,
         })
         return;
       }
       
    }

    cacheResponse(response, amount) {
        sessionStorage.setItem("latest-posts-"+this.state.amount, JSON.stringify(response))
        return response
    }
   
    ApiCall = (amount) => {
        let latestPostsAmount = sessionStorage.getItem("latest-posts-"+amount)
        if (latestPostsAmount !== null) {
            this.handleApiResponse(JSON.parse(latestPostsAmount))
        }
        else {
            fetch("https://michaelmiller.pythonanywhere.com/get/latest/posts/"+amount+"/")
            .then(response => response.json())
            .then(response => this.cacheResponse(response, amount))
            .then(response => this.handleApiResponse(response, amount))
        }
     }
   
     componentWillMount() {
       this.ApiCall(this.state.amount)
     }
   
     runHtmlEval = (id) => {
       let domElement = document.getElementById(id+"")
       domElement.innerHTML = domElement.innerText
       return ""
     }
   
     componentDidUpdate() {
       if (this.state.loading !== true) {
         this.state.posts.map(post => {
           this.runHtmlEval(post.id)
         })
       }
     }

     componentDidMount() {
        if (this.state.loading !== true) {
            this.state.posts.map(post => {
              this.runHtmlEval(post.id)
            })
          }
     }

     formatDate = (date) => {
        return date.split("T")[0].split("-").join("/")
     }

     reloadCurrent = () => {
        sessionStorage.removeItem("latest-posts-"+this.state.amount)
        this.ApiCall(this.state.amount)
     }

     render() {
        return this.state.loading === true ? (
          <div className="text-center">
              <div class="spinner-border text-success" role="status">
                  <span class="sr-only">Loading...</span>
              </div>
          </div>
        ) : (
          <div className="container">
                <div className="date mr-2">
                    <button className="close" onClick={() => this.reloadCurrent()}>
                        <svg class="bi bi-arrow-repeat" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M2.854 7.146a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L2.5 8.207l1.646 1.647a.5.5 0 00.708-.708l-2-2zm13-1a.5.5 0 00-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 000-.708z" clip-rule="evenodd"/>
                            <path fill-rule="evenodd" d="M8 3a4.995 4.995 0 00-4.192 2.273.5.5 0 01-.837-.546A6 6 0 0114 8a.5.5 0 01-1.001 0 5 5 0 00-5-5zM2.5 7.5A.5.5 0 013 8a5 5 0 009.192 2.727.5.5 0 11.837.546A6 6 0 012 8a.5.5 0 01.501-.5z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
                <br />
                <br />
                {this.state.posts.map(post => (
                  <div className="card mt-1 mb-3">
                    <div className="m-1 postPreview">
                        <div className="modal-header">
                            <a href={"/post/"+post.id}><h1 className="display-4">{post.title}</h1></a>
                            {localStorage.getItem("logged-in") === 'true' ? (<div><button type="button dropdown-toggle" className="btn close"id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 16" width="13" height="16"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg></button>
                            <div class="dropdown-menu mt-2" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href={"/post/"+post.id}>Full Post</a>
                                <a class="dropdown-item" href={"/edit/"+post.id}>Edit</a>
                                <a class="dropdown-item" href={"/delete/"+post.id}>Delete</a>
                            </div></div>) : (<div></div>) }
                        </div>
                        <small className="date">{this.formatDate(post.date)}</small>
                        <div id={post.id+""} className="m-2">{post.html}</div>
                    </div>
                  </div>
                ))}
          </div>
        )
    }
}