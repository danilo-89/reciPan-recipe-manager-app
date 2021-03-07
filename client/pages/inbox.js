import { SharedRecipes } from '../../imports/api/recipesBase.js';


Template.inbox.onCreated(function () {

    Session.set("limit", 4);

    this.autorun(() => {
        const limit = Session.get("limit");
        this.subscribe('sharedToUser.recipes', limit);
    })
    


});


// Tracker.autorun(function() {
//     Meteor.user().notice.inbox;
//     console.log('pokrenut tracker');
// });


Template.inbox.onRendered(function () {

    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            Session.set("ready", true);
           
            if (Meteor.user().notice.inbox) {
                Meteor.call('read.inbox', (err, res) => {
                    if (err) {
                        Bert.alert(err.reason, 'danger');
                    } else {
                        if (res.isError) {
                            Bert.alert(res.err.reason, 'danger');
                        } else {
                            Bert.alert('ok', 'success');
                        }
                    }
                });
            }

        }
    });

});

Template.inbox.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    getInboxRecipes: () => {
        // return Recipes.find({}, {sort: {createdAt: -1}});
        // Meteor.user().public.favorites
        // Session.set("rec", Meteor.user().public.sharedToUser.sharedRecipes);
        return SharedRecipes.find();
        // return SmartCodes.find({ postId: postId }).fetch()[0].ifOrderable;
    },
})

Template.inbox.events({
    "click .inbox-card-bottom"() {
        FlowRouter.go('/single-recipe/' + this.recipeId);
    },
});