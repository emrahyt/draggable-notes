import React from "react";
import ReactDOM from "react-dom";
import "./draggableNote.css";
import { Button } from "@material-ui/core";

const maxWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const maxHeight =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

export default class DraggableNote extends React.Component {
  constructor(props) {
    super(props);

    this.dragMouseDown = this.dragMouseDown.bind(this);
    this.elementDrag = this.elementDrag.bind(this);
    this.closeDragElement = this.closeDragElement.bind(this);
    this.resizeMouseDown = this.resizeMouseDown.bind(this);
    this.contentResize = this.contentResize.bind(this);
    this.closeResizeContent = this.closeResizeContent.bind(this);
    this.contentChange = this.contentChange.bind(this);
    this.updateContentSize = this.updateContentSize.bind(this);
  }

  updateContentSize() {
    this.content.style.width = `${this.root.offsetWidth}px`;
    const height = this.root.offsetHeight - this.header.offsetHeight;
    this.content.style.height = `${height}px`;
  }

  componentDidUpdate() {
    this.updateContentSize();
  }

  componentDidMount() {
    this.root = ReactDOM.findDOMNode(this);
    this.content = this.root.querySelector(".content");
    this.header = this.root.querySelector(".header");
    this.updateContentSize();
    this.header.addEventListener("mousedown", this.dragMouseDown);
    this.content.addEventListener("mousedown", this.resizeMouseDown);
  }

  componentWillUnmount() {
    this.header.removeEventListener("mousedown", this.dragMouseDown);
    this.content.removeEventListener("mousedown", this.resizeMouseDown);
  }

  dragMouseDown(e) {
    e.preventDefault();
    this.startX = e.clientX;
    this.startY = e.clientY;

    window.addEventListener("mousemove", this.elementDrag);
    window.addEventListener("mouseup", this.closeDragElement);
  }

  elementDrag(e) {
    e.preventDefault();

    const deltaX = this.startX - e.clientX;
    const deltaY = this.startY - e.clientY;
    const newTop = this.root.offsetTop - deltaY;
    const newLeft = this.root.offsetLeft - deltaX;
    const newRight = newLeft + this.root.offsetWidth;
    const newBottom = newTop + this.root.offsetHeight;

    let left = this.root.style.left;
    let top = this.root.style.top;

    if (
      newLeft >= 0 &&
      newLeft <= maxWidth &&
      newRight >= 0 &&
      newRight <= maxWidth
    ) {
      this.startX = e.clientX;
      left = newLeft;
    }

    if (
      newTop >= 0 &&
      newTop <= maxHeight &&
      newBottom >= 0 &&
      newBottom <= maxHeight
    ) {
      this.startY = e.clientY;
      top = newTop;
    }

    this.root.style.left = `${left}px`;
    this.root.style.top = `${top}px`;

    if (this.props.handleDataChange) {
      this.props.handleDataChange(this.props.id, { left, top });
    }
  }

  closeDragElement() {
    window.removeEventListener("mouseup", this.closeDragElement);
    window.removeEventListener("mousemove", this.elementDrag);
  }

  resizeMouseDown() {
    window.addEventListener("mousemove", this.contentResize);
    window.addEventListener("mouseup", this.closeResizeContent);
  }

  contentResize() {
    const width = this.content.offsetWidth;
    const height = this.content.offsetHeight + this.header.offsetHeight;

    this.root.style.width = `${width}px`;
    this.root.style.height = `${height}px`;

    if (this.props.handleDataChange) {
      this.props.handleDataChange(this.props.id, { width, height });
    }
  }

  closeResizeContent() {
    window.removeEventListener("mouseup", this.closeResizeContent);
    window.removeEventListener("mousemove", this.contentResize);
  }

  contentChange(event) {
    if (this.props.handleDataChange)
      this.props.handleDataChange(this.props.id, {
        content: event.target.value,
      });
  }

  render() {
    const title = this.props.title || "Click here to add title";
    const elemStyle = {
      width: `${this.props.width || 300}px`,
      height: `${this.props.height || 300}px`,
      top: `${this.props.top || 0}px`,
      left: `${this.props.left || 0}px`,
    };

    if (this.props.zIndex !== undefined) {
      elemStyle.zIndex = this.props.zIndex;
    }

    return (
      <div
        className={
          this.props.animationId === this.props.id
            ? this.props.animation
              ? "item-fadeout"
              : "lp-draggable-note"
            : "lp-draggable-note"
        }
        style={elemStyle}
      >
        <div className="header" style={{ backgroundColor: "#FDFFB6" }}>
          {title}
        </div>
        {this.props.imageSrc && (
          <div style={{backgroundColor: this.props.color}}>
          <img
            style={{marginTop: 10}}
            src={this.props.imageSrc}
            alt="image"
            width="380px"
            height="200px"
          />
          </div>
        )}
        {this.props.handleDataChange ? (
          <textarea
            className="content"
            value={this.props.content}
            spellCheck="false"
            onChange={this.contentChange}
            style={{ backgroundColor: this.props.color }}
          />
        ) : (
          <textarea
            className="content"
            defaultValue={this.props.content}
            spellCheck="false"
            style={{ backgroundColor: this.props.color }}
          />
        )}

        <Button
          variant="outlined"
          onClick={() => this.props.imageSrc ? this.props.deleteImage(this.props.id) : this.props.handleImageDialog(this.props.id)}
          style={{
            width: 120,
            height: 40,
            border: "1px solid black",
            backgroundColor: "black",
            color: "white",
            textTransform: "capitalize",
            marginTop: -100,
          }}
        >
         { this.props.imageSrc ?  'Delete Image' : 'Add Image'}
        </Button>
      </div>
    );
  }
}
