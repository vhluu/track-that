import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import TagForm from '../../components/TagForm/TagForm';
import TagList from '../../components/TagList/TagList';
import './TagsContainer.scss';

import * as actions from '../../store/actions/index';

class TagsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'create',
      selectedTag: null,
      showModal: false,
      showSignIn: false,
    };

    this.closeTagModal = this.closeTagModal.bind(this);
    this.closeSignInModal = this.closeSignInModal.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  /* Toggles the tag modal, taking the tag that was clicked on as the parameter */
  toggleTagModal(tag) {
    const { uid } = this.props;

    if (!uid) {
      this.setState({
        showSignIn: true,
      });
      return;
    }

    if (tag) { // if a tag was clicked on, show the 'update' tag modal
      this.setState((prevState) => ({
        action: 'update',
        selectedTag: tag,
        showModal: (prevState.action === 'update' && (prevState.selectedTag.id === tag.id)) ? !(prevState.showModal) : true,
      }));
    } else { // if the add tag btn was clicked on, show the 'create' tag modal
      this.setState((prevState) => ({
        action: 'create',
        selectedTag: null,
        showModal: (prevState.action === 'create') ? !(prevState.showModal) : true,
      }));
    }
  }

  closeTagModal(e) {
    if (!e.target.classList.contains('tag')) {
      this.setState({
        showModal: false,
      });
    }
  }

  closeSignInModal() {
    this.setState({
      showSignIn: false,
    });
  }

  /* Displays the login form for the user to sign in & populates the calendar on success */
  signIn() {
    const { onInitUser } = this.props;
    onInitUser('sign in from app', true);

    this.closeSignInModal();
  }

  render() {
    const { showModal, showSignIn, action, selectedTag } = this.state;
    const { tags, onCreateTag, onDeleteTag, onUpdateTag } = this.props;

    return (
      <div className="tags-container">
        <h2>Tags</h2>
        <p>Drag &amp; drop a tag to add it to the calendar!</p>
        <div className="tags-main-wrapper">
          <TagList tags={tags} onClick={this.toggleTagModal.bind(this)} />
          <Button btnType="btn-dashed" clicked={this.toggleTagModal.bind(this, null)}>+ Add New Tag</Button>
        </div>
        <Modal show={showModal} closeSelf={this.closeTagModal}>
          <TagForm
            onCreateTag={(tagData) => { this.toggleTagModal(); onCreateTag(tagData); }} 
            onDeleteTag={() => { this.toggleTagModal(selectedTag); onDeleteTag(selectedTag.id); }}
            onUpdateTag={(tagData) => onUpdateTag(tagData)}
            action={action}
            selectedTag={selectedTag} 
            key={selectedTag ? selectedTag.id : 'tag-form'}
            toggleSelf={this.toggleTagModal.bind(this)}
          />
        </Modal>
        <Modal show={showSignIn} closeSelf={this.closeSignInModal} extraClasses="sign-in-modal">
          <p className="red">Please sign in to continue!</p>
          <Button clicked={this.signIn}>Sign in w/ Google</Button>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onCreateTag: (tagData) => dispatch(actions.createTag(tagData)),
  onDeleteTag: (tagId) => dispatch(actions.deleteTag(tagId)),
  onUpdateTag: (tagData) => dispatch(actions.updateTag(tagData)),
  onInitUser: (msg, login) => dispatch(actions.initUser(msg, login)),
});


export default connect(null, mapDispatchToProps)(TagsContainer);
