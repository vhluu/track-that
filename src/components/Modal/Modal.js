import React, { Component } from 'react';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.setModalRef = this.setModalRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setModalRef(node) {
    this.modalRef = node;
  }

  handleClickOutside(event) {
    const { show, closeSelf } = this.props;
    if (show && this.modalRef && !this.modalRef.contains(event.target)) {
      if (closeSelf) closeSelf(event);
    }
  }

  render() {
    const { show, children, extraClasses } = this.props;
    return (
      <div ref={this.setModalRef} className={`modal card ${extraClasses}${show ? '' : ' hide'}`}>
        { children }
      </div>
    );
  }
}

export default Modal;
