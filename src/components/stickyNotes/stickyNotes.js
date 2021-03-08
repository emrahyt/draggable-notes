import React from "react";
import "./stickyNotes.css";
import DraggableNote from "../draggableNote/draggableNote";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ImageUpload from "./imageUpload";

function getOffset(el) {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

export default class StickyNotes extends React.Component {
  constructor(props) {
    super(props);

    this.initialStateForEachNote = {
      width: this.props.width || 300,
      height: this.props.height || 300,
      top: this.props.top || 0,
      left: this.props.left || 0,
      content: this.props.content || "",
      image: null,
      color: null,
    };

    this.count = 0;

    this.state = {
      activeId: this.count,
      notes: [this.initNoteData()],
      id: null,
      open: false,
      title: "Click here to change title",
      content: null,
      updated: false,
      animation: null,
      animationId: null,
      imageDialog: false,
      imageId: null,
    };

    this.initNoteData = this.initNoteData.bind(this);
    this.onAddNote = this.onAddNote.bind(this);
    this.onRemoveNote = this.onRemoveNote.bind(this);
    this.makeActive = this.makeActive.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.dialogClose = this.dialogClose.bind(this);
    this.dialogOpen = this.dialogOpen.bind(this);
    this.handleImageDialog = this.handleImageDialog.bind(this);
    this.imageDialogClose = this.imageDialogClose.bind(this);
    this.setBg = this.setBg.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this)
  }

  initNoteData(offset) {
    const noteData = {
      ...this.initialStateForEachNote,
      id: Math.random(),
      title: this.state?.title,
      color: this.setBg(),
    };
    if (offset) {
      noteData.top = offset.top + 20;
      noteData.left = offset.left + 20;
    }
    return noteData;
  }

  componentDidMount() {
    let notes = JSON.parse(localStorage.getItem("notes"));
    if (notes && notes.length > 0) {
      return;
    } else {
      localStorage.setItem("notes", JSON.stringify([this.initNoteData()]));
    }
  }

  onAddNote(event) {
    event.stopPropagation();

    const offset = getOffset(event.target);
    const noteData = this.initNoteData(offset);
    this.handleAddLocalStorage(noteData);
    this.setState((state) => {
      return {
        activeId: noteData.id,
        // notes: [...state.notes, noteData],
      };
    });
  }

  handleAddLocalStorage(data) {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    const newNotes = [...oldNotes, data];
    localStorage.setItem("notes", JSON.stringify(newNotes));
  }

  handleUpdateLocalStorage(id) {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    const remainNotes = [...oldNotes].filter((note) => {
      return note.id !== id;
    });
    localStorage.setItem("notes", JSON.stringify(remainNotes));
    this.setState({ updated: !this.state.updated });
  }

  handleAnimatedDelete(id) {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    if (oldNotes.length === 1) return;
    this.setState({ animation: true, animationId: id });
    setTimeout(
      function () {
        this.onRemoveNote(id);
      }.bind(this),
      1000
    );
  }

  onRemoveNote(id) {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    if (oldNotes.length === 1) return;
    this.handleUpdateLocalStorage(id);
    this.setState((state) => {
      const remainNotes = [...oldNotes].filter((note) => {
        return note.id !== id;
      });
      return {
        activeId: remainNotes[remainNotes.length - 1].id,
        // notes: remainNotes,
      };
    });
  }

  makeActive(id) {
    if (this.state.activeId !== id) {
      this.setState({
        activeId: id,
      });
    }
  }

  onRemoveImage(id) {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    const newNotes = [...oldNotes].map((note) => {
        if (note.id === id) {
           note.image = null;          
        }
        return note;
      });
    localStorage.setItem("notes", JSON.stringify(newNotes));
    this.setState({ updated: !this.state.updated });    
  }

  handleDataChange(id, data) {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    const newNotes = [...oldNotes].map((note) => {
      if (note.id === id) {
        if (data.width !== undefined) note.width = data.width;
        if (data.height !== undefined) note.height = data.height;
        if (data.top !== undefined) note.top = data.top;
        if (data.left !== undefined) note.left = data.left;
        if (data.content !== undefined) note.content = data.content;
      }
      return note;
    });
    localStorage.setItem("notes", JSON.stringify(newNotes));
    this.setState({ content: data.content });
  }

  handleTitleChange(event) {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    const newNotes = [...oldNotes].map((note) => {
      if (note.id === this.state.id) {
        if (event.target.value !== undefined) note.title = event.target.value;
      }
      return note;
    });
    localStorage.setItem("notes", JSON.stringify(newNotes));
    this.setState({ updated: !this.state.updated });
  }

  showImage(id, url) {
    const oldNotes = JSON.parse(localStorage.getItem("notes"));
    const newNotes = [...oldNotes].map((note) => {
      if (note.id === id) {
        if (url !== undefined) note.image = url;
      }
      return note;
    });
    localStorage.setItem("notes", JSON.stringify(newNotes));
    this.setState({ updated: !this.state.updated });
  }

  dialogOpen(id) {
    this.setState({ id, open: true });
  }

  dialogClose() {
    this.setState({ open: false });
  }

  imageDialogClose() {
    this.setState({ imageDialog: false, imageId: null });
  }

  handleImageDialog(id) {
    this.setState({ imageDialog: true, imageId: id });
  }

  setBg = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    let backgroundColor = "#" + randomColor;
    return backgroundColor;
  };

  render() {
    const header = (title, id) => (
      <div className="lp-sticky-notes-header">
        <span className="add" onClick={this.onAddNote}>
          +
        </span>
        <span onClick={() => this.dialogOpen(id)}>
          {title ? title : "Click here to change title"}
        </span>
        <span className="remove" onClick={() => this.handleAnimatedDelete(id)}>
          x
        </span>
      </div>
    );

    const notesLS = JSON.parse(localStorage.getItem("notes"));

    return (
      <React.Fragment>
        {notesLS &&
          notesLS.map((note, index) => {
            return (
              <div onClick={() => this.makeActive(note.id)} key={index}>
                <DraggableNote
                  title={header(note.title, note.id)}
                  width={note.width}
                  height={note.height}
                  top={note.top}
                  left={note.left}
                  content={note.content}
                  zIndex={note.id === this.state.activeId ? 1 : 0}
                  id={note.id}
                  imageSrc={note.image}
                  color={note.color}
                  handleDataChange={this.handleDataChange}
                  animation={this.state.animation}
                  animationId={this.state.animationId}
                  handleImageDialog={this.handleImageDialog.bind(this)}
                  deleteImage={this.onRemoveImage}
                />
              </div>
            );
          })}
        <Dialog open={this.state.open} onClose={this.dialogClose}>
          <div
            style={{
              width: 400,
              height: 170,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 0,
            }}
          >
            <TextField
              variant="outlined"
              label="Title"
              style={{ width: 300, height: 50, marginBottom: 20 }}
              onChange={(event) => this.handleTitleChange(event)}
            />
            <Button
              onClick={() => this.dialogClose()}
              variant="contained"
              style={{
                width: 80,
                height: 40,
                textTransform: "capitalize",
                backgroundColor: "#06D6A0",
              }}
            >
              Add
            </Button>
          </div>
        </Dialog>
        <Dialog open={this.state.imageDialog} onClose={this.imageDialogClose}>
          <div
            style={{
              width: 500,
              height: 400,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 0,
            }}
          >
            <ImageUpload
              id={this.state.imageId}
              showImage={this.showImage.bind(this)}
              closeDialog={this.imageDialogClose}
            />
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}
