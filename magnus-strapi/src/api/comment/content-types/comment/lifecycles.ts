/**
 * comment lifecycle hook
 */

export default {
    beforeCreate(event) {
        const { params } = event;
        const ctx = strapi.requestContext.get();

        if (ctx?.state?.user) {
            // Set the author to the logged-in user
            params.data.author = ctx.state.user.id;
        }
    }
};
