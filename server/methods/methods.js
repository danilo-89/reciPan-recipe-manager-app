import _ from 'lodash';
import { check } from "meteor/check";
import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

Meteor.methods({



});


// import { Mongo } from "meteor/mongo";
// import { Meteor } from "meteor/meteor";
// import { check } from "meteor/check";
// import _ from 'lodash';


// Meteor.methods({

//     // sendVerificationLink() {
//     // Email.send({
//     //   to: "p.kostic@aol.com",
//     //   from: "p.kostic@aol.com",
//     //   subject: "Example Email",
//     //   text: "The contents of our email in plain text.",
//     // });
//     // console.log(Accounts.sendVerificationEmail( userId ));
//     // return Accounts.sendVerificationEmail( userId );
//     sendVerificationLink: () => {
//       // let getVerLink = new Promise (function (resolve, reject) {
//       //   console.log(Meteor.user().services.email.verificationTokens[0].token);
//       // }
  
//       var mailMessage = "Confirm your account";
//       // + getVerToken;
  
//       var Email = {
//         send: function (a) {
//           return new Promise(function (n, e) {
//             (a.nocache = Math.floor(1e6 * Math.random() + 1)),
//               (a.Action = "Send");
//             var t = JSON.stringify(a);
//             Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) {
//               n(e);
//             });
//           });
//         },
//         ajaxPost: function (e, n, t) {
//           var a = Email.createCORSRequest("POST", e);
//           a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
//             (a.onload = function () {
//               var e = a.responseText;
//               null != t && t(e);
//             }),
//             a.send(n);
//         },
//         ajax: function (e, n) {
//           var t = Email.createCORSRequest("GET", e);
//           (t.onload = function () {
//             var e = t.responseText;
//             null != n && n(e);
//           }),
//             t.send();
//         },
//         createCORSRequest: function (e, n) {
//           var t = new XMLHttpRequest();
//           return (
//             "withCredentials" in t
//               ? t.open(e, n, !0)
//               : "undefined" != typeof XDomainRequest
//               ? (t = new XDomainRequest()).open(e, n)
//               : (t = null),
//             t
//           );
//         },
//       };
  
    
//       if (!Meteor.userId()) {
//         throw new Meteor.Error("not-logged-in", "You are not logged in.");
//       } 
//       // else {
//       //   console.log(Meteor.user().services.email.verificationTokens[0].token)
//       // }
  
      
//           // const body = Meteor.user()?.services?.email?.verificationTokens?.[0]?.token;
//           // console.log(body,"dsfdsffdsfsdfdsfds")
  
//           const body = _.get(Meteor.user(), "services.email.verificationTokens[0].token");
//   if (!body) {
//     throw new Meteor.Error("no token");
//   }
//          console.log(body)
  
//               Email.send({
//                 SecureToken: "d052464d-4195-4e8e-8f72-4ba87dc42877",
//                 To: "retretertret345@yopmail.com",
//                 From: "developing2021@gmail.com",
//                 Subject: "This is the subject",
//                 Body: body,
//               }).catch((error) => console.log("error: ", error))
  
//     },
  
//     postsTotal: function () {
//       return Recipes.find().count();
//     },
  
//     getUserPostsTotal: function () {
//       return Recipes.find({ owner: this.userId }).count();
//     },
  
//     getUserFavoritesCount: () => {
//       // return Meteor.users.find({ _id: Meteor.userId() }).fetch()[0].public.favorites.count();
//       if (Meteor.userId()) {
//         return Meteor.user().public.favorites;
//       }
//     },
  
//     getCategoryImg() {
//       const catArr = [
//         "Dressings and Sauces",
//         "Appetizers",
//         "Salads and Sandwiches",
//         "Soups and Stews",
//         "Vegetables",
//         "Vegan",
//         "Glutten Free",
//         "Dairy Free",
//         "Rice, Grains and Beans",
//         "Pasta",
//         "Eggs and Breakfast",
//         "Meat",
//         "Slow Cooker and Pressure Cooker",
//         "Bread and Pizza",
//         "Quick Breads and Muffins",
//         "Cookies",
//         "Brownies and Bars",
//         "Cakes",
//         "Pies",
//         "Fruit Desserts",
//         "Drinks",
//         "Preserving",
//         "Freezer Meals",
//         "Food Storage",
//         "Kids in the Kitchen",
//       ];
//       const catObj = {};
//       // return Meteor.users.find({ _id: Meteor.userId() }).fetch()[0].public.favorites.count();
//       if (Meteor.userId()) {
//         catArr.forEach((el) => {
//           const a = Recipes.findOne({ category: el }, { fields: { images: 1 } });
//           if (a) {
//             catObj[el] = a["images"][0];
//           }
//         });
//         console.log(catObj);
//         return catObj;
//         // return Recipes.findOne( {category:"Meat"}, {} );
//       }
//     },
  
