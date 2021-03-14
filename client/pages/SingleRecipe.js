import { Recipes } from '../../imports/api/recipesBase.js';
import { Template } from 'meteor/templating'
import './SingleRecipe.html'
import '../custom/modal.html'

Template.SingleRecipe.onCreated(function() {
    
    // this.subscribe('recipes');
    this.autorun(() => {
        const recipeId = FlowRouter.getParam("recipeId");
        this.subscribe("recipesSingle", recipeId);
        this.subscribe("users.user");
        // this.subscribe('shopListPersonal');
        Session.set('recipeId', recipeId);
        console.log(recipeId);
        
    })
    
});


Template.SingleRecipe.onRendered(function () {

    this.autorun(() => {
        
        const ready = this.subscriptionsReady();

        if(ready) {
            const recipeId = FlowRouter.getParam("recipeId");
            const checkIfFav = Meteor.users.findOne({["public.favorites." + recipeId]: {$exists: true}});
            if (checkIfFav) {
                Session.set('checkItFav', true);
                console.log("imamo favorite ovde")
            } else {
                Session.set('checkItFav', null);
                console.log("nemamo favorite ovde")
            };
            setTimeout(() => {


                

                const mySwiper = new Swiper('.swiper-container', {
                    loop: true,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
                // mySwiper.init();
                const mySwiper1 = document.querySelector(".swiper-container").swiper;
                console.log("swiper", mySwiper);




                const a = Recipes.find().fetch()[0].starRatingByUser;
                if (a) {
                    let sum = 0;
                    let count = 0;
                    for (const key of Object.keys(a)) {
                        sum = sum + a[key];
                        count ++;
                    }
                    const avgStar = sum / count;
                    const arrayS = [avgStar, count];
                    Session.set('avgStar', arrayS);
                } else {
                    Session.set('avgStar', null);
                }


                const myId = Meteor.userId();
                

                const checkIfStar = Recipes.findOne({["starRatingByUser." + myId]: {$exists: true}});
                if (checkIfStar) {
                  console.log("true it");
                  const getMyStarRating = Recipes.find().fetch()[0].starRatingByUser[myId];
                  setDOMStar(getMyStarRating);
                } else {
                  console.log("false it");
                }
                // const checkIfFav = Meteor.users.findOne({["starRatingByUser." + myId]: {$exists: true}});
                
                
                // Check if video element exists
                if (!$('#sRVideo').length) {
                    $('.a-nav-video').addClass('link-no-video');
                }





            }, 0)
        }
        
        
    })
    
});


Template.SingleRecipe.onDestroyed(function() {
    console.log("nulaaaaaaaaa");
    Session.set('recipeId', null);
    Session.set('avgStar', null);
    Session.set('checkItFav', null);
})

Template.SingleRecipe.helpers({
    getSingleRecipe: () => {
        return Recipes.find().fetch()[0];
    },
    getTime: (time) => {
        let hours = (Math.floor(time / 60)) || "";
        if (hours) { hours = hours + " hr"};
        let mins = (time % 60) || "";
        if (mins) { mins = mins + " min"};
        return hours + " " + mins;
    },
    mathRound: (avg) => {
        return Math.round(avg);
    },
    getAvg: () => {
        return Session.get('avgStar');
    },
    checkStar: (a, b) => {
        console.log(a, b);
        if (a===b) {
            return "active";
        } else {
            return false;
        }
    },
    increaseByOne: (a) => {
        return ++a;
    },
    getIfFav: () => {
        console.log("whats happening?",Session.get('checkItFav'));
        return Session.get('checkItFav')
    },
    getWebAddress: () => {
        console.log("dsfsfsd");
        return window.location.href;
    },
    getCategoryLink: (categoryName) => {
        return "/categories/"+ categoryName.replace(/ /g, '_');
    },
    // getStarRating: () => {
    //     const starRating = Recipes.find().fetch()[0].starRating;
    //     return starRating;
    // },
});

Template.modalShareRecipe.onCreated(function () {
    this.autorun(() => {
        this.subscribe('friends.friendsActive');
    })
});


Template.modalShareRecipe.helpers({
    getFriends: () => {
        console.log("inside");
        return Meteor.user().public?.friends?.active;
    },
    getFriendsNames: (friendId) => {
        return Meteor.users.findOne({_id: friendId}).username;
    },
});

Template.SingleRecipe.events({
    "click .edit-recipe-btn"() {
        // console.log(this._id);
        console.log("edit");
        FlowRouter.go(`/edit-recipe/${this._id}`);
    },
    "click .userNameLink"(event) {
        const userProfileName = event.currentTarget.textContent;
        if (Meteor.user().username === userProfileName) {
            FlowRouter.go('/profile');
        } else {
            FlowRouter.go(`/user/${userProfileName}`);
        }
    },
    "click .single-recipe-fav"() {
        // console.log(this._id);
        console.log("favorite");

        if (Session.get('checkItFav')) {
            Meteor.call('remove.from.favorites', Session.get('recipeId'), (err, res) => {
                if (err) {
                    Bert.alert(err.reason, 'danger');
                } else {
                    if (res.isError) {
                        Bert.alert(res.err.reason, 'danger');
                    } else {
                        Bert.alert('Recipe removed from favorites', 'success');
                    }
                }
            });
        } else {
            Meteor.call('add.to.favorites', Session.get('recipeId'), (err, res) => {
                if (err) {
                    Bert.alert(err.reason, 'danger');
                } else {
                    if (res.isError) {
                        Bert.alert(res.err.reason, 'danger');
                    } else {
                        Bert.alert('Recipe added to favorites', 'success');
                    }
                }
            });
        }


    },
    "click .delete-recipe-btn"() {
        // console.log(this._id);
        thisUserId = Meteor.userId();

        Meteor.call('recipes.remove', Session.get('recipeId'), (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
                console.log(err.reason);
            } else {
                FlowRouter.go(`/home`);
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                    console.log(res.err.reason);
                } else {
                    Bert.alert('successfully deleted', 'success');
                }
                console.log("what's happening?")
            }
        });

        
        // console.log("edit");
        // FlowRouter.go(`/edit-recipe/${this._id}`);
    },
    "click .share-recipe-btn"(event) {
        Session.set('modalData', {template: "modalShareRecipe", title: "Share recipe", recipeName: this.name, files: [{name: "Share recipe", linkit: window.location.href, date: new Date()}]});
    },


    // https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet
    // mailto:info@example.com?&subject=&body=https://www.websiteplanet.com 
    // https://twitter.com/intent/tweet?url=https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet&text=sadrzaj%20neki
    // https://www.pinterest.com/pin/create/button?url=https://api.whatsapp.com/send.html&media=www.url.doslike&description=naslov%20neki
    // https://www.linkedin.com/shareArticle?url=https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet&title=naslov%20neki
    // https://api.whatsapp.com/send?text=naslov%20neki https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet
    // whatsapp://send?text=https://api.whatsapp.com/send.html
    // viber://forward?text=https://api.whatsapp.com/send.html

    "click .p-star"(e) { 
        thisUserId = Meteor.userId();

        const clicked = $(e.target).closest( "p" );
        // $(clicked).addClass('active'); 
        const starNum = +clicked.attr('data-star');   

        Meteor.call('rateRecipe.insert', starNum, Session.get('recipeId'), (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    const a = Recipes.find().fetch()[0].starRatingByUser;
                    let sum = 0;
                    let count = 0;
                    for (const key of Object.keys(a)) {
                        sum = sum + a[key];
                        count ++;
                    }
                    const avgStar = sum / count;
                    const arrayS = [avgStar, count];
                    Session.set('avgStar', arrayS);
            
                    setDOMStar(starNum);
                    Bert.alert( 'Rated sucessfully, thank you!', 'success', 'fixed-top', 'fas fa-star' );
                }
            }
        });

        // $('.stars-wrapper > p').removeClass('active');
  
        // console.log(starNum, Session.get('recipeId'));
        // gets rating by user for this post
        // console.log(Recipes.find().fetch()[0].starRatingByUser[thisUserId]);
        // currentStarRating = -currentStarRating;
        // console.log(currentStarRating);

        // console.log(Recipes.find().fetch()[0].starRatingByUser);
        // const a = Recipes.find().fetch()[0].starRatingByUser;
        // for (const key of Object.keys(a)) {
        //     const val = a[key];
        //     console.log(val);
        // }


    },
    "dblclick .swiper-slide"(e) { 
        var element = document.getElementById("singleRecipeSwiperContainer");
        if (!$(element).hasClass("full")) {
            element.classList.add("full");
        }
    },
    "click .single-recipe-swiper-container.full .swiper-slide"(e) {
        var element = document.getElementById("singleRecipeSwiperContainer");
        if ($(element).hasClass("full")) {
            element.classList.remove("full");
        }
    },
    "click #addToShoplistBtn"(e) {
        e.preventDefault();
        const selectedIngridients = [];
        const recipeIdNum = this._id;
        const multiNumberV = $('#multiplierInput').val();
        $('.single-ingridients-list-container input:checked ~ p').each(function(a) {
            selectedIngridients.push({
                "name": $(this).children('span').text(),
                "amount": $(this).children('strong').text(),
                "multi": Number(multiNumberV),
                "recipe": recipeIdNum,
                "checked": false
            });
        });

        console.log(selectedIngridients);
        console.log(selectedIngridients.length);
        console.log(this.images[0]);
        console.log(this.name);
        console.log(this._id);
        
        if (selectedIngridients.length < 1) {
            Bert.alert('Select at least one ingridient', 'danger');
            throw new Meteor.Error("no-ingridients", "Select at least one ingridient");
        }


        Meteor.call('shoplist.insert', selectedIngridients, this._id, this.name, this.images[0], (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Ingridients successfully added to shoplist', 'success');
                }
            }
        });

    },
});

const setDOMStar = function(setIt) {
    $('.p-star').removeClass("my-star-rank");
    $('*[data-star=' + setIt + ']').addClass("my-star-rank");
}


