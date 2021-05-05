import React, { Component } from 'react';
import './App.css';
import ReactStars from "react-rating-stars-component";
import axios from 'axios';
import logo from './roam-logo.jpg';
import homeArt from './home-art.png';
import exit from './icon/maps/transit_enterexit_24px.png';
import plus from './add_24px.png';

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
    this.recRef = React.createRef() 
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStopInputChange = this.handleStopInputChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.addStop = this.addStop.bind(this);
  }

  componentDidMount() {
    document.body.style.zoom = .8
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
                  <input id="locations-input" type="text" name="location" className="location-input" 
                  placeholder="Enter location" value = {this.state.stops[i]['location']} 
                  onChange = {(e) => this.handleStopInputChange(e,i)}/>
                  <input id="food-preferences-input" type="text" name="food" className="preferences-input" 
                  placeholder="Enter food preferences"
                  onChange = {(e) => this.handleStopInputChange(e,i)}/>
                  <input id="activity-preferences-input" type="text" name="activities" className="preferences-input" 
                  placeholder="Enter activity preferences"
                  onChange = {(e) => this.handleStopInputChange(e,i)}/>
                  <button className= 'remove-button' onClick={(e) => this.removeStop(e,i)}> 
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7071 14.2929C15.3166 13.9024 14.6834 13.9024 14.2929 14.2929C13.9024 14.6834 13.9024 15.3166 14.2929 15.7071L23.4854 24.8996L14.2929 34.0921C13.9024 34.4826 13.9024 35.1157 14.2929 35.5063C14.6834 35.8968 15.3166 35.8968 15.7071 35.5063L24.8996 26.3138L34.0919 35.5061C34.4824 35.8966 35.1156 35.8966 35.5061 35.5061C35.8966 35.1156 35.8966 34.4824 35.5061 34.0919L26.3138 24.8996L35.5061 15.7073C35.8966 15.3168 35.8966 14.6836 35.5061 14.2931C35.1156 13.9025 34.4824 13.9025 34.0919 14.2931L24.8996 23.4854L15.7071 14.2929Z" fill="black"/>
                      <path d="M14.2929 14.2929L13.9393 13.9393L13.9393 13.9393L14.2929 14.2929ZM15.7071 14.2929L16.0607 13.9393L15.7071 14.2929ZM14.2929 15.7071L13.9393 16.0607L14.2929 15.7071ZM23.4854 24.8996L23.8389 25.2532L24.1925 24.8996L23.8389 24.546L23.4854 24.8996ZM14.2929 34.0921L13.9394 33.7385L13.9394 33.7385L14.2929 34.0921ZM14.2929 35.5063L13.9394 35.8598L13.9394 35.8598L14.2929 35.5063ZM15.7071 35.5063L15.3536 35.1527L15.3536 35.1527L15.7071 35.5063ZM24.8996 26.3138L25.2532 25.9603L24.8996 25.6067L24.546 25.9603L24.8996 26.3138ZM26.3138 24.8996L25.9603 24.546L25.6067 24.8996L25.9603 25.2532L26.3138 24.8996ZM35.5061 15.7073L35.8597 16.0608L35.8597 16.0608L35.5061 15.7073ZM35.5061 14.2931L35.8597 13.9395L35.8597 13.9395L35.5061 14.2931ZM34.0919 14.2931L34.4455 14.6466L34.4455 14.6466L34.0919 14.2931ZM24.8996 23.4854L24.546 23.8389L24.8996 24.1925L25.2532 23.8389L24.8996 23.4854ZM14.6464 14.6464C14.8417 14.4512 15.1583 14.4512 15.3536 14.6464L16.0607 13.9393C15.4749 13.3536 14.5251 13.3536 13.9393 13.9393L14.6464 14.6464ZM14.6464 15.3536C14.4512 15.1583 14.4512 14.8417 14.6464 14.6464L13.9393 13.9393C13.3536 14.5251 13.3536 15.4749 13.9393 16.0607L14.6464 15.3536ZM23.8389 24.546L14.6464 15.3536L13.9393 16.0607L23.1318 25.2532L23.8389 24.546ZM14.6465 34.4456L23.8389 25.2532L23.1318 24.546L13.9394 33.7385L14.6465 34.4456ZM14.6465 35.1527C14.4512 34.9575 14.4512 34.6409 14.6465 34.4456L13.9394 33.7385C13.3536 34.3243 13.3536 35.274 13.9394 35.8598L14.6465 35.1527ZM15.3536 35.1527C15.1583 35.348 14.8417 35.348 14.6465 35.1527L13.9394 35.8598C14.5252 36.4456 15.4749 36.4456 16.0607 35.8598L15.3536 35.1527ZM24.546 25.9603L15.3536 35.1527L16.0607 35.8598L25.2532 26.6674L24.546 25.9603ZM34.4454 35.1525L25.2532 25.9603L24.546 26.6674L33.7383 35.8596L34.4454 35.1525ZM35.1525 35.1525C34.9573 35.3478 34.6407 35.3478 34.4454 35.1525L33.7383 35.8596C34.3241 36.4454 35.2739 36.4454 35.8596 35.8596L35.1525 35.1525ZM35.1525 34.4454C35.3478 34.6407 35.3478 34.9573 35.1525 35.1525L35.8596 35.8596C36.4454 35.2739 36.4454 34.3241 35.8596 33.7383L35.1525 34.4454ZM25.9603 25.2532L35.1525 34.4454L35.8596 33.7383L26.6674 24.546L25.9603 25.2532ZM35.1526 15.3537L25.9603 24.546L26.6674 25.2532L35.8597 16.0608L35.1526 15.3537ZM35.1526 14.6466C35.3478 14.8419 35.3478 15.1585 35.1526 15.3537L35.8597 16.0608C36.4455 15.4751 36.4455 14.5253 35.8597 13.9395L35.1526 14.6466ZM34.4455 14.6466C34.6407 14.4514 34.9573 14.4514 35.1526 14.6466L35.8597 13.9395C35.2739 13.3537 34.3241 13.3537 33.7384 13.9395L34.4455 14.6466ZM25.2532 23.8389L34.4455 14.6466L33.7384 13.9395L24.546 23.1318L25.2532 23.8389ZM15.3536 14.6464L24.546 23.8389L25.2532 23.1318L16.0607 13.9393L15.3536 14.6464Z" fill="black"/>
                    </svg>
                  </button>
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
              {result.food.map(foodItem =>
                <div className = "search-item-container">
                    <div className = "search-link">
                      <a href = {foodItem[1]} className = 'link-content'> View on Yelp <img src = {exit}></img> </a> 
                    </div>
                    <div className = 'search-item'>
                          <div className = "search-item-main"> 
                            <img src = {foodItem[4]} className = "search-item-image"></img>
                            <p className = "search-item-title">{foodItem[0]}</p>
                          </div>
                          <div className = 'search-item-metadata'>
                              <ReactStars
                                  count={5}
                                  value={foodItem[3]}
                                  onChange={(e) => {e.preventDefault()}}
                                  activeColor="#EF412A"
                                  edit = {false}
                                  classNames = 'star-rating'
                                  emptyIcon = {<svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4.8913 0L6.55395 2.83474L9.78261 3.52903L7.58152 5.97529L7.9143 9.23913L4.8913 7.91626L1.86831 9.23913L2.20109 5.97529L0 3.52903L3.22866 2.83474L4.8913 0Z" fill="#ACACAC"/>
                                  </svg>
                                  }
                                  halfIcon= {<svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4.8913 0L6.55395 2.83474L9.78261 3.52903L7.58152 5.97529L7.9143 9.23913L4.8913 7.91626L1.86831 9.23913L2.20109 5.97529L0 3.52903L3.22866 2.83474L4.8913 0Z" fill="#EF412A"/>
                                  </svg>
                                  }
                                  filledIcon = {<svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4.8913 0L6.55395 2.83474L9.78261 3.52903L7.58152 5.97529L7.9143 9.23913L4.8913 7.91626L1.86831 9.23913L2.20109 5.97529L0 3.52903L3.22866 2.83474L4.8913 0Z" fill="#EF412A"/>
                                  </svg>
                                  }
                                />
                                <p className = 'search-item-categories'>{foodItem[2]}</p>            
                          </div>
                      </div>
                </div>
                )}
            </div>
            <div className = "search-result-group">
              <h3> Activities </h3>
              {result.activities.map(activityItem => 
              <div className = 'search-item-container'> 
                    <div className = "search-link">
                      <a href = {activityItem[1]} className = 'link-content'> View on Yelp <img src = {exit}></img> </a> 
                    </div>
                    <div className = 'search-item'>
                      <div className = "search-item-main"> 
                        <img src = {activityItem[4]} alt = 'search-image' className = "search-item-image"></img>
                        <p className = "search-item-title">{activityItem[0]}</p>
                      </div>
                      <div className = 'search-item-metadata'>
                        <ReactStars
                            count={5}
                            value={activityItem[3]}
                            onChange={(e) => {e.preventDefault()}}
                            activeColor="#EF412A"
                            edit = {false}
                            classNames = 'star-rating'
                            emptyIcon = {<svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.8913 0L6.55395 2.83474L9.78261 3.52903L7.58152 5.97529L7.9143 9.23913L4.8913 7.91626L1.86831 9.23913L2.20109 5.97529L0 3.52903L3.22866 2.83474L4.8913 0Z" fill="#ACACAC"/>
                            </svg>
                            }
                            halfIcon= {<svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.8913 0L6.55395 2.83474L9.78261 3.52903L7.58152 5.97529L7.9143 9.23913L4.8913 7.91626L1.86831 9.23913L2.20109 5.97529L0 3.52903L3.22866 2.83474L4.8913 0Z" fill="#EF412A"/>
                            </svg>
                            }
                            filledIcon = {<svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.8913 0L6.55395 2.83474L9.78261 3.52903L7.58152 5.97529L7.9143 9.23913L4.8913 7.91626L1.86831 9.23913L2.20109 5.97529L0 3.52903L3.22866 2.83474L4.8913 0Z" fill="#EF412A"/>
                            </svg>
                            }
                          />
                          <p className = 'search-item-categories'>{activityItem[2]}</p>            
                        </div>
                    </div>
                </div>
                )}
            </div>
          </div>
        </div>
      )
    })
    return (
    <div>
      <h2 id='rec-header' className = 'rec-header'>Recommendations</h2>
      {items}
    </div>)
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
      const id = 'rec-header';
      const yOffset = -40; 
      const element = document.getElementById(id);
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }).catch(error => {
      console.log("FAIL")
      console.log(error);
    })
  }

  render() {
    return (
      <div className="App">

        <header className="topcorner hidden">
        <img className = 'roam-logo' src = {logo}>
        </img>
        <div className = 'header-text'>
          <h1>Roam</h1>
          <p className = 'subtitle'>An NLP-guided food and activity recommender for your next road trip.</p>
        </div>
        </header>

        <div className = "main-container">
          <div className = "main-content">
            <h2>Plan your road trip today!</h2>
            <form className="search-form">
                <div className = 'label-section'>
                  <div className = 'location-label'>
                    <h3>Location</h3>
                    <p>Example: 'Ithaca'</p>
                  </div>
                  <div className = 'preference-label'>
                    <h3>Food Preferences</h3>
                    <p>Example: 'Italian'</p>
                  </div>
                  <div className = 'preference-label'>
                    <h3>Activity Preferences</h3>
                    <p>Example: 'Hiking'</p>
                  </div>
                </div>
                <div className="input-section">
                  <label>Start</label>
                  <div className='input-group'>
                    <input id="locations-input" type="text" name="startLocation" className="location-input" 
                    placeholder="Enter location" value = {this.state.startLocation} 
                    onChange = {this.handleInputChange}/>
                    <input id="food-preferences-input" type="text" name="startFood" className="preferences-input" 
                    placeholder="Enter food preferences" value = {this.state.startFood}
                    onChange = {this.handleInputChange}/>
                    <input id="activity-preferences-input" type="text" name="startActivities" className="preferences-input" 
                    placeholder="Enter activity preferences" value = {this.state.startActivity} 
                    onChange = {this.handleInputChange}/>
                    <div id='add-button' className="btn btn-info" onClick={this.addStop}> Add Stop </div>
                  </div>
                </div>
                {this.renderStops()}
                <div className="input-section">
                  <label>Destination</label>
                  <div className='input-group'>
                    <input id="locations-input" type="text" name="destLocation" className="location-input" 
                    placeholder="Enter location" value = {this.state.destLocation}
                    onChange = {this.handleInputChange}/>
                    <input id="food-preferences-input" type="text" name="destFood" className="preferences-input"
                    placeholder="Enter food preferences" value = {this.state.destFood}
                    onChange = {this.handleInputChange}/>
                    <input id="activity-preferences-input" type="text" name="destActivities" className="preferences-input"
                    placeholder="Enter activity preferences" value = {this.state.destActivities}
                    onChange = {this.handleInputChange}/>
                    <div className ='spacer'></div>
                  </div>
                </div>
                  <button id='go-button' type="submit" className="btn btn-info" onClick={this.handleSearch}> Go! </button>
            </form>
            <img className = 'home-art' alt = 'search-image' src = {homeArt}></img>
          </div>
        </div>
        
        {
          this.state.searched && 
          <div> 
            {this.renderSearchResults()}
          </div>
        }
          <div className = 'bottom-space'></div>
      </div>
    );
  } 
}

export default App;