//     getRandomRecipe() {
//       // return Meteor.users.find({ _id: Meteor.userId() }).fetch()[0].public.favorites.count();
//       // if(Meteor.userId()) {
//       const countIt = Recipes.find().count();
//       const skip = Math.floor(Math.random() * countIt);
//       return Recipes.findOne({}, { skip: skip });
//       // }
//     },
  
//     "recipes.insert"(
//       name,
//       category,
//       description,
//       directions,
//       ingridients,
//       images,
//       time,
//       private
//     ) {
//       check(name, String);
//       check(category, String);
//       check(description, String);
//       check(directions, Array);
//       check(time, Number);
//       check(images, Array);
//       check(ingridients, Array);
//       check(private, Boolean);
  
//       const part1Arr = ingridients
//         .map(function (x) {
//           return x[0].toLowerCase();
//         })
//         .filter(function (x) {
//           return x.length > 2;
//         });
//       const part2Arr = name
//         .toLowerCase()
//         .split(" ")
//         .filter(function (x) {
//           return x.length > 2;
//         });
//       const allPartsArr = part1Arr.concat(part2Arr);
//       const searchIndex = allPartsArr.filter((item, index) => {
//         return allPartsArr.indexOf(item) == index;
//       });
//       check(searchIndex, Array);
  
//       // Make sure the user is logged in before inserting a recipe
//       if (!this.userId) {
//         throw new Meteor.Error("not-authorized");
//       }
  
//       Recipes.insert({
//         name,
//         category,
//         description,
//         directions,
//         ingridients,
//         searchIndex,
//         images,
//         time,
//         private,
//         createdAt: new Date(), // current time
//         owner: Meteor.userId(),
//         username: Meteor.user().username,
//       });
//     },
//     "recipes.remove"(recipeId) {
//       check(recipeId, String);
//       const recipe = Recipes.findOne(recipeId);
  
//       try {
//         if (recipe.owner === this.userId) {
//           Recipes.remove(recipeId);
//         } else {
//           throw new Meteor.Error(
//             "not-owner",
//             "You are not author of this recipe or not logged in"
//           );
//         }
//       } catch (err) {
//         return { isError: true, err };
//       }
//     },
  
//     // add or remove recipe from favorites
//     "add.to.favorites"(recipeId) {
//       console.log("working");
//       check(recipeId, String);
  
//       try {
//         if (Meteor.userId()) {
//           Meteor.users.update(
//             { _id: this.userId },
//             { $set: { ["public.favorites." + recipeId]: true } }
//             // this will push (or create) into object "public" create (or update) array "favorites" with value
//             // { $push: { "public": { test: 89 } } }
//             // this will push (or create) array "public"
//           );
//           Recipes.update(
//             { _id: recipeId },
//             {
//               $inc: { favorite: 1 },
//               // $inc: { starRating: -20 },
//               // avgQuantity: { $avg: "$starRatingByUser" },
//               //  $inc: { "starRating": star }
//             }
//           );
//           return { isError: false };
//         } else {
//           throw new Meteor.Error("not-logged-in", "Log in to add to favorites");
//         }
//       } catch (err) {
//         return { isError: true, err };
//       }
  
//       // const recipe = Recipes.findOne(recipeId);
  
//       // Meteor.users.update({ _id: Meteor.userId() }, {
//       //    $set: { "public.favorites": recipeId }
//       // })
//       // Meteor.users.public.favorites.insert({
//       //   recipeId
//       // });
//     },
//     "remove.from.favorites"(recipeId) {
//       console.log("working");
//       check(recipeId, String);
  
