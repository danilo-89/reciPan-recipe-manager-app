import { Recipes } from '../imports/api/recipesBase.js';
import { SharedRecipes } from '../imports/api/recipesBase.js';
import { ShopLists } from '../imports/api/recipesBase.js';
import { check } from "meteor/check";
import Images from '/lib/dropbox.js';

Meteor.publish('files.images.all', function () {
    return Images.files.find().cursor;
});


Meteor.publish('recipes', function recipesPublication() {
    return Recipes.find({
        $or: [
            { private: { $ne: true } },
            { owner: this.userId },
        ],
    });
});

Meteor.publish("recipesForCategory", function publishRecipesCategory(categoryName, limit, skip, searchArray) {
    check(skip, Number);
    categoryName = categoryName.replace(/_/g, ' ');
    if(searchArray == false) {
        return Recipes.find(
            {$and: [
                { category: categoryName },
                // { searchIndex: { $all: {$elemMatch: { searchArray }}     } },
                { $or: [ { private: { $ne: true } }, { owner: this.userId } ] }
            ]},
            // { private: 'active', postType: 'clubPost', vendorGroup: clubName }, 
            { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: limit, skip: skip }
        );
    } else {
        return Recipes.find(
    //         // { private: 'active', postType: 'clubPost', vendorGroup: clubName, hashtags: { $in: hashtags } }, 
    {$and: [
        { searchIndex: { $all: searchArray } },
        { category: categoryName },
        // { searchIndex: { $all: {$elemMatch: { searchArray }}     } },
        { $or: [ { private: { $ne: true } }, { owner: this.userId } ] }
    ]},
    { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: limit, skip: skip }
        );
    }
});

Meteor.publish("recipesSingle", function publishRecipesSingle(recipeId) {
    return Recipes.find(
        {$and: [
            { _id: recipeId },
            { $or: [ 
                { private: { $ne: true } }, 
                { owner: this.userId },  
                {$and: [ 
                    {privateAllow: {$exists: true}},
                    {privateAllow: { $in: [this.userId] }} 
                ]} 
            ] }
        ] }
    );
});

Meteor.publish('users.user.notice', function() {
    return Meteor.users.find(this.userId, {
        fields: {
            notice: 1
        }
    });
});

Meteor.publish('users.user', function() {
    return Meteor.users.find(this.userId, {
        fields: {
            _id: 1,
            public: 1,
            profile: 1
        }
    });
});

Meteor.publish('usersConfirmation.user', function() {
    return Meteor.users.find(this.userId, {
        fields: {
            _id: 1,
            public: 1,
            'services.email.verificationTokens': 1,
        }
    });
});

Meteor.publish('users.favoritesList', function() {
    return Meteor.users.find(this.userId, {
        fields: {
            _id: 1,
            'public.favorites': 1,
        }
    });
});

Meteor.publish('users.friendsReceived', function() {
    return Meteor.users.find(this.userId, {
        fields: {
            'public.friends.received': 1
        }
    });
});

Meteor.publish('users.friendsSent', function() {
    return Meteor.users.find(this.userId, {
        fields: {
            'public.friends.sent': 1
        }
    });
});

Meteor.publish('users.friendsActive', function() {
    return Meteor.users.find(this.userId, {
        fields: {
            'public.friends.active': 1
        }
    });
});
// Meteor.publish("postsForClubSingle", function publishPostsForClubSingle(postId) {
//     return Posts.find({ _id: postId });
// });


Meteor.publish("recipesAll", function publishRecipesHome(limit, skip, searchArray) {
    check(skip, Number);
    check(limit, Number);
    if(searchArray == false) {
        return Recipes.find(
            // { private: 'active', postType: 'clubPost', vendorGroup: clubName }, 
            { $or: [ { private: { $ne: true } }, { owner: this.userId } ] },
            { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: limit, skip: skip }
        );
    } else {
        return Recipes.find( 
    {$and: [
        { searchIndex: { $all: searchArray } },
        { $or: [ { private: { $ne: true } }, { owner: this.userId } ] }
    ]},
    { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: limit, skip: skip }
        );
    }
});

Meteor.publish("recipesMy", function publishRecipesHome(limit, skip, searchArray) {
    check(skip, Number);
    check(limit, Number);
    if(searchArray == false) {
        return Recipes.find(
            // { private: 'active', postType: 'clubPost', vendorGroup: clubName }, 
            { owner: this.userId },
            { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: limit, skip: skip }
        );
    } else {
        return Recipes.find( 
    {$and: [
        { searchIndex: { $all: searchArray } },
        { owner: this.userId }
    ]},
    { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: limit, skip: skip }
        );
    }
});

