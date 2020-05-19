import React from 'react'
import { Link } from 'react-router-dom'
import Image1 from '../static/test.jpg';
import Image2 from '../static/test1.jpg';
import Image3 from '../static/test2.jpg';
import NewestPosts from '../components/LatestPosts';


export default function HomePage() {
  return (
    <div className="container">
      <h1 className="display-3 mb-4 text-center">Michael Miller's Blog</h1>
      <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={Image1} className="d-block w-100" alt="img-1" />
            </div>
            <div className="carousel-item">
              <img src={Image2} className="d-block w-100" alt="img-2" />
            </div>
            <div className="carousel-item">
              <img src={Image3} className="d-block w-100" alt="img-3" />
            </div>
          </div>
          <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
      </div>

      <div className="mt-4 card text-center">
        <p className="lead m-3">
          A short description of yourself.
        </p>
      </div>

      <div className="mt-5">
        <NewestPosts amount={3} />
      </div>
      
    </div>
  )
}
