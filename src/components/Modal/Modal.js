import React, { Component } from 'react';
import './Modal.scss';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prevFocusElement: ''
    };

    this.setModalRef = this.setModalRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const { show, onShow } = this.props;
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('keydown', this.handleKeyDown);

    if (show) {
      document.body.classList.add('show-modal');
      if (onShow) onShow();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);

    document.body.classList.remove('show-modal');
  }

  componentDidUpdate(prevProps) {
    const { show, onShow, onHide } = this.props;
    
    if (show && !prevProps.show) { // modal goes from hidden to shown
      this.setState({ prevFocusElement: document.activeElement }); // keep track of last focused element
      document.body.classList.add('show-modal');

      if (onShow) onShow(); // call show event handler if found

    } else if (!show && prevProps.show) {  // modal goes from shown to hidden
      if (onHide) onHide(); // call hide event handler if found

      this.state.prevFocusElement.focus(); // set focus back on last focused element
      document.body.classList.remove('show-modal');
    }
  }

  setModalRef(node) {
    this.modalRef = node;
  }

  /* Closes modal on outside click */
  handleClickOutside(event) {
    const { show, closeSelf } = this.props;

    if (show && this.modalRef && !this.modalRef.contains(event.target)) {
      if (closeSelf) closeSelf(event);
    }
  }

  /* Closes modal on escape key press */
  handleKeyDown(event) {
    const { show, closeSelf } = this.props;
    const ESC_KEY = 27;

    if (show && event.keyCode == ESC_KEY && closeSelf) {
      closeSelf(event);
    }
  }

  render() {
    const { show, children, extraClasses = '' } = this.props;
    return (
      <div ref={this.setModalRef} className={`modal card ${extraClasses}${show ? '' : ' hide'}`}>
        { children }
      </div>
    );
  }
}

export default Modal;