Meteor.publish("recipesMy9", function publishRecipesMy() {
    return Recipes.find(
        { owner: this.userId },
        { fields: { _id: 1, private: 1, name: 1, images: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: 9}
    );
});

Meteor.publish("recipesUser9", function publishRecipesUser(currUserName) {
    return Recipes.find(
        {$and: [
            { username: currUserName },
            { private: { $ne: true } }
        ]},
        { fields: { _id: 1, private: 1, name: 1, images: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: 9}
    );
});

Meteor.publish("recipesUser", function publishRecipesHome(currUser, limit, skip, searchArray) {
    check(skip, Number);
    check(limit, Number);
    check(currUser, String);

    const profileUser = Meteor.users.find({ username: currUser }).fetch()[0];
    if(searchArray == false) {
        return Recipes.find(
            {$and: [
                { owner: profileUser._id },
                { $or: [ 
                    { private: { $ne: true } },
                    {$and: [ 
                        {privateAllow: {$exists: true}},
                        {privateAllow: { $in: [this.userId] }} 
                    ]} 
                ]}
            ]},
            { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: limit, skip: skip }
        );
    } else {
        return Recipes.find( 
            {$and: [
                { searchIndex: { $all: searchArray } },
                { owner: profileUser._id },
                { $or: [ 
                    { private: { $ne: true } },
                    {$and: [ 
                        {privateAllow: {$exists: true}},
                        {privateAllow: { $in: [this.userId] }} 
                    ]} 
                ]}
            ]},
    { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: limit, skip: skip }
        );
    }
});


Meteor.publish("recipesFav", function publishRecipesFav(limit, searchArray) {

    check(limit, Number);
    
    const favorited = Meteor.users.find({ _id: this.userId }).fetch()[0].public.favorites;
    if(favorited===false) {
        return this.ready()
    }
    const favoriteIds = Object.keys(favorited);

    if(searchArray == false) {
        return Recipes.find(
            {$and: [
                { _id: { $in: favoriteIds } },
                { $or: [ 
                    { private: { $ne: true } }, 
                    { owner: this.userId },  
                    {$and: [ 
                        {privateAllow: {$exists: true}},
                        {privateAllow: { $in: [this.userId] }} 
                    ]} 
                ]}
            ]},
            { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: limit }
        );
    } else {
        return Recipes.find( 
    {$and: [
        { _id: { $in: favoriteIds } },
        { searchIndex: { $all: searchArray } },
        { $or: [ 
            { private: { $ne: true } }, 
            { owner: this.userId },  
            {$and: [ 
                {privateAllow: {$exists: true}},
                {privateAllow: { $in: [this.userId] }} 
            ]} 
        ] }
    ]},
    { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: limit }
        );
    }
});


Meteor.publish("recipesFav12", function publishRecipesFav() {

    return Recipes.find(
        // { private: 'active', postType: 'clubPost', vendorGroup: clubName }, 
        { $or: [ { private: { $ne: true } }, { owner: this.userId } ] },
        { fields: { _id: 1, private: 1, name: 1, category: 1, description: 1, ingridients: 1, images: 1, time: 1, favorite: 1, starRatingByUser: 1, createdAt: 1 }, sort: { favorite: -1 }, limit: 12}
    );

});

Meteor.publish("recipesNew8", function publishRecipesNew() {

    return Recipes.find(
        // { private: 'active', postType: 'clubPost', vendorGroup: clubName }, 
        { private: { $ne: true } },
        { fields: { _id: 1, private: 1, name: 1, category: 1, images: 1, createdAt: 1 }, sort: { createdAt: -1 }, limit: 8}
    );

});

Meteor.publish('sharedToUser.recipes', function publishSharedToUserRecipes() {
    return SharedRecipes.find(
        { sentTo: this.userId },
        { fields: { _id: 1, recipeId: 1, recipeName: 1, createdAt: 1, sentTo: 1, sentBy: 1, sentByName: 1, createdAt: 1 }, sort: { createdAt: -1 }});
});

Meteor.publish('userProfile', function publishUserProfile(uName) {
    const profileUser = Meteor.users.find({ username: uName }).fetch()[0];
    return Meteor.users.find(
        { _id: profileUser._id },
        { fields: { _id: 1, username: 1, 'profile.profilePhotoUrl': 1}}
    );
});


Meteor.publish('friends.friendsActive', function() {
    return Meteor.users.find({ "public.friends.active": { $in: [this.userId] } }, {
        fields: {
            _id: 1,
            'username': 1,
            'profile.profilePhotoUrl': 1
        }
    });
});

Meteor.publish('friends.friendsSent', function() {
    return Meteor.users.find({ "public.friends.received": { $in: [this.userId] } }, {
        fields: {
            _id: 1,
            'username': 1,
            'profile.profilePhotoUrl': 1
        }
    });
});

Meteor.publish('friends.friendsReceived', function() {
    return Meteor.users.find({ "public.friends.sent": { $in: [this.userId] } }, {
        fields: {
            _id: 1,
            'username': 1,
            'profile.profilePhotoUrl': 1
        }
    });
});

Meteor.publish('shopListPersonal', function() {
    return ShopLists.find(
        { "owner" : this.userId},
        { fields: {
            _id: 1,
            createdAt: 1,
            'username': 1,
            'owner': 1,
            'entries': 1,
            'recipes': 1,
            'counter': 1
        }});
});





// [/^salad/]
// db.getCollection('recipes').find(
//     { searchIndex: { $all: ["test"] } }
//     ).explain("executionStats");




// Meteor.publish('users.sharedToUser.recipes', function publishSharedToUserRecipes() {
//     return Meteor.users.find(this.userId, 
//         {fields: { _id: 1, 'public.sharedToUser.sharedRecipes': 1}, sort: { recipeName: -1 }, limit: 3}
//         );
// });