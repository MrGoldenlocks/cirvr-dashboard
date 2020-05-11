import { host, authKey } from "./environment.js";
import React from "react";

const { CosmosClient } = require("@azure/cosmos");

//Following are the attributes wanted from Querying the database from each Container :

const AZURE_QUERY_DATA =
  "a.TimeStamp, 'a.FaceRectangle - top', 'a.FaceRectangle - left', 'a.FaceRectangle - width', " +
  "'a.FaceRectangle - height', a.Smile, a.HeadPitch, a.HeadRoll, a.HeadYaw, a.Gender, a.Age, a.Glasses, a.Anger, " +
  "a.Contempt, a.Disgust, a.Fear, a.Happiness, a.Neutral, a.Sadness, a.Surprise, a.PID";

const GAZE_QUERY_DATA = "g.ts, g.X, g.Y, g.viewedObjects, g.Question, g.PID";

const STRESS_QUERY_DATA = "s.Time, s.Stress, s.PID";

const LOGFILES_QUERY_DATA = "l.timestamp, l.text, l.type, l.pid";

class Database extends React.Component {
  constructor() {
    super();
    this.state = {
      status: "",

      client: new CosmosClient({
        endpoint: host,
        key: authKey,
      }),

      databaseID: "cirvrdb",
      azureContainerID: "AzureData",
      gazeContainerID: "GazeData",
      stressContainerID: "StressData",
      logContainerID: "LogFiles",

      database: null,
      azureContainer: null,
      gazeContainer: null,
      stressContainer: null,
      logContainer: null,

      azureResults: null,
      gazeResults: null,
      stressResults: null,
      logResults: null,

      queryValue: null
    };

    this.connect = this.connect.bind(this);
    this.init = this.init.bind(this);
    this.getPidInfo = this.getPidInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.connect();
  }

  connect() {
    console.log("Initiated Connect Function..");

    this.setState({ status: "Attempting to connect..." });
    this.init((err) => {
      console.error(err);
    }).catch((err) => {
      console.error(err);
      console.error(
        "Shutting down because there was an error setting up the database."
      );
      this.setState({ status: "Failed to connect." });
    });
  }

  async init() {
    const dbResponse = await this.state.client.databases.createIfNotExists({
      id: this.state.databaseID
    });

    const azureCoResponse = await dbResponse.database.containers.createIfNotExists({
        id: this.state.azureContainerID
    });

    const gazeCoResponse = await dbResponse.database.containers.createIfNotExists({
        id: this.state.gazeContainerID
    });

    const stressCoResponse = await dbResponse.database.containers.createIfNotExists({
        id: this.state.stressContainerID
    });

    const logCoResponse = await dbResponse.database.containers.createIfNotExists({
        id: this.state.logContainerID
    });

    this.setState({
      status: "Successfully connected to CosmosDB.",
      database: dbResponse.database,
      azureContainer: azureCoResponse.container,
      gazeContainer: gazeCoResponse.container,
      stressContainer: stressCoResponse.container,
      logContainer: logCoResponse.container,
    });

    console.log(this.state.status);
  }

  async getPidInfo(querySpec) {
    if (!this.state.azureContainer || !this.state.gazeContainer || !this.state.stressContainer || !this.state.logContainer) {
        throw new Error('Collection is not initialized.');
    }

    const azureQuery = "SELECT " + AZURE_QUERY_DATA + " FROM " + this.state.azureContainerID + " a WHERE a.PID = \"" + querySpec + "\"";
    const gazeQuery = "SELECT " + GAZE_QUERY_DATA + " FROM " + this.state.gazeContainerID + " g WHERE g.PID = \"" + querySpec + "\"";
    const stressQuery = "SELECT " + STRESS_QUERY_DATA + " FROM " + this.state.stressContainerID + " s WHERE s.PID = \"" + querySpec + "\"";
    const logFilesQuery = "SELECT " + LOGFILES_QUERY_DATA + " FROM " + this.state.stressContainerID + " l WHERE l.PID = \"" + querySpec + "\"";

    try {
      const { azureData, gazeData, stressData, logData } = ({ 
          azureData: await this.state.azureContainer.items.query(azureQuery).fetchAll(), 
          gazeData: await this.state.gazeContainer.items.query(gazeQuery).fetchAll(),
          stressData: await this.state.stressContainer.items.query(stressQuery).fetchAll(),
          logData: await this.state.logContainer.items.query(logFilesQuery).fetchAll(),
      });

      this.setState({
          azureResults: azureData,
          gazeResults: gazeData,
          stressResults: stressData,
          logResults: logData,
      });

      console.log("Sending Data to App.js");

      this.props.sendData(this.state.azureResults, this.state.gazeResults, this.state.stressResults, this.state.logResults);
    }
    catch(err) {
      console.log("Could not find PID.");
    }
  }

  handleChange(e) {
    this.setState({queryValue: e.target.value});
  } 

  handleSubmit(e) {
      e.preventDefault();
      this.getPidInfo(this.state.queryValue);
  }

  render() {
    return (
      <div>
        <label>
          Choose PID
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Search"/>
          </form>
        </label>
      </div>
    );
  }
}

export default Database;
