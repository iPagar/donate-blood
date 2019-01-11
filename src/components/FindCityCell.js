import React from "react";
import PropTypes from "prop-types";
import DataManager from "../services/DataManager";
import { Cell } from "@vkontakte/vkui";

class FindCityCell extends React.Component {
  onClick = () => {
    DataManager.setCity(this.props.data);
  };

  render() {
    let description;
    if (this.props.data.region) description = this.props.data.region.title;
    return (
      <Cell description={description} onClick={this.onClick}>
        {!description && (
          <div style={{ lineHeight: "39px" }}>{this.props.data.title}</div>
        )}
        {description && this.props.data.title}
      </Cell>
    );
  }
}

FindCityCell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired
  })
};

export default FindCityCell;
