import React from "react";
import "../styles/PopupView.css";

import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";

class PopupView extends React.Component {
	state = { isActive: true };
	popupBlock = React.createRef();

	render() {
		const { isActive } = this.state;
		const { children, title, onClose, bottom } = this.props;
		return (
			<React.Fragment>
				{isActive && (
					<div className="PopupBlock Show" ref={this.popupBlock}>
						<div className="PopupView">
							<div className="PopupHeader">
								<div className="PopupHeaderText">{title}</div>
								<div
									className="PopupHeaderClose"
									onClick={() => {
										this.popupBlock.current.classList.remove(
											"Show"
										);
										this.popupBlock.current.classList.add(
											"Hide"
										);
										this.setState({ isActive: false });
										onClose();
									}}
								>
									<Icon24Cancel />
								</div>
							</div>
							<div className="PopupContent">{children}</div>
							<div className="PopupBottom">{bottom}</div>
						</div>
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default PopupView;
