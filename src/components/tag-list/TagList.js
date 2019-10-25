import React, { Component } from 'react';
import { firebaseHOC } from '../../util/Firebase';

class TagList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
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

  render() {
    const { tags } = this.state;
    return (
      <div className="tags">
        <h2>Tags</h2>
        <p>Drag &amp; drop a tag to add it to the calendar!</p>
        <div className="tags-list">
          <div className="tag green" draggable="true" id="aa" data-tag-color="green" data-tag-icon="🌱" data-tag-title="Watered Plants">🌱 Watered Plants</div>
          {tags.map((tag, index) => (
            <div className={`tag ${tag.color}`} draggable="true" id={`t${index}`} data-tag-color={tag.color} data-tag-icon={tag.icon} data-tag-title={tag.title}>{tag.icon} {tag.title}</div>
          ))}
        </div>
      </div>
    );
  }
}


export default firebaseHOC(TagList);
