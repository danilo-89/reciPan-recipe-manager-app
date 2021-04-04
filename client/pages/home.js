import { Recipes } from '../../imports/api/recipesBase.js';


Template.Home.onCreated(function () {

    Session.set("ready", false);
    Session.set("scrollOn", false);

    this.autorun(() => {
        this.subscribe('recipesFav12');
        this.subscribe('recipesNew8');
        this.subscribe('users.favoritesList');
    })
    getRandomRecipe();
    
});


Template.Home.onRendered(function () {

    let headerElem = $('.behind-search-header');
    let targetElem = $('.home-header-container');
    let topPos = 0;
    hasClass = targetElem.hasClass( "home-header-effect" );


    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            Session.set("ready", true);
        }

        setTimeout(() => {
            if (
                !document.querySelector(".swiper-container.new-recipes-swiper-container").mySwiper1
            ) {
      
                console.log("swiper loading");
                const mySwiper1 = new Swiper('.swiper-container.new-recipes-swiper-container', {
                    // slidesPerView: 2,
                    // spaceBetween: 5,
                    observer: true,
                    observeParents: true,
                    slidesPerView: 8,
                    spaceBetween: 10,
                    freeMode: true,
                    mousewheel: {
                        releaseOnEdges: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    scrollbar: {
                        el: '.swiper-scrollbar',
                        draggable: true,
                        dragSize: 25,
                    },
                    breakpoints: {
                        576: {
                            slidesPerView: 2,
                            spaceBetween: 8,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 8,
                        },
                        992: {
                            slidesPerView: 4.5,
                            spaceBetween: 8,
                        },
                        1200: {
                            slidesPerView: 7,
                            spaceBetween: 10,
                        },
                        1400: {
                            slidesPerView: 8,
                            spaceBetween: 10,
                        }
                    }
    
                });

            }

        }, 0)

    });


    let countTotal = 0;
    let countDiscovered = 0;

    $(".wrapper").on('scroll', function(e) {
        // console.log(topPos, "element position");
        // console.log($('.behind-search-header').outerHeight(), "element height");
        
        topPos = headerElem.offset().top;

        if (topPos < (-15)) {
            if (!targetElem.hasClass( "home-header-effect" )) {
                // console.log("set it");
                targetElem.addClass("home-header-effect");
            }
        } else {
            if (targetElem.hasClass( "home-header-effect" )) {
                targetElem.removeClass("home-header-effect");
            }
        }; 
            // console.log("posts curently visible: ", Recipes.find().count());
    })

});



Template.Home.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    isScrollOn: () => {
        return Session.get("scrollOn");
    },
    getRandomRecipe: () => {
        return Session.get("randomRecipe");
    },
    getRecipesCount: () => {
        return Recipes.find().count();
    },
    getRecipes: () => {
        return Recipes.find({}, { sort: { favorite: -1 }, limit: 12 });
    },
    getNewRecipes: () => {
        return Recipes.find({}, { sort: { createdAt: -1 }, limit: 8});
    },
    // BlogPosts.find({}, {sort: {date: -1}, limit: 10});
    getUserFavorites: () => {
        if (Meteor.user()?.public?.favorites) {
            return Meteor.users.find().fetch()[0].public.favorites;
        } else {
            return {};
        }
    },
    checkPostFavorites: (favorites, favId) => {
        if (favorites[favId]) {
            return favorites[favId]
        } else {
            return false
        }
    },
    getTime: (time) => {
        let hours = (Math.floor(time / 60)) || "";
        if (hours) { hours = hours + " hr"};
        let mins = (time % 60) || "";
        if (mins) { mins = mins + " min"};
        return hours + " " + mins;
    },
    getCategoryLink: (categoryName) => {
        return "/categories/"+ categoryName.replace(/ /g, '_');
    },
    getRaiting: (a) => {
        if (jQuery.isEmptyObject(a)) {
            return 0;
        } else if (a) {
            let sum = 0;
            let count = 0;
            for (const key of Object.keys(a)) {
                sum = sum + a[key];
                count ++;
            }
            const avgStar = sum / count;
            return avgStar;
        } else {
            return 0;
        }
    },

});

Template.Home.events({
    'click .random-recipe-ribbon' (event) {
        event.stopPropagation();
        $('.random-recipe-ribbon').toggleClass('rotate');
        getRandomRecipe();
    },
    "click .userNameLink"(event) {
        event.stopPropagation();
        const userProfileName = event.currentTarget.textContent;
        if (Meteor.user()?.username === userProfileName) {
            FlowRouter.go('/profile');
        } else {
            FlowRouter.go(`/user/${userProfileName}`);
        }
    },
    "click .random-recipe-img, click .random-recipe-bottom"() {
        FlowRouter.go(`/single-recipe/${this._id}`);
    },
    "click .home-recipe-container"() {
        FlowRouter.go(`/single-recipe/${this._id}`);
    },
    "click .home-fav-btn"() {
        FlowRouter.go(`/favorites`);
    },
    "click .home-top-btn"() {
        $(".wrapper").animate({scrollTop: 0}, 1000);
    },
    "click .go-to-search"() {
            FlowRouter.go(`/search`);
    },
    "click .home-logo-img"() {
            console.log("you are at home :)");
            FlowRouter.go(`/home`);
    },
    'focusout .home-search-btn' () {
        $(".home-search-btn").removeClass("active");
    },
    'click .home-recipe-category' (event) {
        event.stopPropagation();
    },
});

function getRandomRecipe() {
    Meteor.call('getRandomRecipe', (err, res) => {
        if (err) {
            Bert.alert(err.reason, 'danger');
        } else {
            if (res.isError) {
                Bert.alert(res.err.reason, 'danger');
            } else {
                Session.set("randomRecipe", res);
            }
        }
    })
}