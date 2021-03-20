import { ShopLists } from '../../imports/api/recipesBase.js';

Template.ShoppingList.onCreated(function () {

    Session.set("ready", false);
    this.countData = new ReactiveVar();

    this.autorun(() => {
        this.subscribe('shopListPersonal');
    })
    
});

Template.ShoppingList.onDestroyed(function () {
    Session.set('recipeTaskMenu', null);
    Session.set('recipeItemMenu', null);
    Session.set('recipeMainMenu', null);
});

Template.ShoppingList.onRendered(function () {

    Session.set('recipeTaskMenu', null);
    Session.set('recipeItemMenu', null);
    Session.set('recipeMainMenu', null);

    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            Session.set("ready", true);
        }

        // setTimeout(() => {

        //         console.log("swiper loading");
        //         initMySwiper()

        // }, 0)


    });

});





Template.ShoppingList.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    getShopList: () => {
        let result = ShopLists.findOne({},{}).entries;
        function compareIt( a, b ) {
            if ( a.name < b.name ){
                return -1;
            }
            if ( a.name > b.name ){
                return 1;
            }
            return 0;
        }
        result.sort(compareIt);
        console.log(result);
        return result;
    },
    getFullShopList: () => {
        return ShopLists.findOne();
    },
    getForEachRecipe: (recipeId) => {
        let result = ShopLists.findOne({},{}).entries;
        function filterIt( a ) {
            if ( a.recipe === recipeId ){
                return true;
            } 
            return false;
        }
        result = result.filter(filterIt);
        console.log(recipeId);
        console.log(result);
        return result;
    },
    // getUnfinished: (fs, a) => {
    //     console.log("FULL SH");
    //     console.log(fs);
    //     let count = null;
    //     let i;
    //     for(i = 0; i < fs.length; ++i){
    //         if(fs[i].recipe === a && fs[i].checked === false) {
    //             count++;
    //         }
    //     }
    //     // Template.instance().countData.set(count);
    //     // console.log("some data je", Template.instance().countData.get())
    //     return count;
    // },
    getStatus: (a) => {
        if (a == false) {
            return 'back-complete'
        } else {
            return 'back-in-progress'
        }
    },
    getCount: (a, b) => {
        return a[b]
    },
    recipeTaskMenu: (recId) => {
        return Session.get('recipeTaskMenu')===recId;
    },
    recipeItemMenu: (recId, Iname) => {
        return Session.get('recipeItemMenu')===recId+"."+Iname;
    },
    recipeMainMenu: () => {
        return Session.get('recipeMainMenu');
    },
    getMultiCurrentValue: () => {
        return Session.get('multiCurrentValue');
    },
    ifMulti: (a) => {
        if (a > 1) {
            return true;
        } else {
            return false;
        }
    },
    getShoplistMode: (a) => {
        return Session.get('getShoplistMode');
    },
});


Template.ShoppingList.events({
    "click a"(event) {

        // get clicked element
        // console.log(event.currentTarget);
        
        event.preventDefault();
    
        const hrefOfClicked = $(event.currentTarget).attr("href");
        idTarget = hrefOfClicked.substring(1);
        console.log(idTarget);
    
        // Smooth scrolling inside elementusing jQuery easing
        let scrollFunction = function(idstring) {
            $('.wrapper').animate({
                scrollTop: $(idstring).offset().top + $('.wrapper').scrollTop()
            }, 700);
        };
        scrollFunction(hrefOfClicked);
    },
    "click #shopListSettingsBtn"() {
        Session.set('recipeMainMenu', true);
    },
    'click .check-ingridient' (event) {
        Meteor.call('check.ingridient', this.name, this.recipe, !this.checked);
    },
    'click .shop-list-each-recipe-header' (event) {
        Session.set('recipeTaskMenu', this.recId);
    },
    'click .recipe-tasks-menu-wrapper' (event) {
        Session.set('recipeTaskMenu', null);
        Session.set('recipeItemMenu', null);
        Session.set('recipeMainMenu', null);
    },
    'click .edit-task-ingridient' (event) {
        Session.set('recipeItemMenu', this.recipe+"."+this.name);
        Session.set('multiCurrentValue', this.multi);
    },
    "click .recipe-tasks-menu-main"(event) {
        event.stopPropagation();
    },
    "click .delete-task-item"(event) {
        Meteor.call('delete.ingridient', this.name, this.recipe, this.checked);
    },
    "click .increase-multi-input"(event) {
        event.stopPropagation();
    },
    "click .multi-task-item, click .multi-task-item-btn"(event) {
        event.preventDefault();
        const multiplier = +$( event.currentTarget ).parent().find($(".increase-multi-input")).val()
        console.log(multiplier);
        Meteor.call('change.multi.ingridient', this.name, this.recipe, multiplier);
        
    },
    "click .go-to-recipe"() {
        FlowRouter.go(`/single-recipe/${this.recId}`);
    },
    "click .remove-from-shoplist-btn"() {
        console.log("deleting shoplist");
        Meteor.call('shoplist.deleteRecipe', this.recId, (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Deleted', 'success');
                }
            }
        });
    },
    "click .remove-finished-from-recipe-btn"() {
        const checkIt = ShopLists.findOne({}, {fields: {counter:1}}).counter[this.recId];
        if (checkIt) {
        Meteor.call('shoplist.deleteFinishedIngredients', this.recId, (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Deleted', 'success');
                }
            }
        });
        } else {
            Meteor.call('shoplist.deleteRecipe', this.recId, (err, res) => {
                if (err) {
                    Bert.alert(err.reason, 'danger');
                } else {
                    if (res.isError) {
                        Bert.alert(res.err.reason, 'danger');
                    } else {
                        Bert.alert('Deleted', 'success');
                    }
                }
            });
        }
    },
    "click .recipe-tasks-menu-wrapper.active #emptyShoplistBtn"() {
        Meteor.call('shoplist.deleteList', this.recId, (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Shopplist deleted', 'success');
                }
            }
        });
    },
    "click #switchBtn"() {
        console.log(this);
        if (Session.get('getShoplistMode')===true){
            setTimeout(() => {
                Session.set('getShoplistMode', null);
            }, 0)
            // setTimeout(() => {
            //     initMySwiper();
            // }, 400)
            console.log('set null');
            return true;
        } else {
            setTimeout(() => {
                Session.set('getShoplistMode', true);
            }, 0)
            console.log('set simple');
            return true;
        }
    },
});

// function initMySwiper() {
//     const mySwiper1 = new Swiper('.swiper-container.new-recipes-swiper-container', {
//         // slidesPerView: 2,
//         // spaceBetween: 5,
//         observer: true,
//         observeParents: true,
//         slidesPerView: 4.5,
//         spaceBetween: 10,
//         freeMode: true,
//         mousewheel: {
//             releaseOnEdges: true,
//         },
//         navigation: {
//             nextEl: '.swiper-button-next',
//             prevEl: '.swiper-button-prev',
//         },
//         scrollbar: {
//             el: '.swiper-scrollbar',
//             draggable: true,
//             dragSize: 25,
//         },
//         breakpoints: {
//             576: {
//                 slidesPerView: 2.5,
//                 spaceBetween: 8,
//             },
//             768: {
//                 slidesPerView: 3.5,
//                 spaceBetween: 8,
//             },
//             992: {
//                 slidesPerView: 4.5,
//                 spaceBetween: 8,
//             },
//             1200: {
//                 slidesPerView: 4.5,
//                 spaceBetween: 10,
//             },
//             1400: {
//                 slidesPerView: 4.5,
//                 spaceBetween: 10,
//             }
//         }

//     });
// }

