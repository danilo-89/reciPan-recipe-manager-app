
import { Template } from 'meteor/templating'
import { Recipes } from '../../imports/api/recipesBase.js';

Template.user.onCreated(function() {
    
    this.autorun(() => {
        const userProfileName = FlowRouter.getParam("userProfileName");
        this.subscribe("userProfile", userProfileName);
        this.subscribe("recipesUser9", userProfileName);
        this.subscribe("users.friendsActive");
        Session.set('userProfileName', userProfileName);
        // console.log(userId);
    })
    
});

Template.user.onRendered(function () {});

Template.user.onDestroyed(function() {});

Template.user.helpers({
    getUserProfile: () => {
        // Session.set('usr', Meteor.users.find({ _id: 'AtYGJ5WdcvH6nsBwt' }).fetch()[0]);
        return Meteor.users.find({ username: Session.get('userProfileName') }).fetch()[0];
    },
    getRecipes: () => {
        return Recipes.find({}, {sort: {createdAt: -1}}).fetch({});
    },
    getFriendship: (friendId) => {
        const activeFriends = Meteor.user()?.public?.friends?.active;
        if (activeFriends) {
            console.log({friendId});
            console.log(activeFriends.includes(friendId));
            return activeFriends.includes(friendId);
        }
        return false;
    },
});

Template.user.events({
    "click .send-friend-request-btn"() {
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
    "click .remove-friend-btn"() {
        Meteor.call('removeFriendship', this._id, (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('This user is no more in your friends list', 'success');
                }
            }
        })
    },
});
