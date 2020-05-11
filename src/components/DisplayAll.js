import React, { Component } from "react";
import "../styles/DisplayAll.css";

class DisplayAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      azureContainerID: this.props.azureContainerID,
      azureContainer: this.props.azureContainer,
      allResults: null
    };

    this.displayData = this.displayData.bind(this);
  }

  async displayData() {
    if (!this.state.azureContainer) {
      throw new Error("Collection is not initialized.");
    }
    const query =
      "SELECT DISTINCT a.PID FROM " + this.state.azureContainerID + " a";
    const { resources } = await this.state.azureContainer.items
      .query(query)
      .fetchAll();
    const listItems = resources.map(item => (
      <li className="ListItem" key={item.PID}>
        {item.PID}
      </li>
    ));
    this.setState({ allResults: listItems });
  }

  render() {
    return (
      <div className="split left">
        <div className="centered-left">
          <button className="Display-All-Button" onClick={this.displayData}>
            Display All PIDs
          </button>
          <ul className="List">{this.state.allResults}</ul>
        </div>
      </div>
    );
  }
}

export default DisplayAll;
