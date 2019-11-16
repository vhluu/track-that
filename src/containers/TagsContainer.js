import React, { Component } from 'react';
import { connect } from 'react-redux';
import TagList from '../components/TagList/TagList';

class TagsContainer extends Component {
	render() {
    return (
      <div>
        <h2>Tags</h2>
        <p>Drag &amp; drop a tag to add it to the calendar!</p>
        <TagList />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
		tags: state.tags,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		onCreateTag: () => dispatch({ type: 'CREATE_TAG' }),
		onDeleteTag: () => dispatch({ type: 'DELETE_TAG' }),
		onUpdateTag: () => dispatch({ type: 'UPDATE_TAG' }),
	}
};


export default connect(mapStateToProps)(TagsContainer);
