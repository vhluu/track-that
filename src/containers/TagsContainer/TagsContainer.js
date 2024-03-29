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
    this.createTag = this.createTag.bind(this);
    this.setFocus = this.setFocus.bind(this);

    this.tagListRef = React.createRef();
    this.tagFormRef = React.createRef();
  }

  /* Toggles the Tag modal, taking the tag that was clicked on as the parameter */
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

  /* Close Tag modal */
  closeTagModal(e) {
    if (!e.target.classList.contains('tag')) {
      this.setState({
        showModal: false,
      });
    }
  }

  /* Close Sign-in modal */
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

  /* Add tag to database/store & close tag modal */
  createTag(tagData) {
    const { onCreateTag, tags } = this.props;
    
    tagData.order = tags.length == 0 ? 1 : parseInt(tags[tags.length - 1].order) + 1; // specify order
    onCreateTag(tagData); // add to database & store

    this.toggleTagModal(); // close tag modal
    
    setTimeout(() => { // scroll to bottom of tags list
      this.tagListRef.current.querySelector(':scope > div:last-child').scrollIntoView(false);
    }, 100);
  }

  /* Set the focus for the tag form */
  setFocus() {
    this.tagFormRef.current.setFocus();
  }

  render() {
    const { showModal, showSignIn, action, selectedTag } = this.state;
    const { tags, onDeleteTag, onUpdateTag, onUpdateOrder, uid } = this.props;

    return (
      <div className="tags-container">
        <h2>Tags</h2>
        <p>Drag &amp; drop a tag to add it to the calendar!</p>
        <div className="tags-main-wrapper">
          <TagList tags={tags} onClick={this.toggleTagModal.bind(this)} ref={this.tagListRef} onUpdateOrder={onUpdateOrder} uid={uid} />
          <Button type="dashed" clicked={this.toggleTagModal.bind(this, null)} ariaLabel="Add Tag">+ Add New Tag</Button>
        </div>
        <Modal show={showModal} closeSelf={this.closeTagModal} onShow={this.setFocus}>
          <TagForm
            onCreateTag={this.createTag} 
            onDeleteTag={() => { this.toggleTagModal(selectedTag); onDeleteTag(selectedTag.id); }}
            onUpdateTag={(tagData) => onUpdateTag(tagData)}
            action={action}
            selectedTag={selectedTag} 
            key={selectedTag ? selectedTag.id : 'tag-form'}
            toggleSelf={this.toggleTagModal.bind(this)}
            ref={this.tagFormRef}
          />
        </Modal>
        <Modal show={showSignIn} closeSelf={this.closeSignInModal} extraClasses="sign-in-modal">
          <p className="red">Please sign in to continue!</p>
          <Button clicked={this.signIn} ariaLabel="Sign in with Google">Sign in w/ Google</Button>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onCreateTag: (tagData) => dispatch(actions.createTag(tagData)),
  onDeleteTag: (tagId) => dispatch(actions.deleteTag(tagId)),
  onUpdateTag: (tagData) => dispatch(actions.updateTag(tagData)),
  onUpdateOrder: (tag1, tag2) => dispatch(actions.updateOrder(tag1, tag2)),
  onInitUser: (msg, login) => dispatch(actions.initUser(msg, login)),
});


export default connect(null, mapDispatchToProps)(TagsContainer);
