import React from 'react'

export default class NewestPosts extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        posts: null,
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
   
     ApiCall = (amount) => {
       fetch("https://michaelmiller.pythonanywhere.com/get/latest/posts/"+amount+"/")
       .then(response => response.json())
       .then(response => this.handleApiResponse(response))
     }
   
     componentWillMount() {
       let amount = this.props.amount === undefined ? 3 : this.props.amount
   
       this.ApiCall(amount)
   
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

     render() {
        return this.state.loading === true ? (
          <div className="text-center">
              <div class="spinner-border text-success" role="status">
                  <span class="sr-only">Loading...</span>
              </div>
          </div>
        ) : (
          <div className="container">
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
                      <div id={post.id+""} className="m-2">{post.html}</div>
                    </div>
                  </div>
                ))}
          </div>
        )
       }
      }