import React, { Component } from 'react';
import { connect } from 'react-redux';
import TagList from '../components/TagList/TagList';
import TagModal from '../components/TagModal/TagModal';

class TagsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'create',
      selectedTag: null,
      showModal: false,
    };
  }

  toggleTagModal(tagId) {
    console.log(tagId);
    this.setState((prevState) => ({
      action: tagId ? 'update' : 'create',
      selectedTag: {
        ...prevState.selectedTag,
        id: tagId,
      },
      showModal: (prevState.selectedTag && (prevState.selectedTag.id === tagId)) ? !(prevState.showModal) : true,
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
        <div className="tag btn-add-tag" onClick={this.toggleTagModal.bind(this, null)}>+ Add New Tag</div>
        { showModal && (
          <TagModal
            onCreateTag={onCreateTag} 
            onDeleteTag={() => onDeleteTag(selectedTag.id)}
            onUpdateTag={() => onUpdateTag(selectedTag.id)}
            action={action}
            tagData={selectedTag} 
          />
        ) }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tags: state.tags,
});

const mapDispatchToProps = (dispatch) => ({
  onCreateTag: () => dispatch({ type: 'CREATE_TAG' }),
  onDeleteTag: (id) => dispatch({ type: 'DELETE_TAG', tagId: id }),
  onUpdateTag: (tagData) => dispatch({ type: 'UPDATE_TAG', value: tagData }),
});


export default connect(mapStateToProps, mapDispatchToProps)(TagsContainer);
