import React from 'react'
import NewestPosts from '../components/LatestPosts'

const callApi = (amountOfPosts) => {
    return []
}

export default function AllPostsPage() {
    return (
    <div className="container">
        <h1 className="display-3 mb-4">Latest Posts</h1>
        <NewestPosts amount={20} />
    </div>
  )
}
