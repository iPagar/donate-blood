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
    // e.currentTarget.children[0].className = `Tappable Tappable--ios Cell__in Tappable--inactive`;
    // console.log(e.currentTarget.children[0].className);
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
      <div>
        <Cell multiline size="l" onClick={this.handleTitleClick}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <b>{title}</b> {this.state.icon}
          </div>
        </Cell>
        {this.state.visibleText && this.showText()}
      </div>
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
