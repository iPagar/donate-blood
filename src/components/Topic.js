import React from "react";
import PropTypes from "prop-types";
import { Cell, Div } from "@vkontakte/vkui";

import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";

class Topic extends React.Component {
  state = {
    visibleText: false,
    icon: (
      <Icon16Dropdown
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      />
    ),
    text: null
  };

  handleTitleClick = e => {
    let icon = (
      <Icon16Dropdown
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transform: "rotate(180deg)"
        }}
      />
    );
    let text = this.props.data.text;

    if (this.state.visibleText) {
      icon = (
        <Icon16Dropdown
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        />
      );

      text = null;
    }

    this.setState({ visibleText: !this.state.visibleText, text, icon });
  };

  showText() {
    const text = this.state.text.map((textData, i) => (
      <Div key={i}>{this.state.text[i]}</Div>
    ));

    return text;
  }

  render() {
    const { title } = this.props.data;
    return (
      <Cell multiline onClick={this.handleTitleClick} size="l">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <b>{title}</b> {this.state.icon}
        </div>
        {this.state.visibleText && <Div>{this.showText()}</Div>}
      </Cell>
    );
  }
}

Topic.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    text: PropTypes.array.isRequired
  })
};

export default Topic;
