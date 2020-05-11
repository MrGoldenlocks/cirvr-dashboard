import React, { Component } from "react";
import SearchForm from "./SearchForm";

class SearchFormFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      database: this.props.database,
      azureContainerID: this.props.azureContainerID,
      gazeContainerID: this.props.gazeContainerID,
      stressContainerID: this.props.stressContainerID,
      logContainerID: this.props.logContainerID,
      azureContainer: this.props.azureContainer,
      gazeContainer: this.props.gazeContainer,
      stressContainer: this.props.stressContainer,
      logContainer: this.props.logContainer,
      selected: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.value !== "") {
      this.setState({
        value: event.target.value,
        selected: true
      });
    }
  }

  render() {
    return (
      <div>
        <div>
          <form>
            <label>
              Search by:
              <select value={this.state.value} onChange={this.handleChange}>
                <option value=""></option>
                <option value="pid">PID</option>
                <option value="question">Question</option>
                <option value="name">Name?</option>
              </select>
            </label>
          </form>
          <div>
            {this.state.selected && (
              <SearchForm
                database={this.state.database}
                azureContainerID={this.state.azureContainerID}
                gazeContainerID={this.state.gazeContainerID}
                stressContainerID={this.state.stressContainerID}
                logContainerID={this.state.logContainerID}
                azureContainer={this.state.azureContainer}
                gazeContainer={this.state.gazeContainer}
                stressContainer={this.state.stressContainer}
                logContainer={this.state.logContainer}
                searchFilter={this.state.value}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default SearchFormFilter;
