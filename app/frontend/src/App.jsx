import './App.css';
import React, { Component } from 'react';
import axios from 'axios'

class App extends Component {

  constructor() {
    super();
    this.state = {
      startLocation: "",
      startFood: "",
      startActivities: "",
      destLocation: "",
      destFood: "",
      destActivities: "",
      stops: [],
      results: [],
      searched: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStopInputChange = this.handleStopInputChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.addStop = this.addStop.bind(this);
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleStopInputChange(e,i) {
    let newStops = this.state.stops;
    let field = [e.target.name]
    newStops[i][field] = e.target.value
    this.setState({
      stops: newStops
    })
  }

  addStop(e) {
    e.preventDefault()
    let new_stops = this.state.stops
    new_stops.push({location: "", food: "", activities: ""})
    this.setState({
      stops: new_stops
    })
  }

  removeStop(e, i) {
    e.preventDefault()
    let new_stops = this.state.stops
    new_stops.splice(i,1)
    this.setState({
      stops: new_stops
    })
  }

  renderStops() {
    let items = []
    for (let i = 0; i < this.state.stops.length; i++) {
      items.push(
        <div className="input-section">
                <label>Stop {i+1}</label>
                <div className='input-group'>
                  <input id="locations-input" type="text" name="location" className="form-control" 
                  placeholder="Enter location" value = {this.state.stops[i]['location']} 
                  onChange = {(e) => this.handleStopInputChange(e,i)}/>
                  <input id="food-preferences-input" type="text" name="food" className="form-control" 
                  placeholder="Enter food preferences"
                  onChange = {(e) => this.handleStopInputChange(e,i)}/>
                  <input id="activity-preferences-input" type="text" name="activities" className="form-control" 
                  placeholder="Enter activity preferences"
                  onChange = {(e) => this.handleStopInputChange(e,i)}/>
                  <button className= 'remove-button' onClick={(e) => this.removeStop(e,i)}> X </button>
                </div>
      </div>
      )
    }
    return <div>{items}</div>
  }

  exportState() {
    let output = []
    output.push(
      {
        location: this.state.startLocation, 
        food: this.state.startFood,
        activities: this.state.startActivities
      })
    this.state.stops.forEach(stop=> {
      output.push(
        {
          location: stop.location, 
          food: stop.food,
          activities: stop.activities
        })
    })
    output.push(
      {
        location: this.state.destLocation, 
        food: this.state.destFood,
        activities: this.state.destActivities
      })
    return output
  }

  processResponse(result) {
    let output = []
    console.log('THIS IS THE RESULT')
    console.log(result)
    for (const location in result) {
      let dic = {}
      dic.location = location
      dic.food = result[location][0]
      dic.activities = result[location][1]
      output.push(dic)
    }
    return output
  }

  renderSearchResults() {
    let results = this.state.results
    let items = []
    results.forEach(result => {
      items.push(
        <div className = "search-result">
          <h2>{result.location}</h2>
          <div className = "search-result-content">
            <div className = "search-result-group">
              <h3> Food </h3>
              {result.food.map(foodItem => <a href={foodItem[1]}>{ foodItem[0] }</a>) }
            </div>
            <div className = "search-result-group">
              <h3> Activities </h3>
              {result.activities.map(activityItem => <a href={activityItem[1]}>{ activityItem[0] }</a>) }
            </div>
          </div>
        </div>
      )
    })
    return <div>{items}</div>
  }
 
  handleSearch(e) {
    e.preventDefault()

    //list of dictionaries
    let user_input = this.exportState()
    console.log('USER INPUT')
    console.log(user_input)
  
    axios.get('/search', {
        params:{
          input: JSON.stringify(user_input)
        }
      } 
    ).then(response => {
      console.log("SUCCESS")
      console.log(response);
      console.log(this.processResponse(response['data']));
      this.setState({
        searched: true,
        results: this.processResponse(response['data'])
      })
    }).catch(error => {
      console.log("FAIL")
      console.log(error);
    })
  }

  render() {
    return (
      <div className="App">

        <header className="topcorner hidden">
          <h1>Roam</h1>
          <p>An NLP-guided food and activity recommender for your next road trip.</p>
        </header>

        <div className = "main-container">
          <h2>Plan your road trip today!</h2>
          <form className="search-form">
              <div className="input-section">
                <label>Start</label>
                <div className='input-group'>
                  <input id="locations-input" type="text" name="startLocation" className="form-control" 
                  placeholder="Enter location, ex: 'New York City'" value = {this.state.startLocation} 
                  onChange = {this.handleInputChange}/>
                  <input id="food-preferences-input" type="text" name="startFood" className="form-control" 
                  placeholder="Enter food prefs, ex: 'Pizza, Italian'" value = {this.state.startFood}
                  onChange = {this.handleInputChange}/>
                  <input id="activity-preferences-input" type="text" name="startActivities" className="form-control" 
                  placeholder="Enter activity prefs, ex: 'Hiking'" value = {this.state.startActivity} 
                  onChange = {this.handleInputChange}/>
                  <div className ='spacer'></div>
                </div>
              </div>
              {this.renderStops()}
              <div className="input-section">
                <label>Destination</label>
                <div className='input-group'>
                  <input id="locations-input" type="text" name="destLocation" className="form-control" 
                  placeholder="Enter location, ex: 'New York City'" value = {this.state.destLocation}
                  onChange = {this.handleInputChange}/>
                  <input id="food-preferences-input" type="text" name="destFood" className="form-control"
                  placeholder="Enter food prefs,  ex: 'Pizza, Italian" value = {this.state.destFood}
                  onChange = {this.handleInputChange}/>
                  <input id="activity-preferences-input" type="text" name="destActivities" className="form-control"
                  placeholder="Enter activity prefs, ex: 'Hiking'" value = {this.state.destActivities}
                  onChange = {this.handleInputChange}/>
                  <div className ='spacer'></div>
                </div>
              </div>
              <div className = 'action-buttons'>
                {this.state.stops.length <= 3 && <button className="btn btn-info" onClick={this.addStop}> Add Stop </button>}
                <button id='go-button' type="submit" className="btn btn-info" onClick={this.handleSearch}> Go! </button>
              </div>
          </form>
        </div>
        
        {
          this.state.searched && 
          <div> 
            {this.renderSearchResults()}
          </div>
        }
      </div>
    );
  } 
}

export default App;
