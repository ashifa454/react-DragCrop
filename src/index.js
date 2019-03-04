import React from "react";
import PropTypes from "prop-types";
import interact from "interactjs";
const suffix = "react-DragCrop";
import "./style.scss";
class ReactDragCrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: "P",
      resultImageURL: "",
      croppedFile: ""
    };
    //    this.preProcessImage();
  }
  componentDidMount() {
    interact("img").draggable({
      inertia: true,
      onmove: this.dragHandler,
      onend: this.cropHandler
    });
    // .pointerEvents({
    //   allowFrom: ""
    // });
  }
  cropHandler = event => {
    const position = this.getImagePosition(event);
    this.getCroppedImg(position).then(fileUrl => {
      console.log(fileUrl);
      this.setState({
        resultImageURL: fileUrl
      });
    });
  };
  /**
   * Get Dragged Image Position
   */
  getImagePosition = event => {
    const x = Math.abs(
      Math.round(parseFloat(event.target.getAttribute("data-x"))) || 0
    );
    const y = Math.abs(
      Math.round(parseFloat(event.target.getAttribute("data-y"))) || 0
    );
    return {
      x,
      y
    };
  };
  getCroppedImg = pixelDimension =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.src = `${this.props.src}?t=${new Date().getTime()}`;
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        const aspectRatio = image.naturalWidth / image.naturalHeight;
        const imageHeight = 500;
        const imageWidth = aspectRatio * imageHeight;
        const posX = (1 / (imageWidth / pixelDimension.x)) * image.naturalWidth;
        const posY =
          (1 / (imageHeight / pixelDimension.y)) * image.naturalHeight;
        console.log(pixelDimension, posX, posY);
        /**
         * Starting x in image
         * Starting y in image
         * Width from X
         * Width from Y
         * 0
         * 0
         * Resize Canvas X
         *  Resize Canvas Y
         */
        const canvas = document.createElement("canvas");
        canvas.height = imageHeight;
        canvas.width = imageWidth;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          posX,
          posY,
          1330,
          image.naturalHeight,
          0,
          0,
          500,
          500
        );
        canvas.toBlob(blob => {
          const fileUrl = window.URL.createObjectURL(blob);
          const file = new File([blob], "abc.png");
          file.preview = fileUrl;
          resolve(file);
        }, "image/png");
      };
      // const image = new Image();
      // image.src = `${this.props.src}?t=${new Date().getTime()}`;
      // image.crossOrigin = "Anonymous";
      // image.onload = () => {
      //   /**
      //    * change this logic for orientation of image
      //    */
      //   const aR = image.naturalWidth / image.naturalHeight;
      //   const width = aR * image.naturalHeight;
      //   const height = image.naturalHeight;
      //   const canvas = document.createElement("canvas");
      //   canvas.height = height;
      //   canvas.width = width;
      //   const ctx = canvas.getContext("2d");
      //   ctx.drawImage(
      //     image,
      //     pixelDimension.x,
      //     pixelDimension.y,
      //     0,
      //     0,
      //     width,
      //     height
      //   );
      //   canvas.toBlob(blob => {
      //     const fileUrl = window.URL.createObjectURL(blob);
      //     const file = new File([blob], "abc.png");
      //     file.preview = fileUrl;
      //     resolve(file);
      //   }, "image/png");
      // };
    });
  preProcessImage = () => {
    const { src } = this.props;
    let { orientation } = this.state;
    const image = new Image();
    image.src = `${src}?t=${new Date().getTime()}`;
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      if (image.naturalHeight > image.naturalWidth) {
        orientation = "P";
      } else if (image.naturalHeight < image.naturalWidth) {
        orientation = "L";
      } else {
        orientation = "S";
      }
      this.setState({ orientation });
    };
  };

  dragHandler = event => {
    const target = event.target;

    if (this.state.orientation === "P") {
      const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      if (x < 0 && x > -250) {
        target.style.webkitTransform = target.style.transform =
          "translate(" + x + "px)";
        target.setAttribute("data-x", x);
      }
    } else if (this.state.orientation === "L") {
      const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
      target.style.webkitTransform = target.style.transform =
        "translate(" + y + "px)";
      target.setAttribute("data-y", y);
    }
  };
  render() {
    return (
      <React.Fragment>
        <div className={`${suffix}-container`}>
          <img src={this.props.src} height={500} />
          <div className="overlay" />
          {/* <div className="crop-window" /> */}
        </div>
        <img src={this.state.resultImageURL.preview} />
      </React.Fragment>
    );
  }
}
ReactDragCrop.propTypes = {
  src: PropTypes.string.isRequired,
  circular: PropTypes.bool.isRequired,
  crop: PropTypes.shape({
    aspect: PropTypes.number
  })
};
export default ReactDragCrop;