//       try {
//         if (Meteor.userId()) {
//           Meteor.users.update(
//             { _id: this.userId },
//             { $unset: { ["public.favorites." + recipeId]: true } }
//           );
//           Recipes.update(
//             { _id: recipeId },
//             {
//               $inc: { favorite: -1 },
//               // $inc: { starRating: -20 },
//               // avgQuantity: { $avg: "$starRatingByUser" },
//               //  $inc: { "starRating": star }
//             }
//           );
//           return { isError: false };
//         } else {
//           throw new Meteor.Error("not-logged-in", "Log in to add to favorites");
//         }
//       } catch (err) {
//         return { isError: true, err };
//       }
//     },
//     // 'rateRecipe.insert'(star, recipeId) {
  
//     //   check(star, Number);
  
//     //   // Make sure the user is logged in before inserting a task
//     //   if (! this.userId) {
//     //     throw new Meteor.Error('not-authorized');
//     //   }
  
//     //   Meteor.users.update({ _id: Meteor.userId() }, {
//     //      $set: { ["public.starRating." + recipeId]: star }
//     //   })
//     // },
  
//     //   if (type === 'clubPost') {
//     //     Meteor.users.update(
//     //         { _id: Meteor.userId() },
//     //         {
//     //             $push: {
//     //                 'public.love.posts.clubPosts.list': postId
//     //             },
//     //             $inc: { 'public.love.posts.clubPosts.counter': 1 }
//     //         }
//     //     );
//     // }
  
//     "rateRecipe.insert"(star, recipeId) {
//       check(star, Number);
  
//       // Posts.update(
//       //   {
//       //     _id: "abcdef123",
//       //     myField: {$exists: false, },
//       //   },
//       //   {
//       //     $set: {
//       //       myField: "myValue...",
//       //     },
//       //   }
//       // );
  
//       try {
//         if (Meteor.userId()) {
//           console.log({ star });
//           console.log({ recipeId });
//           // console.log(currentStarRating, "from method current star rating");
//           let thisaUserId = this.userId;
//           console.log(this);
//           let currentStarRating = 0;
  
//           // if (Recipes.findOne({starRatingByUser: this.userId, note:{ $exists: true}})) {
//           const chechit = Recipes.findOne({
//             ["starRatingByUser." + this.userId]: { $exists: true },
//           });
//           if (chechit) {
//             console.log("true it");
//             // currentStarRating = this.starRatingByUser[thisaUserId];
//           } else {
//             console.log("false it");
//           }
  
//           // currentStarRating = this.starRatingByUser[thisUserId];
  
//           // const a = Recipes.find().fetch()[0].starRatingByUser;
//           // for (const key of Object.keys(a)) {
//           //     const val = a[key];
//           //     console.log(val);
//           // }
  
//           Recipes.update(
//             { _id: recipeId },
//             {
//               $set: { ["starRatingByUser." + this.userId]: star },
//               // $inc: { starRating: -20 },
//               // avgQuantity: { $avg: "$starRatingByUser" },
//               //  $inc: { "starRating": star }
//             }
//           );
//           return { isError: false };
//         } else {
//           throw new Meteor.Error("not-logged-in", "Log in to add to rate recipe");
//         }
//       } catch (err) {
//         return { isError: true, err };
//       }
//     },
  
//     // if(foundRecipe.privateAllow) {
//     //   const inPrivateAllow = (foundRecipe.privateAllow).includes(toUser._id);
//     //   console.log("inPrivateAllow: ", inPrivateAllow);
//     // } else {
//     //   const inPrivateAllow = false;
//     //   console.log("nothing here");
//     // }
  
//     // const inPrivateAllow = Recipes.findOne(
//     //   {$and: [
//     //     { _id: recipeId },
//     //     { privateAllow: { $in: ["dfdsfdsf"] }}
//     //   ] }
//     // ).privateAllow;
  
//     // console.log(inPrivateAllow,"- is in p owner");
//     // const sentDate = Date.now();
  
//     "share.recipe"(recipeId, recipeName, username) {
//       // (Meteor.userId()) {
//       //   Meteor.users.update(
//       //     { _id: this.userId },
  
