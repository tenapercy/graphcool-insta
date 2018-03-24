import React from 'react';
import {withRouter} from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {ALL_POSTS_QUERY} from './ListPage';

class CreatePage extends React.Component {
    state = {
        description: '',
        imageUrl: '',
    };

    handlePost() {
        let {addPost, history} = this.props;
        let {description, imageUrl} = this.state;

        addPost({ description, imageUrl })
            .then(() => history.replace('/'));

    }

    render() {
        let {description, imageUrl} = this.state;

        return (
            <div className='w-100 pa4 flex justify-center'>
                <div style={{maxWidth: 400}} className=''>
                    <input
                        className='w-100 pa3 mv2'
                        value={description}
                        placeholder='Description'
                        onChange={(e) => this.setState({description: e.target.value})}
                    />
                    <input
                        className='w-100 pa3 mv2'
                        value={imageUrl}
                        placeholder='Image Url'
                        onChange={(e) => this.setState({imageUrl: e.target.value})}
                    />
                    {imageUrl &&
                        <img src={imageUrl} role='presentation' className='w-100 mv3' />
                    }
                    {description && imageUrl &&
                        <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={this.handlePost.bind(this)}>Post</button>
                    }
                </div>
            </div>
        );
    }
}

const addMutation = gql`
    mutation addPost($description: String!, $imageUrl: String!) {
        createPost(description: $description, imageUrl: $imageUrl) {
            id
            description
            imageUrl
        }
    }
`;

export default graphql(addMutation, {
  props: ({ ownProps, mutate }) => ({
      addPost: (post) => {
        let { description, imageUrl } = post;

        return mutate({
            variables: { description, imageUrl },
            update: (store, {data: {createPost}}) => {
                let data = store.readQuery({query: ALL_POSTS_QUERY});

                data.allPosts.unshift(createPost);
                store.writeQuery({query: ALL_POSTS_QUERY, data});
            },
        });
      }
  })
})(withRouter(CreatePage))