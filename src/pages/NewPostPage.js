import React from 'react'

const sendApi = () => {
    return 2;
}

export default function NewPostPage() {
    let id = sendApi()
    window.location = '/edit/post/'+id
    return (
        <div className="text-center mt-3">
            <div class="spinner-border text-success" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    )
}