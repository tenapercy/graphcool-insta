import React from 'react';
import {Link} from 'react-router-dom';

class Post extends React.Component {

    render () {
        let {post: {description, imageUrl, id}} = this.props;

        return (
            <Link to={`/post/${id}`} className='bg-white ma3 box post flex flex-column no-underline br2'>
                <div
                    className='image'
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        paddingBottom: '100%',
                    }}
                />
                <div className='flex items-center black-80 fw3 description'>
                    {description}
                </div>
            </Link>
        )
    }
}

export default Post;