//       // try {
//       //   if(Meteor.userId()) {
//       //     if (Meteor.users.find( { _id: this.userId, "public.friends.sent": { $in: [ toUserId ] }  } ).count() > 0 ) {
//       //       throw new Meteor.Error('not-logged-in', 'Already sent friend request')
//       //     } else if (Meteor.users.find( { _id: this.userId, "public.friends.received": { $in: [ toUserId ] }  } ).count() > 0 ) {
//       //       throw new Meteor.Error('not-logged-in', 'This user sent you a friend request')
//       //     } else if (Meteor.users.find( { _id: this.userId, "public.friends.active": { $in: [ toUserId ] }  } ).count() > 0 ) {
//       //       throw new Meteor.Error('not-logged-in', 'This user is already your friend')
//       //     }
  
//       console.log("working");
//       check(recipeId, String);
//       check(username, String);
//       check(recipeName, String);
  
//       // console.log(Meteor.userId());
  
//       try {
//         if (Meteor.userId()) {
//           const foundRecipe = Recipes.findOne({ _id: recipeId });
//           const toUser = Meteor.users.find({ username: username }).fetch()[0];
//           const isPrivate = foundRecipe.private;
//           const isOwner = foundRecipe.owner == this.userId;
  
//           if (
//             Meteor.users
//               .find({
//                 _id: this.userId,
//                 "public.friends.active": { $in: [toUser._id] },
//               })
//               .count() > 0
//           ) {
//             if (toUser) {
//               SharedRecipes.insert({
//                 recipeId: recipeId,
//                 recipeName: recipeName,
//                 createdAt: new Date(), // current time
//                 sentTo: toUser._id,
//                 sentBy: this.userId,
//                 sentByName: Meteor.user().username,
//               });
//               if (isPrivate) {
//                 if (isOwner) {
//                   Recipes.update(
//                     { _id: recipeId },
//                     // addToSet is same as push but it will not add new entry in array if that entry already exists
//                     { $addToSet: { privateAllow: toUser._id } }
//                   );
//                 } else {
//                   throw new Meteor.Error(
//                     "not-private-owner",
//                     "You can't share someone else’s private recipe!"
//                   );
//                 }
//               }
//             } else {
//               throw new Meteor.Error(
//                 "no-to-user",
//                 "No user with username '" + username + "' found!"
//               );
//             }
  
//             return { isError: false };
//           } else {
//             throw new Meteor.Error(
//               "not-logged-in",
//               "This user is not in your friend list"
//             );
//           }
//         } else {
//           throw new Meteor.Error("not-logged-in", "Log in to add to favorites");
//         }
//       } catch (err) {
//         return { isError: true, err };
//       }
//     },
  
//     sendFriendRequest(toUserId) {
//       try {
//         if (Meteor.userId()) {
//           if (
//             Meteor.users
//               .find({
//                 _id: this.userId,
//                 "public.friends.sent": { $in: [toUserId] },
//               })
//               .count() > 0
//           ) {
//             throw new Meteor.Error(
//               "not-logged-in",
//               "Already sent friend request"
//             );
//           } else if (
//             Meteor.users
//               .find({
//                 _id: this.userId,
//                 "public.friends.received": { $in: [toUserId] },
//               })
//               .count() > 0
//           ) {
//             throw new Meteor.Error(
//               "not-logged-in",
//               "This user sent you a friend request"
//             );
//           } else if (
//             Meteor.users
//               .find({
//                 _id: this.userId,
//                 "public.friends.active": { $in: [toUserId] },
//               })
//               .count() > 0
//           ) {
//             throw new Meteor.Error(
//               "not-logged-in",
//               "This user is already your friend"
//             );
//           }
//           Meteor.users.update(
//             {
//               _id: this.userId,
//               "public.friends.sent": { $nin: [toUserId] },
//               "public.friends.received": { $nin: [toUserId] },
//               "public.friends.active": { $nin: [toUserId] },
//             },
//             { $addToSet: { "public.friends.sent": toUserId } }
//           );
//           Meteor.users.update(
//             {
//               _id: toUserId,
//               "public.friends.received": { $nin: [this.userId] },
//               "public.friends.sent": { $nin: [this.userId] },
//               "public.friends.active": { $nin: [this.userId] },
//             },
//             { $addToSet: { "public.friends.received": this.userId } }
//           );
//           return { isError: false };
//         } else {
//           throw new Meteor.Error(
//             "not-logged-in",
//             "Log in to send friend request"
//           );
//         }
//       } catch (err) {
//         return { isError: true, err };
//       }
//     },
  
