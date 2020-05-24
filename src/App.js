import React from 'react'
import { Route, Switch } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PostPage from './pages/PostPage'
import AllPostsPage from './pages/AllPostsPage'
import EditPostPage from './pages/EditPostPage'
import NewPostPage from './pages/NewPostPage'
import Error404 from './pages/Error404'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Logout from './pages/Logout'

import redirect from './pages/Redirect'

import './static/main.css'

export default function App() {
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/">Michael Miller</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              
              {localStorage.getItem("logged-in") !== 'true' ? <a class="nav-link" href="/all/posts">All Posts</a> : <a class="nav-link" href="/dashboard" tabindex="-1">Dashboard</a>}
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                More
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="/About">About</a>
                <a class="dropdown-item" href="/Social-media">Social Media</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="/Contact">Contact</a>
              </div>
            </li>
            <li class="nav-item">
              {localStorage.getItem("logged-in") !== 'true' ? <a class="nav-link" href="/login" tabindex="-1">Login</a> : <a class="nav-link" href="/logout" tabindex="-1">Logout</a>}
            </li>
          </ul>
        </div>
      </nav>

      <main>
        <Switch>
          <Route exact path="/" component={HomePage} />

          <Route path="/post/:id" component={PostPage} />
          <Route path="/all/posts" component={AllPostsPage} />
          <Route path="/new/post" component={NewPostPage} />
          <Route path="/edit/:id" component={EditPostPage} />
 
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/logout" component={Logout} />

          <Route path="/redirect" component={redirect} />

          <Route component={Error404} />
        </Switch>
      </main>

      <footer class="navbar navbar-light bg-light">
        <a class="navbar-brand" href="#">
          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-download.com%2Fwp-content%2Fuploads%2F2018%2F04%2FHalf_Life_logo_orange.png&f=1&nofb=1" width="30" height="30" class="d-inline-block align-top" alt="" loading="lazy" />
          Michael Miller's Blog
        </a>
      </footer>
    </div>
  )
}