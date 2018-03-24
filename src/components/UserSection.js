import React from 'react';
import {Link} from 'react-router-dom';
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

const LoggedInUserSection = ({loggedInUser, handleLogout}) => {
    return (
        <div>
            <span>
                Welcome, {loggedInUser.username}!
            </span>
            <div className='pv3'>
                <span
                className='dib bg-red white pa3 pointer dim'
                onClick={handleLogout}
                >
                    Logout
                </span>
            </div>
        </div>
    );
};

const LoggedOutUserSection = ({handleLogin, handleSignup}) => {
    return (
        <div>
            <div className='pv3'>
                <div className='w-100 pa4 flex justify-center'>
                    <div
                        onClick={handleLogin}
                        className='dib pa3 white bg-blue dim pointer'
                    >
                        Log in with Email
                    </div>
                </div>
                <div className='w-100 flex justify-center'>
                    <div
                        onClick={handleSignup}
                        className='dib pa3 white bg-blue dim pointer'
                    >
                        Sign up with Email
                    </div>
                </div>
            </div>
        </div>
    );
};

class UserSection extends React.Component {

    _isLoggedIn() {
        let {loggedInUserQuery} = this.props;

        return loggedInUserQuery.loggedInUser && loggedInUserQuery.loggedInUser.id !== null;
    }

    _logout() {
        // remove token from local storage and reload page to reset apollo client
        localStorage.removeItem('graphcoolToken');
        window.location.reload();
    }

    render() {
        let {loggedInUserQuery, history} = this.props;
        let content = this._isLoggedIn() ?
            <LoggedInUserSection
                loggedInUser={loggedInUserQuery.loggedInUser}
                handleLogout={this._logout.bind(this)}
            /> :
            <LoggedOutUserSection
                handleLogin={() => history.replace('/login')}
                handleSignup={() => history.replace('/signup')}
            />;

        return (
            <div>
                {content}
            </div>
        );
    }
}

const LOGGED_IN_USER_QUERY = gql`
    query LoggedInUserQuery {
        loggedInUser {
            id
            username
        }
    }
`;

export default graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
})(UserSection);