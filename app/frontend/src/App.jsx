import './App.css';
import React, { Component } from 'react';
import axios from 'axios'

class App extends Component {

  constructor() {
    super();
    this.state = {
      locations: "",
      preferences: "",
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSearch(e) {
    e.preventDefault()
    var inp = {
      locations: this.state.locations,
      preferences: this.state.preferences
    }
    axios.get('/search', {
        params:{
          locations: this.state.locations,
          preferences: this.state.preferences
        }
      } 
    ).then(response => {
      console.log("SUCCESS")
      console.log(response);
      //adjust state to take in response
    }).catch(error => {
      console.log("FAIL")
      console.log(error);
    })
  }

  render() {
    return (
      <div className="App">

        <div className="topcorner hidden">
          <p>Project Name</p>
          <p>Student Names</p>
        </div>

        <form className="form-inline global-search">
            <h1>
                Road Trip Recommender
            </h1>
            <div className="form-group">
                <input id="locations-input" onChange={this.handleInputChange} type="text" name="locations" className="form-control" placeholder="Locations"/>
            </div>
            <div className="form-group">
                <input id="preferences-input" onChange={this.handleInputChange} type="text" name="preferences" className="form-control" placeholder="Preferences"/>
            </div>
            <button type="submit" className="btn btn-info" onClick={this.handleSearch}> Go! </button>
        </form>
      </div>
    );
  } 
}

export default App;
