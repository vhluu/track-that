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

  toggleTagModal(tag) {
    this.setState((prevState) => ({
      action: tag ? 'update' : 'create',
      selectedTag: tag,
      showModal: (prevState.selectedTag && tag && (prevState.selectedTag.id === tag.id)) ? !(prevState.showModal) : true,
    }));
  }

  render() {
    const { showModal, action, selectedTag } = this.state;
    const { tags, onCreateTag, onDeleteTag, onUpdateTag } = this.props;

    // TODO: pass selected tag data to TagModal
    return (
      <div>
        <h2>Tags</h2>
        <p>Drag &amp; drop a tag to add it to the calendar!</p>
        <TagList tags={tags} onClick={this.toggleTagModal.bind(this)} />
        <Button btnType="btn-dashed" clicked={this.toggleTagModal.bind(this, null)}>+ Add New Tag</Button>
        <Modal show={showModal}>
          <TagForm
            onCreateTag={(tagData) => { this.toggleTagModal(); onCreateTag(tagData); }} 
            onDeleteTag={() => onDeleteTag(selectedTag.id)}
            onUpdateTag={(tagData) => onUpdateTag(tagData)}
            action={action}
            selectedTag={selectedTag} 
            key={selectedTag ? selectedTag.id : 'tag-form'}
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tags: state.tags,
});

const mapDispatchToProps = (dispatch) => ({
  onCreateTag: (tagData) => dispatch(actions.createTag(tagData)),
  onDeleteTag: (tagId) => dispatch(actions.deleteTag(tagId)),
  onUpdateTag: (tagData) => dispatch(actions.updateTag(tagData)),
});


export default connect(mapStateToProps, mapDispatchToProps)(TagsContainer);
