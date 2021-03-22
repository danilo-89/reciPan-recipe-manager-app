
import { Template } from 'meteor/templating'
import { Recipes } from '../../imports/api/recipesBase.js';

Template.user.onCreated(function() {
    
    this.autorun(() => {
        const userProfileName = FlowRouter.getParam("userProfileName");
        this.subscribe("userProfile", userProfileName);
        this.subscribe("recipesUser9", userProfileName);
        Session.set('userProfileName', userProfileName);
        // console.log(userId);
    })
    
});


Template.user.onRendered(function () {

    this.autorun(() => {
        
        const ready = this.subscriptionsReady();

        if(ready) {
            const userId = FlowRouter.getParam("userId");

            setTimeout(() => {




            }, 0)
        }
        
        
    })
    
});


Template.user.onDestroyed(function() {
    // console.log("nulaaaaaaaaa");
    // Session.set('recipeId', null);
    // Session.set('avgStar', null);
    // Session.set('checkItFav', null);
})

Template.user.helpers({
    getUserProfile: () => {
        // Session.set('usr', Meteor.users.find({ _id: 'AtYGJ5WdcvH6nsBwt' }).fetch()[0]);
        return Meteor.users.find({ username: Session.get('userProfileName') }).fetch()[0];
    },
    getRecipes: () => {
        return Recipes.find({}, {sort: {createdAt: -1}});
    },
});

Template.user.events({
    "click .send-friend-request-btn"() {
        console.log(this);
        // FlowRouter.go(`/edit-recipe/${this._id}`);
        Meteor.call('sendFriendRequest', this._id, (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Friend request sent to '+ this.username, 'success');
                }
            }
        })
    },
});
