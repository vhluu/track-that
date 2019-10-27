import React, { Component } from 'react';
import { firebaseHOC } from '../../util/Firebase';
import TagModal from './TagModal/TagModal';

class TagList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      showModal: false,
    };

    this.toggleTagModal = this.toggleTagModal.bind(this);
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

  toggleTagModal() {
    this.setState((prevState) => ({
      showModal: !(prevState.showModal),
    }));
  }

  render() {
    const { tags, showModal } = this.state;
    return (
      <div>
        <div className="tags-list">
          <div className="tag green" draggable="true" id="aa" data-tag-color="green" data-tag-icon="🌱" data-tag-title="Watered Plants">🌱 Watered Plants</div>
          {tags.map((tag, index) => (
            <div className={`tag ${tag.color}`} draggable="true" id={`t${index}`} data-tag-color={tag.color} data-tag-icon={tag.icon} data-tag-title={tag.title}>{tag.icon} {tag.title}</div>
          ))}
          <div className="tag btn-add-tag" onClick={this.toggleTagModal}>+ Add New Tag</div>
        </div>
        { showModal && <TagModal /> }
      </div>
    );
  }
}


export default firebaseHOC(TagList);
