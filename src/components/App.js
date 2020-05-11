import React, { Component } from "react";
import CIRVRlogo from "../images/CIRVRlogo.png";
import GraphWidget from "../components/GraphWidget";
import MarkWidget from "../components/MarkWidget";
import AutoSizer from "react-virtualized-auto-sizer";
import Graph from "./Graph";
import MarkGraph from "./MarkGraph";

// Add in styles
import "../styles/App.css";
import "../styles/MarkGraph.css";
import Widget from "./Widget";
import Database from "./Database";

/****** NOTES ******
- in order to graph in 'react-vis' the data needs to be in objects that have an 'x' and 'y' attribute
- to plot a time series in 'react-vis' the x-axis needs to be composed of javascript Date objects which it can recognize
*/

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      azureResults: null,       // holds results for azure container returned from Database.js
      gazeResults: null,        // holds results for gaze container returned from Database.js
      stressResults: null,      // holds results for stress container returned from Database.js
      logResults: null,         // holds results for logfiles container returned from Database.js
      questionResults: null,    // holds the data to graph the question markers, set in the gazeData/questionFilter functions
      markResults: null,        // holds the data to graph the scatter plot, set in the markData function 
    };

    // following lines are necessary for functions to operate with specific instance of program
    this.getData = this.getData.bind(this);
    this.gazeTimeFilter = this.gazeTimeFilter.bind(this);
    this.questionFilter = this.questionFilter.bind(this);
  }



  // function to receive the data sent from Database.js (the data from azure, gaze, stress, and logfiles container)
  getData(azure, gaze, stress, log) {
    console.log("Receiving Data..."); // for notification in the browser's console log ( use "ctrl + shift + j" to display in browser )

    // the following sets the respective state data sets, which can then be accessed at a wider scope for the rest of the class
    // some call functions to filter the data to be appropriately graphed before being set to the state
    this.setState({
      azureResults: this.valenceData(azure.resources),
      stressResults: this.stressData(stress.resources),
      gazeResults: this.gazeData(gaze.resources),
      logResults: log.resources,
      markResults: this.markData(gaze.resources),
    });

    // debugging used to see incoming data from a PID
    /*
    console.log(azure.resources);
    console.log(stress.resources);
    console.log(gaze.resources);
    console.log(log.resources);
    */

  }



  // function to filter the data received from stress container so it may be graphed, returns as an array.
  stressData(data) {
    return data.map((e) => ({
      x: new Date(e.Time),
      y: e.Stress,
    }));
  }



  /**********************************************************************************************************************************************************/
  // the following four functions (gazeTimeFilter, questionFilter, distance, and gazeData) are used in conjunction for reasons explained before each function
  /**********************************************************************************************************************************************************/

  // the primary function which calls the other three functions associated.
  // function to filter the data received from gaze container so it may be graphed, returns as an array.
  // since the gaze data also contains the information needed for the question markers, it also sets the state and filters for the questionResults.
  gazeData(data) {
    this.setState({
      questionResults: this.questionFilter(data),
    });

    return data.map((e) => ({
      x: this.gazeTimeFilter(e.ts),
      y: this.distance(e.X, e.Y),
    }));
  }

  // function to filter the time format given from the gaze container to a Date object to plot in time series graph
  gazeTimeFilter(time) {
    let arr = time.split(":").map((e) => parseInt(e));  // split the time format between ':' to receive seperate time segments (hours, mins, secs, micro-secs) while converting from string to int
    let date = new Date();                              
    date.setHours(arr[0], arr[1], arr[2], arr[3]);      // sets the hours, mins, sec, and mirco-seconds of the Date object respective to the parameters passed using the previous array made
    return date;
  }

  // function to filter the necessary data to plot the question markers on the graph
  questionFilter(data) {
    let arr = data.filter((e) => e.Question != null); // will only grab data from the gaze container that does not see the question attribute as empty
    return arr.map((e) => ({
      x: this.gazeTimeFilter(e.ts),
      question: e.Question,
    }));
  }

  // function which calculates distance of the plot points received from the gaze data 
  distance(datX, datY) {
    const HALF_AXIS = 0.5; // constant to represent the middle of screen axis
    var a = datX - HALF_AXIS;
    var b = datY - HALF_AXIS;
    var x = Math.sqrt(a * a + b * b);
    return 1 - x;
  }



  /**************************************************************************************************************************/
  // the following two functions (valenceData and valence) are used in conjunction for reasons explained before each function
  /**************************************************************************************************************************/

  // function to filter the data received from azure container so it may be graphed, returns as an array.
  valenceData(data) {
    return data.map((e) => ({
      x: new Date(e.TimeStamp),
      y: this.valence(
        e.Happiness,
        e.Anger,
        e.Contempt,
        e.Disgust,
        e.Fear,
        e.Sadness,
        e.Surprise
      ),
    }));
  }

  // function to calculate the valence data using the emotional data from the azure container
  valence(Hap, Ang, Con, Dis, Fear, Sad, Surp) {
    if (Hap === "-") {
      return 0.5;
    }
    var value = 0.5 + 0.5 * Hap - 0.5 * (Ang + Con + Dis + Fear + Sad + Surp);
    return value;
  }



  // function used to filter data for scatterplot from gaze container
  markData(data) {
    return data.map((e) => ({
      x: e.X,
      y: e.Y,
    }));
  }



  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img className="CIRVR-logo" src={CIRVRlogo} alt="CIRVR-Logo" />
          <h1 className="Header">CIRVR Dashboard</h1>
          { /* esablishes database connection through component which returns the search bar as well */ }
          <div>
            <Database sendData={this.getData} />
          </div>
        </div>
        <br></br>

        <div className="container">
          <GraphWidget
            colspan={3}
            rowspan={3}
          >
            <AutoSizer>
              {({ width, height }) => (
                <div>
                  <div>
                  { this.state.gazeResults && <h2>Attention</h2> }
                    <Graph
                      graphData={this.state.gazeResults}
                      height_param={height}
                      questions={this.state.questionResults}
                    />
                  </div>

                  <div>
                  { this.state.azureResults && <h2>Valence</h2> }
                    <Graph
                      graphData={this.state.azureResults}
                      height_param={height}
                      questions={null} 
                    />
                  </div>

                  <div>
                    { this.state.stressResults && <h2>Stress</h2> }
                    <Graph
                      graphData={this.state.stressResults}
                      height_param={height}
                      questions={null}
                    />
                  </div>
                </div>
              )}
            </AutoSizer>
          </GraphWidget>
          
          <MarkWidget colspan={1} rowspan={1}>
            <AutoSizer>
              {({ width, height }) => (
                <MarkGraph
                  graphData={this.state.markResults}
                  height_param={height}
                  width_param={width}
                />
              )}
            </AutoSizer>
          </MarkWidget>
    
          <Widget heading="Conversation Log" colspan={1} rowspan={2} />

        </div>
      </div>
    );
  }
}

export default App;
