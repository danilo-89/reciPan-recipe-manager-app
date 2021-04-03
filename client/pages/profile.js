import { Recipes } from '../../imports/api/recipesBase.js';

Template.profile.onCreated(function () {
    Session.set("ready", false);
    this.autorun(() => {
        // this.subscribe('usersConfirmation.user');
        this.subscribe('users.user');
        this.subscribe("users.user.notice");
        this.subscribe("recipesMy9");
    })
});

Template.profile.onRendered(function () {

    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            Session.set("ready", true);
            if (Meteor.user()) {
                Meteor.call('getUserFavoritesCount', (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        Session.set('userFavoritesCount', res);
                    }
                });
                Meteor.call('getUserPostsTotal', (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        Session.set('userRecipesCount', res);
                    }
                })
            }
        }
    })

});

Template.profile.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    userName: () => {
        return Meteor.user().username;
    },
    getAvatarImg: () => {
        return Meteor.user()?.profile?.profilePhotoUrl ?? false;
    },
    getFriendsActiveCount: () => {
        const checkAll = Meteor.user()?.public?.friends?.active;
        if (checkAll) {
            return Meteor.user().public.friends.active.length;
        } else {
            return "0";
        }
    },
    getUserFavoritesCount: () => {
        if (Session.get('userFavoritesCount')) {
            return Object.keys(Session.get('userFavoritesCount')).length;
        } else {
            return 0;
        }
    },
    getUserRecipesCount: () => {
        return Session.get('userRecipesCount');
    },
    getInboxNotice: () => {
        return Meteor.user().notice.inbox;
    },
    getFriendNotice: () => {
        console.log("check friend notice");
        return (Meteor.user()?.notice?.friendAccept) || (Meteor.user()?.notice?.friendRequest);
    },
    getRecipes: () => {
        return Recipes.find({}, {sort: {createdAt: -1}});
    },
});

Template.profile.events({
    "click .go-to-my-recipes-btn"() {
        FlowRouter.go(`/myRecipes`);
    },
    "click .friends-info-btn"() {
        FlowRouter.go(`/friends`);
    },
    "click .go-to-favorites-btn"() {
        FlowRouter.go(`/favorites`);
    },
    "click #changeAvatar"() {
        $("#fileInput").click();
    },
    // "click .latest-user-recipe-content"() {
    //     FlowRouter.go(`/single-recipe/${this._id}`);
    // },
});

