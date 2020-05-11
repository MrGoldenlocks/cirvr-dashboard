import React from "react";
import { XYPlot, MarkSeries, Crosshair } from "react-vis";
import "../styles/MarkGraph.css";
import "../react-vis/dist/style.css";

class MarkGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crossValues: false,
      graphData: this.props.graphData,
      questionResults: null,
    };

    this.onNearestX = this.onNearestX.bind(this);
  }

  onNearestX(value) {
    this.setState({ crossValues: { x: value.x, y: value.y } });
  }

  render() {
    /*
      let q = [];
      if(this.props.questions != null) {
          this.props.questions.forEach(e =>
              q.push(
                  <Crosshair 
                      values={[ {x: e.x, y: 0} ]}
                      titleFormat={ (d) => ({ title: d[0].question }) }
                      itemsFormat={ (d) => [{title: 'Time', value: d[0].x}] }   
                  />
              )
          )
      }
      */

    /*
      console.log(this.props.questions);
  
      let questions;
      
      if(this.props.questions != null) {
          questions = this.props.questions.map(e =>
              <Crosshair 
              values={[ {x: e.x, y: 0} ]}
              titleFormat={ (d) => ({ title: d[0].question }) }
              itemsFormat={ (d) => [{title: 'Time', value: d[0].x}] }   
              />
          )
      }
      */

    return (
      <XYPlot
        height={this.props.height_param}
        width={this.props.width_param}
        stroke="red"
        fill="red"
        yDomain={[0, 1]}
        xDomain={[0, 1]}
        size={1}
        onMouseLeave={() => this.setState({ crossValues: false })}
      >
        <MarkSeries data={this.props.graphData} onNearestX={this.onNearestX} />

        {this.state.crossValues && (
          <Crosshair
            values={[this.state.crossValues]}
            itemsFormat={(d) => [{ title: "X", value: d[0].x }]}
            itemsFormat={(d) => [{ title: "Y", value: d[0].y }]}
          />
        )}

        {/*this.state.questionResults &&
                  <Crosshair
                      values={ this.state.questionResults }//.map(e => ({x: e.x, y: 0}) ) }
                      //titleFormat={ (d) => ({ title: d[0].question }) }
                      //itemsFormat={ (d) => [{title: 'Time', value: d[0].x}] }  
                  />
              */}

        {/*this.props.questions.map(e =>
                  <Crosshair 
                  values={[ {x: e.x, y: 0} ]}
                  titleFormat={ (d) => ({ title: d[0].question }) }
                  itemsFormat={ (d) => [{title: 'Time', value: d[0].x}] }   
                  />
              )*/}
      </XYPlot>
    );
  }
}

export default MarkGraph;
