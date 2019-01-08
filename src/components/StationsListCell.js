import React from "react";
import PropTypes from "prop-types";
import { Cell } from "@vkontakte/vkui";

import Icon24Chevron from "@vkontakte/icons/dist/24/chevron";

const maxDist = 200;

class StationsListCell extends React.Component {
  showLength() {
    let dist = this.props.data.dist;
    if (dist < 1) {
      dist = dist * 1000 + " м";
    } else dist = Math.round(dist).toFixed() + " км";

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "space-between",
          alignItems: "center"
        }}
      >
        {this.props.data.dist <= maxDist && (
          <div style={{ display: "inline-block" }}>{dist}</div>
        )}
        <Icon24Chevron
          class="Cell__chevron"
          style={{ display: "inline-block" }}
        />
      </div>
    );
  }

  render() {
    return (
      <Cell
        multiline
        description={this.props.data.address}
        asideContent={this.showLength()}
        onClick={() => this.props.city(this.props.data)}
        size="l"
      >
        <b>{this.props.data.title}</b>
      </Cell>
    );
  }
}

StationsListCell.propTypes = {
  data: PropTypes.shape({
    address: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })
};

export default StationsListCell;
