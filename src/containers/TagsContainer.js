import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import TagForm from '../components/TagForm/TagForm';
import TagList from '../components/TagList/TagList';

import * as actions from '../store/actions/index';

class TagsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'create',
      selectedTag: null,
      showModal: false,
    };
  }

  /* Toggles the tag modal, taking the tag that was clicked on as the parameter */
  toggleTagModal(tag) {
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

  render() {
    const { showModal, action, selectedTag } = this.state;
    const { tags, onCreateTag, onDeleteTag, onUpdateTag } = this.props;

    return (
      <div>
        <h2>Tags</h2>
        <p>Drag &amp; drop a tag to add it to the calendar!</p>
        <TagList tags={tags} onClick={this.toggleTagModal.bind(this)} />
        <Button btnType="btn-dashed" clicked={this.toggleTagModal.bind(this, null)}>+ Add New Tag</Button>
        <Modal show={showModal}>
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
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onCreateTag: (tagData) => dispatch(actions.createTag(tagData)),
  onDeleteTag: (tagId) => dispatch(actions.deleteTag(tagId)),
  onUpdateTag: (tagData) => dispatch(actions.updateTag(tagData)),
});


export default connect(null, mapDispatchToProps)(TagsContainer);
