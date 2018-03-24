import React from 'react';
import {graphql, compose} from 'react-apollo';
import Modal from 'react-modal';
import modalStyle from '../constants/modalStyle';
import {withRouter} from 'react-router-dom';
import gql from 'graphql-tag';
import {ALL_POSTS_QUERY} from './ListPage';

const detailModalStyle = {
  overlay: modalStyle.overlay,
  content: {
    ...modalStyle.content,
    height: 761,
  },
};

class DescriptionInput extends React.Component {
    componentDidMount() {
        if (this.descriptionInput) {
            this.descriptionInput.focus();
        }
    }

    render() {
        let {description, handleBlur, handleKeyUp} = this.props;

        return (
            <input
                ref={(input) => { this.descriptionInput = input; }}
                type="text"
                defaultValue={description}
                onBlur={handleBlur}
                onKeyUp={handleKeyUp}
            />
        );
    }
}

class DetailPage extends React.Component {
    state = {
        isEditing: false,
        description: '',
    };

    componentWillReceiveProps(nextProps) {
        let {postQuery: {loading, Post}} = nextProps;

        if (!loading) {
            this.setState({description: Post.description});
        }
    }

    handleDelete() {
        let {deletePost, history, postQuery: {Post}} = this.props;

        deletePost({variables: {id: Post.id}, refetchQueries: [{query: ALL_POSTS_QUERY}]})
            .then(() => history.replace('/'));

    }

    handleEdit() {
        let {updatePost, postQuery: {Post}} = this.props;
        let {description} = this.state;

        this.setState({isEditing: false});
        updatePost({variables: {id: Post.id, description}, refetchQueries: [{query: ALL_POSTS_QUERY}]});
    }

    render() {
        let {postQuery: {loading, Post}, history} = this.props;
        let {isEditing, description} = this.state;

        if (loading) {
            return (
                <div className='flex w-100 h-100 items-center justify-center pt7'>
                    <div>
                        Loading
                    </div>
                </div>
            )
        }

        let descriptionContent = (
            <div onClick={() => this.setState({isEditing: true})}>{description}</div>
        );

        if (isEditing) {
            descriptionContent = (
                <div>
                    <DescriptionInput
                        description={description}
                        handleBlur={this.handleEdit.bind(this)}
                        handleKeyUp={(evt) => {this.setState({description: evt.target.value})}}
                    />
                </div>

            );
        }

        return (
            <Modal
                isOpen
                contentLabel='Create Post'
                style={detailModalStyle}
                onRequestClose={history.goBack}
            >
                <div
                    className='close fixed right-0 top-0 pointer'
                    onClick={history.goBack}
                >
                    X
                </div>
                <div
                    className='delete ttu white pointer fw6 absolute left-20 top-60 br2'
                    onClick={this.handleDelete.bind(this)}
                >
                    Delete
                </div>
                <div className='bg-white detail flex flex-column no-underline br2 h-100'>
                    <div
                        className='image'
                        style={{
                            backgroundImage: `url(${Post.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            paddingBottom: '100%',
                        }}
                    />
                    <div className='flex items-center black-80 fw3 description'>
                        {descriptionContent}
                    </div>
                </div>
            </Modal>
        );
    }
}

const DELETE_POST_MUTATION = gql`
    mutation DeletePostMutation($id: ID!) {
        deletePost(id: $id) {
            id
        }
    }
`;

const UPDATE_POST_MUTATION = gql`
    mutation UpdatePostMutation($id: ID!, $description: String!) {
        updatePost(id: $id, description: $description) {
            description
        }
    }
`;

const POST_QUERY = gql`
    query PostQuery($id: ID!) {
        Post(id: $id) {
            id
            imageUrl
            description
        }
    }
`;

const DetailPageWithGraphQL = compose(
    graphql(POST_QUERY, {
        name: 'postQuery',
        options: ({match}) => ({
            variables: {
                id: match.params.id,
            },
        }),
    }),
    graphql(DELETE_POST_MUTATION, {
        name: 'deletePost'
    }),
    graphql(UPDATE_POST_MUTATION, {
       name: 'updatePost'
    }),
)(DetailPage);

const DetailPageWithDelete = graphql(DELETE_POST_MUTATION)(DetailPageWithGraphQL);

export default withRouter(DetailPageWithDelete);

