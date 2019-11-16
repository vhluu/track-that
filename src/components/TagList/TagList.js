import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TagModal from './TagModal/TagModal';

class TagList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'create',
      selectedTag: null,
      tags: [],
      showModal: false,
    };
  }

  componentDidMount() {
    const { uid } = this.props;
    if (uid) {
      this.getTags(uid);
    }
  }

  componentDidUpdate(prevProps) {
    const { uid } = this.props;
    if (prevProps.uid !== uid) {
      this.getTags(uid);
    }
  }

  /* Gets user data from firebase */
  getTags(id) {
    const { firebase } = this.props;
    if (id) {
      firebase.dbGetTags(id).then((tags) => {
        console.log(tags);
        this.setState({ tags });
      });
    }
  }

  toggleTagModal(tagId) {
    this.setState((prevState) => ({
      action: tagId ? 'update' : 'create',
      selectedTag: tagId,
      showModal: (prevState.selectedTag === tagId) ? !(prevState.showModal) : true,
    }));
  }

  render() {
    const { tags, showModal, action } = this.state;
    return (
      <div>
        <div className="tags-list">
          <div className="tag green" draggable="true" id="aa" data-tag-color="green" data-tag-icon="🌱" data-tag-title="Watered Plants">🌱 Watered Plants</div>
          {Object.keys(tags).map((id) => (
            <div className={`tag ${tags[id].color}`} draggable="true" id={`t${id}`} data-tag-color={tags[id].color} data-tag-icon={tags[id].icon} data-tag-title={tags[id].title} onClick={this.toggleTagModal.bind(this, id)}>{tags[id].icon} {tags[id].title}</div>
          ))}
          <div className="tag btn-add-tag" onClick={this.toggleTagModal.bind(this, null)}>+ Add New Tag</div>
        </div>
        { showModal && <TagModal action={action} /> }
      </div>
    );
  }
}

TagList.propTypes = {
  firebase: PropTypes.objectOf(PropTypes.object).isRequired,
  uid: PropTypes.string.isRequired,
};

export default TagList;
