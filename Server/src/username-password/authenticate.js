import {fromEvent} from 'graphcool-lib';
import {compareSync} from 'twin-bcrypt';

const getGraphcoolUser = (api, username) => {
    return api.request(`
        query {
            User(username: "${username}") {
                id
                password
            }
        }`)
        .then((userQueryResult) => {
            if (userQueryResult.error) {
                return Promise.reject(userQueryResult.error);
            } else {
                return userQueryResult.User;
            }
        });
}

export default async (event) => {
    if (!event.context.graphcool.pat) {
        console.log('Please provide a valid root token!');
        return { error: 'Email Authentication not configured correctly.'};
    }

    const username = event.data.username;
    const password = event.data.password;
    const graphcool = fromEvent(event);
    const api = graphcool.api('simple/v1');

    return getGraphcoolUser(api, username)
        .then((graphcoolUser) => {
            if (graphcoolUser === null) {
                return Promise.reject("Invalid Credentials") //returning same generic error so user can't find out what emails are registered.
            } else {
                let passwordCorrect = compareSync(password, graphcoolUser.password);

                if (passwordCorrect) {
                    return graphcoolUser.id
                } else {
                    return Promise.reject("Invalid Credentials")
                }
            }
        })
        .then((graphcoolUserId) =>
            graphcool.generateAuthToken(graphcoolUserId, 'User')
                .then((token) => Promise.resolve({
                    userId: graphcoolUserId,
                    token,
                    })
                )
        )
        .then(({token, userId}) => ({data: {token, userId}}))
        .catch((error) => {
            console.log(`Error: ${JSON.stringify(error)}`);

            return {error: `An unexpected error occured`};
        });
}