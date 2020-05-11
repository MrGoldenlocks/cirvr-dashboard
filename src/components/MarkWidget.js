import React, { Component } from "react";

//Import styling
import "../styles/MarkGraph.css";

class MarkWidget extends Component {
  constructor(props) {
    super(props);

    // make grid elements span multiple rows/columns
    this.spanStyles = {};
    if (props.colspan !== 1) {
      this.spanStyles.gridColumn = `span ${props.colspan}`;
    }
    if (props.rowspan !== 1) {
      this.spanStyles.gridRow = `span ${props.rowspan}`;
    }
  }

  render() {
    return (
      <div style={this.spanStyles} className="Widget">
        <div className="MarkGraph">{this.props.children}</div>
      </div>
    );
  }
}

// default settings
MarkWidget.defaultProps = {
  colspan: 1,
  rowspan: 1,
};

// props to send to this component
MarkWidget.propTypes = {
  colspan: React.PropTypes.number,
  rowspan: React.PropTypes.number,
  //children: React.PropTypes.element.isRequired
};

export default MarkWidget;
