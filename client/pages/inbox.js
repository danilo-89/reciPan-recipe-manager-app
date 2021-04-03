import { SharedRecipes } from '../../imports/api/recipesBase.js';


Template.inbox.onCreated(function () {

    // Session.set("limit", 4);

    this.autorun(() => {
        // const limit = Session.get("limit");
        this.subscribe('sharedToUser.recipes');
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
           
            if (Meteor.user()?.notice?.inbox) {
                Meteor.call('read.inbox', (err, res) => {
                    if (err) {
                        Bert.alert(err.reason, 'danger');
                    } else {
                        if (res.isError) {
                            Bert.alert(res.err.reason, 'danger');
                        } else {
                            // Bert.alert('ok', 'success');
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
        return SharedRecipes.find();
    },
    getInboxRecipesCount: () => {
        return SharedRecipes.find().count();
    },

})

Template.inbox.events({
    "click .inbox-card-bottom"() {
        FlowRouter.go('/single-recipe/' + this.recipeId);
    },
    "click .userNameLink"(event) {
        const userProfileName = $(event.currentTarget).find( ".spanGoName" ).text();
        if (Meteor.user()?.username === userProfileName) {
            FlowRouter.go('/profile');
        } else {
            FlowRouter.go(`/user/${userProfileName}`);
        }
    },
});
