import React from 'react';
import {Link} from 'react-router-dom';
import Post from '../components/Post'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'
import UserSection from '../components/UserSection';

class ListPage extends React.Component {

    render() {
        let {feed, location, history} = this.props;

        if (feed.loading) {
            return (
                <div className='flex w-100 h-100 items-center justify-center pt7'>
                    <div>
                        Loading
                    </div>
                </div>
            )
        }

        let blurClass = '';

        if (location.pathname !== '/') {
            blurClass = ' blur';
        }

        return (
            <div className={'w-100 flex flex-column justify-center pa6' + blurClass}>
                <div className='w-100 flex flex-wrap ma3' style={{maxWidth: 1150}}>
                    <UserSection
                        history={history}
                    />
                </div>
                <div className='w-100 flex flex-wrap' style={{maxWidth: 1150}}>
                    <Link to='/create' className='ma3 box new-post br2 flex flex-column items-center justify-center ttu fw6 f20 black-30 no-underline'>
                        + New Post
                    </Link>
                    {feed.allPosts && feed.allPosts.map((post) => (
                        <Post
                            key={post.id}
                            post={post}
                            refresh={() => feed.refetch()}
                        />
                    ))}
                </div>
                {this.props.children}
            </div>
        );
    }
}

export const ALL_POSTS_QUERY = gql`
    query allPosts {
        allPosts(orderBy: createdAt_DESC) {
            id
            imageUrl
            description
        }
    }
`;
//
// const LOGGED_IN_USER_QUERY = gql`
//     query LoggedInUserQuery {
//         loggedInUser {
//             id
//         }
//     }
// `;

export default graphql(ALL_POSTS_QUERY, {
    name: 'feed',
})(ListPage);