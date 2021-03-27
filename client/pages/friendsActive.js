const { Meteor } = require("meteor/meteor");

Template.friendsActive.onCreated(function () {

    this.autorun(() => {
        this.subscribe('users.friendsActive');
        this.subscribe('friends.friendsActive');
    })

});

Template.friendsActive.onRendered(function () {

    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            if (Meteor.user().notice?.friendAccept) {
                Meteor.call('read.accepted', (err, res) => {
                    if (err) {
                        Bert.alert(err.reason, 'danger');
                    } else {
                        if (res.isError) {
                            Bert.alert(res.err.reason, 'danger');
                        } else {}
                    }
                });
            }
        }
    });

});



Template.friendsActive.events({
    "click .accept-friend-request-btn"() {
        console.log("test");
        console.log(this);
        // FlowRouter.go(`/edit-recipe/${this._id}`);
        Meteor.call('acceptFriendRequest', this.valueOf(), (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Friend request accepted', 'success');
                }
            }
        })
    },
});

// Template.friendsActive.onCreated(function (){
//     this.formattedData = new ReactiveVar([]);
//     this.$autorun(() => {
//       const input = this.input; // get this from somewhere reactive?...
//       this.formattedData = Object.keys(input).map(key => {
//         return {
//           key: key,
//           data: Object.values(input[key]).map(row => {
//             return Object.keys(row).map(k => {
//               return {key: k, data: row[k]};
//             });
//           })
//         }
//       })
//     })


Template.friendsActive.helpers({
    getFriends: () => {
              // return Meteor.users.find({ username: Session.get('userProfileName') }).fetch()[0];
        // return Meteor.users.find({},{fields: {'public.friends.received': 1}});
        // return Meteor.user().fetch()[0];
        return Meteor.user().public?.friends?.active ?? false;
    },
    getFriendsNames: (friendId) => {
        console.log({friendId});
        console.log(Meteor.users.findOne({_id: friendId}));
        return Meteor.users.findOne({_id: friendId}).username;
    },
    getFriendsAvatar: (friendId) => {
        return Meteor.users.findOne({_id: friendId}).profile?.profilePhotoUrl;
    },
    // getContactName: (contactObj) => {
    //     return Object.getOwnPropertyNames(contactObj)[0];
    // },
})


Template.friendsActive.events({
    "click .remove-friend-btn"() {
        console.log("test");
        console.log(this);
        // FlowRouter.go(`/edit-recipe/${this._id}`);
        Meteor.call('removeFriendship', this.valueOf(), (err, res) => {
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
    "click .userNameLink"(event) {
        const userProfileName = Meteor.users.findOne({_id: this.toString()}).username;
        if (Meteor.user().username === userProfileName) {
            FlowRouter.go('/profile');
        } else {
            FlowRouter.go(`/user/${userProfileName}`);
        }
    },
});