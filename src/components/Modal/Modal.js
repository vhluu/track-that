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
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    const { show, children } = this.props;
    
    // focus on modal content on show
    if (show && !prevProps.show) {
      this.setState({ prevFocusElement: document.activeElement });
      
      if (children) { // focus on first child
        const firstChild = children[0] ? children[0] : children;
        if (firstChild.ref && firstChild.ref.current.setFocus) {
          firstChild.ref.current.setFocus();
        }
      }
      document.body.classList.add('show-modal');

    } else if (!show && prevProps.show) {
      this.state.prevFocusElement.focus();
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
