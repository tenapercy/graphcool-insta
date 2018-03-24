import React from 'react';
import ReactDOM from 'react-dom';
import ListPage from './components/ListPage';
import CreatePage from './components/CreatePage';
import DetailPage from './components/DetailPage';
import CreateUser from './components/CreateUser';
import LoginUser from './components/LoginUser';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import ApolloClient from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import { ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloProvider} from 'react-apollo';
import 'tachyons';
import './index.css';

const httpLink = createHttpLink({
    uri: 'https://api.graph.cool/simple/v1/cjf5decl96fl30179t2xjk8lj'
});

const middlewareLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('graphcoolToken');
    const authorizationHeader = token ? `Bearer ${token}` : null;

    operation.setContext({
        headers: {
            authorization: authorizationHeader
        }
    });

    return forward(operation);
});

const httpLinkWithAuthToken = middlewareLink.concat(httpLink);

const client = new ApolloClient({
    link: httpLinkWithAuthToken,
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

ReactDOM.render((
    <ApolloProvider client={client}>
        <Router>
            <div>
                <Route exact path='/' component={ListPage} />
                <Route path='/create' component={CreatePage} />
                <Route path='/signup' component={CreateUser} />
                <Route path='/login' component={LoginUser} />
                <Route path='/post/:id' component={DetailPage} />
            </div>
        </Router>
    </ApolloProvider>
), document.getElementById('root'));