//     acceptFriendRequest(toUserId) {
//       console.log(toUserId);
//       try {
//         if (Meteor.userId()) {
//           if (
//             Meteor.users
//               .find({
//                 _id: this.userId,
//                 "public.friends.sent": { $in: [toUserId] },
//               })
//               .count() > 0
//           ) {
//             throw new Meteor.Error(
//               "not-logged-in",
//               "Already sent friend request"
//             );
//           } else if (
//             Meteor.users
//               .find({
//                 _id: this.userId,
//                 "public.friends.active": { $in: [toUserId] },
//               })
//               .count() > 0
//           ) {
//             throw new Meteor.Error(
//               "not-logged-in",
//               "This user is already your friend"
//             );
//           }
//           Meteor.users.update(
//             {
//               _id: this.userId,
//               "public.friends.sent": { $nin: [toUserId] },
//               "public.friends.received": { $in: [toUserId] },
//               "public.friends.active": { $nin: [toUserId] },
//             },
//             {
//               $addToSet: { "public.friends.active": toUserId },
//               $pull: { "public.friends.received": toUserId },
//             }
//           );
//           Meteor.users.update(
//             {
//               _id: toUserId,
//               "public.friends.received": { $nin: [this.userId] },
//               "public.friends.sent": { $in: [this.userId] },
//               "public.friends.active": { $nin: [this.userId] },
//             },
//             {
//               $addToSet: { "public.friends.active": this.userId },
//               $pull: { "public.friends.sent": this.userId },
//             }
//           );
//           return { isError: false };
//         } else {
//           throw new Meteor.Error(
//             "not-logged-in",
//             "Log in to accept friend request"
//           );
//         }
//       } catch (err) {
//         return { isError: true, err };
//       }
//     },
  
//     removeFriendship(toUserId) {
//       console.log(toUserId);
//       try {
//         if (Meteor.userId()) {
//           Meteor.users.update(
//             { _id: this.userId, "public.friends.active": { $in: [toUserId] } },
//             {
//               $pull: { "public.friends.active": toUserId },
//             }
//           );
//           Meteor.users.update(
//             { _id: toUserId, "public.friends.active": { $in: [this.userId] } },
//             {
//               $pull: { "public.friends.active": this.userId },
//             }
//           );
//           return { isError: false };
//         } else {
//           throw new Meteor.Error("not-logged-in", "You are not logged in");
//         }
//       } catch (err) {
//         return { isError: true, err };
//       }
//     },
  
//     removeFromSent(toUserId) {
//       console.log(toUserId);
//       try {
//         if (Meteor.userId()) {
//           Meteor.users.update(
//             { _id: this.userId, "public.friends.sent": { $in: [toUserId] } },
//             {
//               $pull: { "public.friends.sent": toUserId },
//             }
//           );
//           Meteor.users.update(
//             { _id: toUserId, "public.friends.received": { $in: [this.userId] } },
//             {
//               $pull: { "public.friends.received": this.userId },
//             }
//           );
//           return { isError: false };
//         } else {
//           throw new Meteor.Error("not-logged-in", "You are not logged in");
//         }
//       } catch (err) {
//         return { isError: true, err };
//       }
//     },
//   });
  
  
  
//   // Meteor.users.update(
//   //   { _id: toUser._id },
//   //   { $push: { "public.sharedToUser.sharedRecipes":
      
//   //       {
//   //         "recipeId" : recipeId,
//   //         "recipeName": recipeName,
//   //         "sentBy" : this.userId,
//   //         "sentByName" : Meteor.user().username,
//   //         "dateSent" : sentDate
//   //       }
      
//   //   }}
//   //   // { $push: { "public.sharedToUser.recipes":  recipeId  } }
  
//   //   // { $set: { ["public.favorites." + recipeId]: true }}
//   //   // this will push (or create) into object "public" create (or update) array "favorites" with value
//   //   // { $push: { "public": { test: 89 } } }
//   //   // this will push (or create) array "public"
//   // );