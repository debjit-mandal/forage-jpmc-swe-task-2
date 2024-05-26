import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

interface IProps {
  data: ServerRespond[];
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      timestamp: 'string',
    };

    const table = window.perspective.worker().table(schema);
    elem.load(table);

    elem.setAttribute('view', 'y_line');
    elem.setAttribute('column-pivots', '["stock"]');
    elem.setAttribute('row-pivots', '["timestamp"]');
    elem.setAttribute('columns', '["top_ask_price"]');
    elem.setAttribute('aggregates', '{"stock":"distinct count","top_ask_price":"avg","timestamp":"distinct count"}');

    this.table = table;
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        this.props.data.map((el: any) => {
          return {
            stock: el.stock,
            top_ask_price: el.top_ask && el.top_ask.price,
            timestamp: el.timestamp,
          };
        }),
      ]);
    }
  }
}

export default Graph;
