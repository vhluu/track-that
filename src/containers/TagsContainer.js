import React, { Component } from 'react';
import { connect } from 'react-redux';
import TagList from '../components/TagList/TagList';
import TagModal from '../components/TagModal/TagModal';

class TagsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'create',
      showModal: false,
    };
  }

  toggleTagModal(tagId) {
    this.setState((prevState) => ({
      action: tagId ? 'update' : 'create',
      selectedTag: tagId,
      showModal: (prevState.selectedTag === tagId) ? !(prevState.showModal) : true,
    }));
  }

  render() {
    const { showModal, action } = this.state;
    const { tags, onCreateTag, onDeleteTag, onUpdateTag } = this.props;

    return (
      <div>
        <h2>Tags</h2>
        <p>Drag &amp; drop a tag to add it to the calendar!</p>
        <TagList 
          tags={tags} 
          onCreateTag={onCreateTag}
          onDeleteTag={onDeleteTag}
          onUpdateTag={onUpdateTag}
          onClick={this.toggleTagModal} 
        />
        <div className="tag btn-add-tag" onClick={this.toggleTagModal.bind(this, null)}>+ Add New Tag</div>
        { showModal && <TagModal action={action} /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tags: state.tags,
});

const mapDispatchToProps = (dispatch) => ({
  onCreateTag: () => dispatch({ type: 'CREATE_TAG' }),
  onDeleteTag: () => dispatch({ type: 'DELETE_TAG' }),
  onUpdateTag: () => dispatch({ type: 'UPDATE_TAG' }),
});


export default connect(mapStateToProps, mapDispatchToProps)(TagsContainer);
