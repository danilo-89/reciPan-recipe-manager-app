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
      const isPropper = (currentValue) => currentValue.startsWith("../");
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

      // EDIT RECIPE
      "recipes.edit"(
        editId,
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
        
      if (Recipes.findOne({ _id: editId } ).owner !== this.userId) {
        throw new Meteor.Error("bad-user", "Trying to edit others user recipe");
      }

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
        const isPropper = (currentValue) => currentValue.startsWith("../");
        if (images.every(isPropper)===false) {
          throw new Meteor.Error("error-photos", "Bad photo link(s)");
        }
  
        try {
          if (Meteor.userId()) {
  
            Recipes.update(
              { _id: editId, owner: Meteor.userId() },
              { $set: {
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
                username: Meteor.user().username
              }});
  
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
  

  postsTotal: function (searchArray) {

    if (!Meteor.userId()) {
      searchArray = false;
    }

    if (searchArray) {
      const checkStringMaxLength = (str, max) => typeof str === 'string' && str.length <= max;
      if (!checkStringMaxLength(searchArray.join(''), 25)) {
          throw new Meteor.Error(
              "too-long",
              "Too long search term"
          );
      }
    }

    if(searchArray == false) {

    return Recipes.find({ $or: [ { private: { $ne: true } }, { owner: this.userId } ] }).count();

    } else {

    return Recipes.find({$and: [
      { searchIndex: { $all: searchArray } },
      { $or: [ { private: { $ne: true } }, { owner: this.userId } ] }
  ]}).count();

    }

  },

  postsOtherUserTotal: function (currUser, searchArray) {
    const profileUser = Meteor.users.find({ username: currUser }).fetch()[0];

    if (!Meteor.userId()) {
      searchArray = false;
    }

    if (searchArray) {
      const checkStringMaxLength = (str, max) => typeof str === 'string' && str.length <= max;
      if (!checkStringMaxLength(searchArray.join(''), 25)) {
          throw new Meteor.Error(
              "too-long",
              "Too long search term"
            );
      }
    }

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
      ]}
    ).count();
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
      ]}
      ).count();
    }
  },

  postsMyTotal: function (searchArray) {

    if (searchArray) {
      const checkStringMaxLength = (str, max) => typeof str === 'string' && str.length <= max;
      if (!checkStringMaxLength(searchArray.join(''), 25)) {
          throw new Meteor.Error(
              "too-long",
              "Too long search term"
            );
      }
    }

    if(searchArray == false) {
      return Recipes.find({ owner: this.userId } ).count();
    } else {
      return Recipes.find({$and: [
        { searchIndex: { $all: searchArray } },
        { owner: this.userId }
    ]}).count();
    }

  },

  postsCategoryTotal: function (categoryName, searchArray) {

    if (!Meteor.userId()) {
      searchArray = false;
    }
    
    categoryName = categoryName.replace(/_/g, ' ');

    if (searchArray) {
      const checkStringMaxLength = (str, max) => typeof str === 'string' && str.length <= max;
      if (!checkStringMaxLength(searchArray.join(''), 25)) {
          throw new Meteor.Error(
              "too-long",
              "Too long search term"
          );
      }
    }

    if (searchArray == false) {
    return Recipes.find(
      {$and: [
        { category: categoryName },
        { $or: [ { private: { $ne: true } }, { owner: this.userId } ] }
    ]}).count();
    } else {
      return Recipes.find(
        {$and: [
          { searchIndex: { $all: searchArray } },
          { category: categoryName },
          { $or: [ { private: { $ne: true } }, { owner: this.userId } ] }
      ]}).count();
    }
  },

  getUserPostsTotal: function () {
    if (Meteor.userId()) {
    return Recipes.find({ owner: this.userId }).count();
    }
  },

  getUserFavoritesCount: () => {
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
    }
  },

  getRandomRecipe() {
    const countIt = Recipes.find({ private: { $ne: true } }).count();
    const skip = Math.floor(Math.random() * countIt);
    return Recipes.findOne({ private: { $ne: true } }, { skip: skip });
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
        );
        Recipes.update(
          { _id: recipeId },
          {
            $inc: { favorite: 1 },
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


  "rateRecipe.insert"(star, recipeId) {
    check(star, Number);

    try {
      if (Meteor.userId()) {
        console.log({ star });
        console.log({ recipeId });
        let thisaUserId = this.userId;
        console.log(this);
        let currentStarRating = 0;

        // if (Recipes.findOne({starRatingByUser: this.userId, note:{ $exists: true}})) {
        const chechit = Recipes.findOne({
          ["starRatingByUser." + this.userId]: { $exists: true },
        });
        if (chechit) {
          console.log("true it");
        } else {
          console.log("false it");
        }

        Recipes.update(
          { _id: recipeId },
          {
            $set: { ["starRatingByUser." + this.userId]: star },
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


  "rateRecipe.remove"(star, recipeId) {
    check(star, Number);
    try {
      if (Meteor.userId()) {
        console.log({ star });
        console.log({ recipeId });
        console.log(this);
        const chechit = Recipes.findOne({
          ["starRatingByUser." + this.userId]: { $exists: true },
        });
        if (chechit) {
          console.log("true it");
        } else {
          console.log("false it");
        }
        Recipes.update(
          { _id: recipeId },
          {
            $unset: { ["starRatingByUser." + this.userId]: star },
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

  "share.recipe"(recipeId, recipeName, username) {

    console.log("working");
    check(recipeId, String);
    check(username, String);
    check(recipeName, String);
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
            {"owner": this.userId}
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

});


}
