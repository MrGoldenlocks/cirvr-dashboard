import React from "react";
import {
  XYPlot,
  AreaSeries,
  XAxis,
  YAxis,
  Crosshair,
} from "react-vis";
import "../styles/Graph.css";
import "../react-vis/dist/style.css";

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crossValues: false,               // holds data for the current value the cursor points to on the graph
    };

    this.onNearestX = this.onNearestX.bind(this);
  }

  // function used for setting the current cursor value when hovering over the graph
  onNearestX(value) {
    this.setState({crossValues: {x: value.x, y: value.y} });
  }

  render() {

    return (
        <XYPlot
        height={ this.props.height_param / 3.5 }
        width={2000}
        stroke="#1a9fba"
        fill="#1d889d"
        xType="time"
        yDomain={[0, 1]}
        onMouseLeave={() => this.setState({crossValues: false})}
        >
            <XAxis style={{ ticks: { stroke: "#d4d6d6" } }} />
            <YAxis style={{ ticks: { stroke: "#d4d6d6" } }} />

            { /* sets the data passed (this.props.graphData) to the graph and then calls onNearestX function when the cursor hovers over the graph */}
            <AreaSeries
                data={this.props.graphData}
                onNearestX={this.onNearestX}
            />

            { /* creates the crosshair for the data point where the cursor is present on the graph */}
            {   this.state.crossValues && 
                <Crosshair 
                    values={[this.state.crossValues]}
                    titleFormat={ (d) => ({ title: 'Time', value: d[0].x.getHours() + ":" + d[0].x.getMinutes() + ":" + d[0].x.getSeconds()}) }
                    itemsFormat={ (d) => [{title: 'Y', value: d[0].y.toFixed(3) }] }   
                />
            }

            { /* plots the question markers on the graph with the question data passed from 'this.props.question' when it isn't null */}
            {   this.props.questions &&  
                this.props.questions.map( (e) => {
                    return <Crosshair values={ [{x: e.x, y: e.question}] }> 
                                <div>
                                    <h3>Q{e.question.substring(10,12)}</h3>
                                </div>
                            </Crosshair> 
                }) 
            } 


        </XYPlot> 
    )    
  }
}

export default Graph;
