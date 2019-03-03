import React from "react";
import PropTypes from "prop-types";
const suffix = "react-DragCrop";
import "./style.scss";
class ReactDragCrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
    };
  }
  handleImageDrag = ev => {
      
  };
  render() {
    const { position } = this.state;
    return (
      <div className={`${suffix}-container`}>
        <img
          src={this.props.src}
          draggable="true"
          style={{
            top: position.top,
            left: 0
          }}
          onDragStart={ev => {
            ev.preventDefault();
            position.top = -ev.clientY;
            position.left = this.setState({ position });
            console.log(ev.clientX);
          }}
        />
        {/* <div className="overlay" /> */}
        {/* <div className="crop-window" /> */}
      </div>
    );
  }
}
ReactDragCrop.propTypes = {
  src: PropTypes.string.isRequired,
  circular: PropTypes.bool.isRequired
};
export default ReactDragCrop;
