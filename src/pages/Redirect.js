import React from 'react'

export default class NewestPosts extends React.Component {
    constructor(props) {
      super(props);
      window.location = 'michaelmiller.pythonanywhere.com/admin/'
    }
   
     render() {
        return (<h1>loading...</h1>)
    }
}