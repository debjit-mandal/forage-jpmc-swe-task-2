import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import './App.css';
import Graph from './Graph';

interface IState {
  data: ServerRespond[];
  showGraph: boolean;
}

class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false,
    };
  }

  renderGraph() {
    if (!this.state.showGraph) {
      return (<div>Please click "Start Streaming" to see the graph.</div>);
    }
    return (<Graph data={this.state.data} />);
  }

  getDataFromServer() {
    this.setState({ showGraph: true });
    setInterval(async () => {
      const response = await DataStreamer.getData();
      this.setState({
        data: [...this.state.data, ...response],
      });
    }, 1000); // Fetch every second
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Stock Price Monitor</h1>
        </header>
        <div className="App-content">
          <button className="Stream-button" onClick={() => this.getDataFromServer()}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
