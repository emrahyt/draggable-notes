import React, { Component } from "react";
import Resizer from "react-image-file-resizer";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      imagePreviewUrl: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resizeFile = this.resizeFile.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        380,
        200,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  onChange = async (event) => {
    try {
      const file = event.target.files[0];
      const image = await this.resizeFile(file);
      this.setState({
        file: file,
        imagePreviewUrl: image,
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.showImage(this.props.id, this.state.imagePreviewUrl);
    this.props.closeDialog();
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = <img src={imagePreviewUrl} />;
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit} style={{ marginBottom: 20 }}>
          <input type="file" onChange={this.onChange} />
          <button type="submit" onClick={this.handleSubmit}>
            Upload Image
          </button>
        </form>
        <div
          style={{
            width: "auto",
            height: "auto",
            border: imagePreviewUrl ? "1px solid black" : null,
          }}
        >
          {$imagePreview}
        </div>
      </div>
    );
  }
}

export default ImageUpload;
