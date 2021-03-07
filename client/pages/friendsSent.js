Template.sentFriendRequests.onCreated(function () {

    this.autorun(() => {
        this.subscribe('users.friendsSent');
        this.subscribe('friends.friendsSent');
    })

    
});

Template.sentFriendRequests.events({
    "click .withdraw-friend-request-btn"() {
        console.log("test");
        console.log(this);
        // FlowRouter.go(`/edit-recipe/${this._id}`);
        Meteor.call('removeFromSent', this.valueOf(), (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Sent friend request withdrawn', 'success');
                }
            }
        })
    },
});
// Template.sentFriendRequests.onCreated(function (){
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


Template.sentFriendRequests.helpers({
    getFriends: () => {
              // return Meteor.users.find({ username: Session.get('userProfileName') }).fetch()[0];
        // return Meteor.users.find({},{fields: {'public.friends.received': 1}});
        // return Meteor.user().fetch()[0];
        return Meteor.user().public.friends.sent;
    },
    getFriendsNames: (friendId) => {
        return Meteor.users.findOne({_id: friendId}).username;
    },
    // getContactName: (contactObj) => {
    //     return Object.getOwnPropertyNames(contactObj)[0];
    // },
})


// "friends" : [ 
//     {
//         "dSYZs9MXDfPrYwje9" : "sent"
//     }, 
//     {
//         "dSYZs9MXDfPrYwje9" : "sent"
//     }, 
//     {
//         "dSYZs9MXDfPrYwje9" : "sent"
//     }, 
//     {
//         "dSYZs9MXDfPrYwje9" : "sent"
//     }, 
//     {
//         "dSYZs9MXDfPrYwje9" : "sent"
//     }, 
//     {
//         "dSYZs9MXDfPrYwje9" : "sent"
//     }
// ]