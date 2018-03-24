import {fromEvent} from 'graphcool-lib';

const getUser = (api, userId) => {
    return api.request(`
        query {
            User(id: "${userId}") {
                id
                username
            }
        }`)
        .then(userQueryResult => {
            console.log(userQueryResult);

            return userQueryResult.User;
        })
        .catch(error => {
            console.log(error);
            return { error: `An unexpected error occured` };
        });
};

export default async (event) => {
    if (!event.context.auth || !event.context.auth.nodeId) {
        return {data: {id: null}}
    }

    const userId = event.context.auth.nodeId;
    const graphcool = fromEvent(event);
    const api = graphcool.api('simple/v1');

    return getUser(api, userId)
        .then(user => {
            if (!user) {
                return { error: `No user with id: ${userId}` };
            }
            return {data: user}
        })
        .catch(error => {
            // Log error but don't expose to caller
            console.log(error);
            return { error: `An unexpected error occured` };
        });

};