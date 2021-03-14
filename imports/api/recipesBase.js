import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

// import { Accounts } from 'meteor/accounts-base'
// import { Email } from 'meteor/email';

export const Recipes = new Mongo.Collection("recipes");
export const SharedRecipes = new Mongo.Collection("sharedRecipes");
export const ShopLists = new Mongo.Collection("shopLists");

if (Meteor.isServer){

Meteor.methods({

    // CREATE NEW RECIPE
    "recipes.insert"(
      name,
      category,
      description,
      directions,
      ingridients,
      images,
      time,
      private,
      video
  ) {
      
      check(name, String);
      check(category, String);
      check(description, String);
      check(directions, Array);
      check(time, Number);
      check(images, Array);
      check(ingridients, Array);
      check(private, Boolean);
      check(video, String);

      const part1Arr = ingridients
          .map(function (x) {
              return x[0].toLowerCase();
          })
          .filter(function (x) {
              return x.length > 2;
          });
      const part2Arr = name
          .toLowerCase()
          .split(" ")
          .filter(function (x) {
              return x.length > 2;
          });
      const allPartsArr = part1Arr.concat(part2Arr);
      const searchIndex = allPartsArr.filter((item, index) => {
          return allPartsArr.indexOf(item) == index;
      });
      check(searchIndex, Array);


      if (images.length < 1 || images.length > 3) {
          throw new Meteor.Error("error-photos", "Please add at least one recipe photo!");
      }

      // check if link(s) is(are) propper
      const checkLinkUrl = Meteor.absoluteUrl();
      const isPropper = (currentValue) => currentValue.startsWith("..");
      if (images.every(isPropper)===false) {
        throw new Meteor.Error("error-photos", "Bad photo link(s)");
      }

      try {
        if (Meteor.userId()) {

          Recipes.insert({
              name,
              category,
              description,
              directions,
              ingridients,
              searchIndex,
              images,
              time,
              private,
              video,
              createdAt: new Date(), // current time
              owner: Meteor.userId(),
              username: Meteor.user().username,
          });

          return { isError: false };
        } else {
          throw new Meteor.Error("not-logged-in", "You are not logged in");
        }
      } catch (err) {
        return { isError: true, err };
      }
      
  },

  // DELETE RECIPE
  "recipes.remove"(recipeId) {
      check(recipeId, String);
      const recipe = Recipes.findOne(recipeId);

      try {
          if (recipe.owner === this.userId) {
              Recipes.remove(recipeId);
          } else {
              throw new Meteor.Error(
                  "not-owner",
                  "You are not author of this recipe or not logged in"
              );
          }
      } catch (err) {
          return { isError: true, err };
      }
  },
  
  // sendVerificationLink() {
  // Email.send({
  //   to: "p.kostic@aol.com",
  //   from: "p.kostic@aol.com",
  //   subject: "Example Email",
  //   text: "The contents of our email in plain text.",
  // });
  // console.log(Accounts.sendVerificationEmail( userId ));
  // return Accounts.sendVerificationEmail( userId );
  

  postsTotal: function () {
    return Recipes.find({ $or: [ { private: { $ne: true } }, { owner: this.userId } ] }).count();
  },

  postsCategoryTotal: function (categoryName) {
    return Recipes.find(
      {$and: [
        { category: categoryName },
        { $or: [ { private: { $ne: true } }, { owner: this.userId } ] }
      ]}
    ).count();
  },

  getUserPostsTotal: function () {
    return Recipes.find({ owner: this.userId }).count();
  },

  getUserFavoritesCount: () => {
    // return Meteor.users.find({ _id: Meteor.userId() }).fetch()[0].public.favorites.count();
    if (Meteor.userId()) {
      return Meteor.user().public?.favorites;
    }
  },

  getCategoryImg() {
    const catArr = [
      "Dressings and Sauces",
      "Appetizers",
      "Salads and Sandwiches",
      "Soups and Stews",
      "Vegetables",
      "Vegan",
      "Gluten Free",
      "Dairy Free",
      "Rice, Grains and Beans",
      "Pasta",
      "Eggs and Breakfast",
      "Meat",
      "Slow Cooker and Pressure Cooker",
      "Bread and Pizza",
      "Quick Breads and Muffins",
      "Cookies",
      "Brownies and Bars",
      "Cakes",
      "Pies",
      "Fruit Desserts",
      "Drinks",
      "Preserving",
      "Freezer Meals",
      "Food Storage",
      "Kids in the Kitchen",
    ];
    const catObj = {};
    // return Meteor.users.find({ _id: Meteor.userId() }).fetch()[0].public.favorites.count();
    if (Meteor.userId()) {
      catArr.forEach((el) => {
        const a = Recipes.findOne({ category: el }, { fields: { images: 1 } });
        if (a) {
          catObj[el] = a["images"][0];
        }
      });
      console.log(catObj);
      return catObj;
      // return Recipes.findOne( {category:"Meat"}, {} );
    }
  },

  getRandomRecipe() {
    // return Meteor.users.find({ _id: Meteor.userId() }).fetch()[0].public.favorites.count();
    // if(Meteor.userId()) {
    const countIt = Recipes.find({ private: { $ne: true } }).count();
    const skip = Math.floor(Math.random() * countIt);
    return Recipes.findOne({ private: { $ne: true } }, { skip: skip });
    // }
  },


  // add or remove recipe from favorites
  "add.to.favorites"(recipeId) {
    console.log("working");
    check(recipeId, String);

    try {
      if (Meteor.userId()) {
        Meteor.users.update(
          { _id: this.userId },
          { $set: { ["public.favorites." + recipeId]: true } }
          // this will push (or create) into object "public" create (or update) array "favorites" with value
          // { $push: { "public": { test: 89 } } }
          // this will push (or create) array "public"
        );
        Recipes.update(
          { _id: recipeId },
          {
            $inc: { favorite: 1 },
            // $inc: { starRating: -20 },
            // avgQuantity: { $avg: "$starRatingByUser" },
            //  $inc: { "starRating": star }
          }
        );
        return { isError: false };
      } else {
        throw new Meteor.Error("not-logged-in", "Log in to add to favorites");
      }
    } catch (err) {
      return { isError: true, err };
    }

    // const recipe = Recipes.findOne(recipeId);

    // Meteor.users.update({ _id: Meteor.userId() }, {
    //    $set: { "public.favorites": recipeId }
    // })
    // Meteor.users.public.favorites.insert({
    //   recipeId
    // });
  },
  "remove.from.favorites"(recipeId) {
    console.log("working");
    check(recipeId, String);

    try {
      if (Meteor.userId()) {
        Meteor.users.update(
          { _id: this.userId },
          { $unset: { ["public.favorites." + recipeId]: true } }
        );
        Recipes.update(
          { _id: recipeId },
          {
            $inc: { favorite: -1 },
            // $inc: { starRating: -20 },
            // avgQuantity: { $avg: "$starRatingByUser" },
            //  $inc: { "starRating": star }
          }
        );
        return { isError: false };
      } else {
        throw new Meteor.Error("not-logged-in", "Log in to add to favorites");
      }
    } catch (err) {
      return { isError: true, err };
    }
  },
  // 'rateRecipe.insert'(star, recipeId) {

  //   check(star, Number);

  //   // Make sure the user is logged in before inserting a task
  //   if (! this.userId) {
  //     throw new Meteor.Error('not-authorized');
  //   }

  //   Meteor.users.update({ _id: Meteor.userId() }, {
  //      $set: { ["public.starRating." + recipeId]: star }
  //   })
  // },

  //   if (type === 'clubPost') {
  //     Meteor.users.update(
  //         { _id: Meteor.userId() },
  //         {
  //             $push: {
  //                 'public.love.posts.clubPosts.list': postId
  //             },
  //             $inc: { 'public.love.posts.clubPosts.counter': 1 }
  //         }
  //     );
  // }

  "rateRecipe.insert"(star, recipeId) {
    check(star, Number);

    // Posts.update(
    //   {
    //     _id: "abcdef123",
    //     myField: {$exists: false, },
    //   },
    //   {
    //     $set: {
    //       myField: "myValue...",
    //     },
    //   }
    // );

    try {
      if (Meteor.userId()) {
        console.log({ star });
        console.log({ recipeId });
        // console.log(currentStarRating, "from method current star rating");
        let thisaUserId = this.userId;
        console.log(this);
        let currentStarRating = 0;

        // if (Recipes.findOne({starRatingByUser: this.userId, note:{ $exists: true}})) {
        const chechit = Recipes.findOne({
          ["starRatingByUser." + this.userId]: { $exists: true },
        });
        if (chechit) {
          console.log("true it");
          // currentStarRating = this.starRatingByUser[thisaUserId];
        } else {
          console.log("false it");
        }

        // currentStarRating = this.starRatingByUser[thisUserId];

        // const a = Recipes.find().fetch()[0].starRatingByUser;
        // for (const key of Object.keys(a)) {
        //     const val = a[key];
        //     console.log(val);
        // }

        Recipes.update(
          { _id: recipeId },
          {
            $set: { ["starRatingByUser." + this.userId]: star },
            // $inc: { starRating: -20 },
            // avgQuantity: { $avg: "$starRatingByUser" },
            //  $inc: { "starRating": star }
          }
        );
        return { isError: false };
      } else {
        throw new Meteor.Error("not-logged-in", "Log in to rate recipe");
      }
    } catch (err) {
      return { isError: true, err };
    }
  },

  // if(foundRecipe.privateAllow) {
  //   const inPrivateAllow = (foundRecipe.privateAllow).includes(toUser._id);
  //   console.log("inPrivateAllow: ", inPrivateAllow);
  // } else {
  //   const inPrivateAllow = false;
  //   console.log("nothing here");
  // }

  // const inPrivateAllow = Recipes.findOne(
  //   {$and: [
  //     { _id: recipeId },
  //     { privateAllow: { $in: ["dfdsfdsf"] }}
  //   ] }
  // ).privateAllow;

  // console.log(inPrivateAllow,"- is in p owner");
  // const sentDate = Date.now();

  "share.recipe"(recipeId, recipeName, username) {
    // (Meteor.userId()) {
    //   Meteor.users.update(
    //     { _id: this.userId },

    // try {
    //   if(Meteor.userId()) {
    //     if (Meteor.users.find( { _id: this.userId, "public.friends.sent": { $in: [ toUserId ] }  } ).count() > 0 ) {
    //       throw new Meteor.Error('not-logged-in', 'Already sent friend request')
    //     } else if (Meteor.users.find( { _id: this.userId, "public.friends.received": { $in: [ toUserId ] }  } ).count() > 0 ) {
    //       throw new Meteor.Error('not-logged-in', 'This user sent you a friend request')
    //     } else if (Meteor.users.find( { _id: this.userId, "public.friends.active": { $in: [ toUserId ] }  } ).count() > 0 ) {
    //       throw new Meteor.Error('not-logged-in', 'This user is already your friend')
    //     }

    console.log("working");
    check(recipeId, String);
    check(username, String);
    check(recipeName, String);

    // console.log(Meteor.userId());

    try {
      if (Meteor.userId()) {
        const foundRecipe = Recipes.findOne({ _id: recipeId });
        const toUser = Meteor.users.find({ username: username }).fetch()[0];
        const isPrivate = foundRecipe.private;
        const isOwner = foundRecipe.owner == this.userId;

        if (!toUser) {
          throw new Meteor.Error("no-to-user", "No user with username '" + username + "' found!");
        }

        if (
          Meteor.users
            .find({
              _id: this.userId,
              "public.friends.active": { $in: [toUser._id] },
            })
            .count() > 0
        ) {
            SharedRecipes.insert({
              recipeId: recipeId,
              recipeName: recipeName,
              createdAt: new Date(), // current time
              sentTo: toUser._id,
              sentBy: this.userId,
              sentByName: Meteor.user().username,
            });
            Meteor.users.update(
              { _id: toUser._id },
              { $set: { 'notice.inbox' : true }}
            );
            if (isPrivate) {
              if (isOwner) {
                Recipes.update(
                  { _id: recipeId },
                  // addToSet is same as push but it will not add new entry in array if that entry already exists
                  { $addToSet: { privateAllow: toUser._id } }
                );
              } else {
                throw new Meteor.Error(
                  "not-private-owner",
                  "You can't share someone else’s private recipe!"
                );
              }
            }

          return { isError: false };
        } else {
          throw new Meteor.Error(
            "not-logged-in",
            "This user is not in your friend list"
          );
        }
      } else {
        throw new Meteor.Error("not-logged-in", "Log in to add to favorites");
      }
    } catch (err) {
      return { isError: true, err };
    }
  },

  sendFriendRequest(toUserId) {
    try {
      if (Meteor.userId()) {
        if (
          Meteor.users
            .find({
              _id: this.userId,
              "public.friends.sent": { $in: [toUserId] },
            })
            .count() > 0
        ) {
          throw new Meteor.Error(
            "not-logged-in",
            "Already sent friend request"
          );
        } else if (
          Meteor.users
            .find({
              _id: this.userId,
              "public.friends.received": { $in: [toUserId] },
            })
            .count() > 0
        ) {
          throw new Meteor.Error(
            "not-logged-in",
            "This user sent you a friend request"
          );
        } else if (
          Meteor.users
            .find({
              _id: this.userId,
              "public.friends.active": { $in: [toUserId] },
            })
            .count() > 0
        ) {
          throw new Meteor.Error(
            "not-logged-in",
            "This user is already your friend"
          );
        }
        Meteor.users.update(
          {
            _id: this.userId,
            "public.friends.sent": { $nin: [toUserId] },
            "public.friends.received": { $nin: [toUserId] },
            "public.friends.active": { $nin: [toUserId] },
          },
          { $addToSet: { "public.friends.sent": toUserId } }
        );
        Meteor.users.update(
          {
            _id: toUserId,
            "public.friends.received": { $nin: [this.userId] },
            "public.friends.sent": { $nin: [this.userId] },
            "public.friends.active": { $nin: [this.userId] },
          },
          { $addToSet: { "public.friends.received": this.userId },
            $set: { 'notice.friendRequest' : true }
          }
        );
        return { isError: false };
      } else {
        throw new Meteor.Error(
          "not-logged-in",
          "Log in to send friend request"
        );
      }
    } catch (err) {
      return { isError: true, err };
    }
  },

  acceptFriendRequest(toUserId) {
    console.log(toUserId);
    try {
      if (Meteor.userId()) {
        if (
          Meteor.users
            .find({
              _id: this.userId,
              "public.friends.sent": { $in: [toUserId] },
            })
            .count() > 0
        ) {
          throw new Meteor.Error(
            "not-logged-in",
            "Already sent friend request"
          );
        } else if (
          Meteor.users
            .find({
              _id: this.userId,
              "public.friends.active": { $in: [toUserId] },
            })
            .count() > 0
        ) {
          throw new Meteor.Error(
            "not-logged-in",
            "This user is already your friend"
          );
        }
        Meteor.users.update(
          {
            _id: this.userId,
            "public.friends.sent": { $nin: [toUserId] },
            "public.friends.received": { $in: [toUserId] },
            "public.friends.active": { $nin: [toUserId] },
          },
          {
            $addToSet: { "public.friends.active": toUserId },
            $pull: { "public.friends.received": toUserId },
          }
        );
        Meteor.users.update(
          {
            _id: toUserId,
            "public.friends.received": { $nin: [this.userId] },
            "public.friends.sent": { $in: [this.userId] },
            "public.friends.active": { $nin: [this.userId] },
          },
          {
            $addToSet: { "public.friends.active": this.userId },
            $pull: { "public.friends.sent": this.userId },
            $set: { 'notice.friendAccept' : true }
          }
        );
        return { isError: false };
      } else {
        throw new Meteor.Error(
          "not-logged-in",
          "Log in to accept friend request"
        );
      }
    } catch (err) {
      return { isError: true, err };
    }
  },

  removeFriendship(toUserId) {
    console.log(toUserId);
    try {
      if (Meteor.userId()) {
        Meteor.users.update(
          { _id: this.userId, "public.friends.active": { $in: [toUserId] } },
          {
            $pull: { "public.friends.active": toUserId },
          }
        );
        Meteor.users.update(
          { _id: toUserId, "public.friends.active": { $in: [this.userId] } },
          {
            $pull: { "public.friends.active": this.userId },
          }
        );
        return { isError: false };
      } else {
        throw new Meteor.Error("not-logged-in", "You are not logged in");
      }
    } catch (err) {
      return { isError: true, err };
    }
  },

  removeFromSent(toUserId) {
    console.log(toUserId);
    try {
      if (Meteor.userId()) {
        Meteor.users.update(
          { _id: this.userId, "public.friends.sent": { $in: [toUserId] } },
          {
            $pull: { "public.friends.sent": toUserId },
          }
        );
        Meteor.users.update(
          { _id: toUserId, "public.friends.received": { $in: [this.userId] } },
          {
            $pull: { "public.friends.received": this.userId },
          }
        );
        return { isError: false };
      } else {
        throw new Meteor.Error("not-logged-in", "You are not logged in");
      }
    } catch (err) {
      return { isError: true, err };
    }
  },

    // CREATE NEW SHOPLIST
    "shoplist.insert"(selectedIngridients, recId, recName, recImage) {


      if (selectedIngridients.length < 1) {
        throw new Meteor.Error("no-ingridients", "Select at least one ingridient");
      }

      const checkIt = ShopLists.findOne({
        "owner": this.userId,
        "recipes": {$elemMatch: {recId: recId}}
      });

      if (checkIt) {
        throw new Meteor.Error("already-in", "This recipe is already in your shoplist");
      }

      // { $set: { ["public.sharedToUser.recipes." + sentDate]: {
      //   "recipeId" : recipeId,
      //   "sentBy" : this.userId,
      //   "sentByName" : Meteor.user().username,
      //   "dateSent" : sentDate
      // } }}


      // { _id: 1, colors: "blue,green,red" }
      // The following $addToSet operation on the non-array field colors fails:
      
      // db.foo.update(
      //    { _id: 1 },
      //    { $addToSet: { colors: "c" } }
      // )


      try {
        if (Meteor.userId()) {
          ShopLists.update(
            { owner: this.userId },
            {
                $set: {
                  "createdAt": new Date(),
                  "username": Meteor.user().username,
                  ["counter." + recId] : selectedIngridients.length
                }, 
                $addToSet: {
                  "entries": { $each:selectedIngridients},
                  "recipes":
                  {
                    "recId" : recId,
                    "name" : recName,
                    "cover" : recImage
                  }
              },
            },
            {upsert: true}
          );
          return { isError: false };
        } else {
          throw new Meteor.Error("not-logged-in", "You are not logged in");
        }
      } catch (err) {
        return { isError: true, err };
      }


    
  },


    // DELETE SHOPLIST
    "shoplist.deleteList"(recId) {

      try {
        if (Meteor.userId()) {


          ShopLists.remove(
            {"owner": this.userId},
            {}
          )

          return { isError: false };
        } else {
          throw new Meteor.Error("not-logged-in", "You are not logged in");
        }
      } catch (err) {
        return { isError: true, err };
      }

  },

    // DELETE RECIPE FROM SHOPLIST
    "shoplist.deleteRecipe"(recId) {

      try {
        if (Meteor.userId()) {

          ShopLists.update(
            {"owner": this.userId},
            {
              $pull: {
                recipes: {recId: {$in: [recId]}},
                entries: {recipe: {$in: [recId]}}
              },
              $unset: { ["counter." + recId]: { $exists: true } } 
            }
          );

          return { isError: false };
        } else {
          throw new Meteor.Error("not-logged-in", "You are not logged in");
        }
      } catch (err) {
        return { isError: true, err };
      }

  },

    // DELETE FINISHED INGREDIENTS FROM RECIPE IN SHOPLIST
    "shoplist.deleteFinishedIngredients"(recId) {

      try {
        if (Meteor.userId()) {

          ShopLists.update(
            {"owner": this.userId},
            {
              $pull: {
                entries: {recipe: {$in: [recId]}, checked: true}
              },
            }
          );

          return { isError: false };
        } else {
          throw new Meteor.Error("not-logged-in", "You are not logged in");
        }
      } catch (err) {
        return { isError: true, err };
      }

  },

  "check.ingridient"(ingridentName, recipeId, checked) {
      check(ingridentName, String);
      check(recipeId, String);
      check(checked, Boolean);
      // const ingridient = ShopLists.findOne({entries: {$elemMatch: {name: ingridentName, recipe: recipeId}}})

      if (checked) {
        ShopLists.update(
          { owner: this.userId, entries: {$elemMatch: {name: ingridentName, recipe: recipeId}} },
          { $set: { 'entries.$.checked' : checked }, $inc: { ['counter.' + recipeId]: -1 }}
        )
      } else {
        ShopLists.update(
          { owner: this.userId, entries: {$elemMatch: {name: ingridentName, recipe: recipeId}} },
          { $set: { 'entries.$.checked' : checked }, $inc: { ['counter.' + recipeId]: 1 }}
        )
      }

        // ShopLists.update(
        //   { owner: this.userId, entries: {$elemMatch: {name: ingridentName, recipe: recipeId}}, recipes: {$elemMatch: {recId: recipeId}}},
        //   { $set: { 'entries.$.checked' : checked },
        //   $inc: { 'recipes.$.size': 1 } }
        // )




  //    db.inventory.aggregate([
  //     {
  //        $project: {
  //           item: 1,
  //           numberOfColors: { $cond: { if: { $isArray: "$colors" }, then: { $size: "$colors" }, else: "NA"} }
  //        }
  //     }
  //  ] )


  //    db.collection.update(
  //     { <array>: value ... },
  //     { <update operator>: { "<array>.$" : value } }
  //  )
   

      // console.log(ingridient);
      // try {
      //     if (recipe.owner === this.userId) {
      //         Recipes.remove(recipeId);
      //     } else {
      //         throw new Meteor.Error(
      //             "not-owner",
      //             "You are not author of this recipe or not logged in"
      //         );
      //     }
      // } catch (err) {
      //     return { isError: true, err };
      // }
  },
  "delete.ingridient"(ingridentName, recipeId, checked) {
    check(ingridentName, String);
    check(recipeId, String);
    check(checked, Boolean);
    // const ingridient = ShopLists.findOne({entries: {$elemMatch: {name: ingridentName, recipe: recipeId}}})

    if (checked) {
      ShopLists.update(
        { owner: this.userId },
        { $pull: {entries: {name: ingridentName, recipe: recipeId, checked:checked}}}
      )
    } else {
      ShopLists.update(
        { owner: this.userId },
        { $pull: {entries: {name: ingridentName, recipe: recipeId, checked:checked}}, $inc: { ['counter.' + recipeId]: -1 }}
      )
    }
  },
  "change.multi.ingridient"(ingridentName, recipeId, multiplier) {
    check(ingridentName, String);
    check(recipeId, String);
    check(multiplier, Number);
    // check(owner, String);
    // const ingridient = ShopLists.findOne({entries: {$elemMatch: {name: ingridentName, recipe: recipeId}}})

    ShopLists.update(
      { owner: this.userId, entries: {$elemMatch: {name: ingridentName, recipe: recipeId}} },
      { $set: { 'entries.$.multi' : multiplier }}
    )
  },

  "testUserId"() {
      if (Meteor.userId()) {
        return { isError: false };
      } else {
        throw new Meteor.Error("not-logged-in", "You are not logged in");
      }
  },

  "setAvatarPicture"(img) {
    check(img, String);

    // check if link is propper
    const checkLinkUrl = Meteor.absoluteUrl();
    if (img.startsWith("..")===false) {
      throw new Meteor.Error("error-photos", "Bad photo link");
    }

    try {
        if (Meteor.userId()) {
          Meteor.users.update(
            { _id: this.userId },
            { $set: { 'profile.profilePhotoUrl' : img }}
          );
          return { isError: false };
        } else {
          throw new Meteor.Error("not-logged-in", "You are not logged in");
        }
      } catch (err) {
        return { isError: true, err };
      }
  },
  "read.inbox"() {
    try {
      if (Meteor.userId()) {
        Meteor.users.update(
          { _id: this.userId },
          { $set: { 'notice.inbox' : false }}
        );
        return { isError: false };
      } else {
        throw new Meteor.Error("not-logged-in", "You are not logged in");
      }
    } catch (err) {
      return { isError: true, err };
    }
  },
  "read.received"() {
    try {
      if (Meteor.userId()) {
        Meteor.users.update(
          { _id: this.userId },
          { $set: { 'notice.friendRequest' : false }}
        );
        return { isError: false };
      } else {
        throw new Meteor.Error("not-logged-in", "You are not logged in");
      }
    } catch (err) {
      return { isError: true, err };
    }
  },
  "read.accepted"() {
    try {
      if (Meteor.userId()) {
        Meteor.users.update(
          { _id: this.userId },
          { $set: { 'notice.friendAccept' : false }}
        );
        return { isError: false };
      } else {
        throw new Meteor.Error("not-logged-in", "You are not logged in");
      }
    } catch (err) {
      return { isError: true, err };
    }
  },

  // getUserModalList: function () {
  //   if (Meteor.userId()) {
  //     console.log("inside method");
  //     return Meteor.user().public?.friends?.active;
  //   }
  // },



});


}

// Meteor.users.update(
//   { _id: toUser._id },
//   { $push: { "public.sharedToUser.sharedRecipes":
    
//       {
//         "recipeId" : recipeId,
//         "recipeName": recipeName,
//         "sentBy" : this.userId,
//         "sentByName" : Meteor.user().username,
//         "dateSent" : sentDate
//       }
    
//   }}
//   // { $push: { "public.sharedToUser.recipes":  recipeId  } }

//   // { $set: { ["public.favorites." + recipeId]: true }}
//   // this will push (or create) into object "public" create (or update) array "favorites" with value
//   // { $push: { "public": { test: 89 } } }
//   // this will push (or create) array "public"
// );