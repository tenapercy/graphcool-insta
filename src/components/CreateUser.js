import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class CreateUser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            usernameSubscription: false,
        }
    }

    signupUser() {
        let {username, password} = this.state;
        let {signupUserMutation, history} = this.props;

        try {
            signupUserMutation({variables: {username, password}})
                .then((user) => {
                    localStorage.setItem('graphcoolToken', user.data.signupUser.token);
                    history.replace('/');
                });
        } catch (e) {
            history.replace('/');
        }
    }

    render() {
        if (this.props.loggedInUserQuery.loading) {
            return (<div>Loading</div>)
        }

        return (
            <div className='w-100 pa4 flex justify-center'>
                <div style={{ maxWidth: 400 }} className=''>
                    <input
                        className='w-100 pa3 mv2'
                        value={this.state.username}
                        placeholder='Username'
                        onChange={(e) => this.setState({username: e.target.value})}
                    />
                    <input
                        className='w-100 pa3 mv2'
                        type='password'
                        value={this.state.password}
                        placeholder='Password'
                        onChange={(e) => this.setState({password: e.target.value})}
                    />
                    {this.state.username && this.state.password &&
                        <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={this.signupUser.bind(this)}>Sign up</button>
                    }
                </div>
            </div>
        );
    }
}

const SIGNUP_USER_MUTATION = gql`
    mutation SignupUserMutation ($username: String!, $password: String!) {
        signupUser(username: $username, password: $password) {
            id
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
    graphql(SIGNUP_USER_MUTATION, {name: 'signupUserMutation'}),
    graphql(LOGGED_IN_USER_QUERY, {
        name: 'loggedInUserQuery'
    })
)(withRouter(CreateUser));