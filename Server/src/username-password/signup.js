import {fromEvent} from 'graphcool-lib';
import {genSalt, hashSync} from 'twin-bcrypt';

const getGraphcoolUser = (api, username) => {
    return api.request(`query {User(username: "${username}"){id}}`)
        .then((userQueryResult) => {
            if (userQueryResult.error) {
                return Promise.reject(userQueryResult.error);
            } else {
                return userQueryResult.User;
            }
        });
};

const createGraphcoolUser = (api, username, passwordHash) => {
    return api.request(`
        mutation {
            createUser(username: "${username}", password: "${passwordHash}") { 
                id 
            }
        }`)
        .then((userMutationResult) => {
            return userMutationResult.createUser.id
        })
};

export default async event => {
    if (!event.context.graphcool.pat) {
        console.log('Please provide a valid root token!');
        return { error: 'Email Signup not configured correctly.'}
    }

    const username = event.data.username;
    const password = event.data.password;
    const graphcool = fromEvent(event);
    const api = graphcool.api('simple/v1');
    const SALT_ROUNDS = 10;
    const salt = genSalt(SALT_ROUNDS);

    return getGraphcoolUser(api, username)
        .then(graphcoolUser => {
            if (graphcoolUser === null) {
                const passwordHash = hashSync(password, salt);

                return createGraphcoolUser(api, username, passwordHash);
            } else {
                return Promise.reject("Username already in use")
            }
        })
        .then(graphcoolUserId => {
            return graphcool.generateAuthToken(graphcoolUserId, 'User')
                .then(token => {
                    return { data: {id: graphcoolUserId, token}};
                });
        })
        .catch((error) => {
            console.log(error);

            // don't expose error message to client!
            return { error: 'An unexpected error occured.' };
        });
};
