import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class LoginUser extends React.Component {
    state = {
        username: '',
        password: '',
    }

    authenticateUser() {
        let {username, password} = this.state;
        let {authenticateUserMutation} = this.props;

        authenticateUserMutation({
            variables: {username, password},
            update: (store, {data: {authenticateUser}}) => {
                let data = store.readQuery({query: LOGGED_IN_USER_QUERY});

                data.loggedInUser.id = authenticateUser.userId;
                store.writeQuery({ query: LOGGED_IN_USER_QUERY, data});
            },
        }).then(({data: {authenticateUser}}) => {
            localStorage.setItem('graphcoolToken', authenticateUser.token);
            this.props.history.replace('/');
        });
    }

    render() {
        let {loggedInUserQuery} = this.props;
        let {username, password} = this.state;

        if (loggedInUserQuery.loading) {
            return (<div>Loading</div>)
        }

        // redirect if user is logged in
        if (loggedInUserQuery.loggedInUser.id) {
            console.warn('already logged in');
            this.props.history.replace('/');
        }

        return (
            <div className='w-100 pa4 flex justify-center'>
                <div style={{ maxWidth: 400 }} className=''>
                    <input
                        className='w-100 pa3 mv2'
                        value={username}
                        placeholder='Username'
                        onChange={(e) => this.setState({username: e.target.value})}
                    />
                    <input
                        className='w-100 pa3 mv2'
                        type='password'
                        value={password}
                        placeholder='Password'
                        onChange={(e) => this.setState({password: e.target.value})}
                    />

                    {username && password &&
                        <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={this.authenticateUser.bind(this)}>Log in</button>
                    }
                </div>
            </div>
        )
    }
}

const AUTHENTICATE_USER_MUTATION = gql`
    mutation AuthenticateUserMutation ($username: String!, $password: String!) {
        authenticateUser(username: $username, password: $password) {
            userId
            token
        }
    }
`;

const LOGGED_IN_USER_QUERY = gql`
    query LoggedInUserQuery {
        loggedInUser {
            id
        }
    }
`;

export default compose(
    graphql(AUTHENTICATE_USER_MUTATION, {name: 'authenticateUserMutation'}),
    graphql(LOGGED_IN_USER_QUERY, {
        name: 'loggedInUserQuery',
    })
)(withRouter(LoginUser));