import React, { Component } from "react";
import "../styles/SearchForm.css";

const AZURE_QUERY_DATA =
  "a.TimeStamp, 'a.FaceRectangle - top', 'a.FaceRectangle - left', 'a.FaceRectangle - width', " +
  "'a.FaceRectangle - height', a.Smile, a.HeadPitch, a.HeadRoll, a.HeadYaw, a.Gender, a.Age, a.Glasses, a.Anger, " +
  "a.Contempt, a.Disgust, a.Fear, a.Happiness, a.Neutral, a.Sadness, a.Surprise, a.PID";

const GAZE_QUERY_DATA = "g.ts, g.X, g.Y, g.viewedObjects, g.Question, g.PID";

const STRESS_QUERY_DATA = "s.Time, s.Stress, s.PID";

class SearchForm extends Component {
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
      searchFilter: this.props.searchFilter,
      azureResults: null,
      gazeResults: null,
      stressResults: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.computeValenceVal = this.computeValenceVal.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.find(this.state.value);
  }

  componentWillReceiveProps(props) {
    const { searchFilter } = this.props;
    if (props.searchFilter !== searchFilter) {
      this.setState({
        value: "",
        searchFilter: props.searchFilter,
        azureResults: null,
        gazeResults: null,
        stressResults: null
      });
    }
  }

  // use Object.keys(<varName>.resources) for length of set of data
  async find(querySpec) {
    if (
      !this.state.azureContainer ||
      !this.state.gazeContainer ||
      !this.state.stressContainer
    ) {
      throw new Error("Collection is not initialized.");
    }

    if (this.state.searchFilter === "pid") {
      const azureQuery =
        "SELECT " +
        AZURE_QUERY_DATA +
        " FROM " +
        this.state.azureContainerID +
        ' a WHERE a.PID = "' +
        querySpec +
        '"';
      const gazeQuery =
        "SELECT " +
        GAZE_QUERY_DATA +
        " FROM " +
        this.state.gazeContainerID +
        ' g WHERE g.PID = "' +
        querySpec +
        '"';
      const stressQuery =
        "SELECT " +
        STRESS_QUERY_DATA +
        " FROM " +
        this.state.stressContainerID +
        ' s WHERE s.PID = "' +
        querySpec +
        '"';

      const { azureData, gazeData, stressData } = {
        azureData: await this.state.azureContainer.items
          .query(azureQuery)
          .fetchAll(),
        gazeData: await this.state.gazeContainer.items
          .query(gazeQuery)
          .fetchAll(),
        stressData: await this.state.stressContainer.items
          .query(stressQuery)
          .fetchAll()
      };

      // Timestamp: {item.TimeStamp}, Valence Value: {this.computeValenceVal(item)}
      const azureListItems = azureData.resources.map(item => (
        <li className="ListItem" key={item.TimeStamp}>
          {JSON.stringify(item)}
        </li>
      ));

      const gazeListItems = gazeData.resources.map(item => (
        <li className="ListItem" key={item.ts}>
          {JSON.stringify(item)}
        </li>
      ));

      const stressListItems = stressData.resources.map(item => (
        <li className="ListItem" key={item.Time}>
          {JSON.stringify(item)}
        </li>
      ));

      this.setState({
        azureResults: azureListItems,
        gazeResults: gazeListItems,
        stressResults: stressListItems
      });
    } else if (this.state.searchFilter === "question") {
    }
  }

  computeValenceVal(item) {
    return (
      0.5 +
      0.5 * item.Happiness -
      0.5 *
        (item.Anger +
          item.Contempt +
          item.Disgust +
          item.Fear +
          item.Sadness +
          item.Suprise)
    );
  }

  render() {
    return (
      <div>
        <br></br>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Search" />
        </form>
        <ul className="List">{this.state.azureResults}</ul>
        <ul className="List">{this.state.gazeResults}</ul>
        <ul className="List">{this.state.stressResults}</ul>
      </div>
    );
  }
}

export default SearchForm;
