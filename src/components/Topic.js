import React from "react";
import PropTypes from "prop-types";
import { Cell, Div } from "@vkontakte/vkui";

class Topic extends React.Component {
  state = {
    visibleText: false
  };

  handleTitleClick = e => {
    e.preventDefault();
    if (this.state.visible) this.setState({ visible: false });
    else this.setState({ visible: true });
  };

  render() {
    const { title, text } = this.props.data;
    const { visible } = this.state;
    return (
      <Cell multiline onClick={this.handleTitleClick}>
        <b>{title}</b>
        {visible && <Div>{text}</Div>}
      </Cell>
    );
  }
}

Topic.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })
};

export default Topic;
