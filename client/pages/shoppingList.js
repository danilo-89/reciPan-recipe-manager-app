import { ShopLists } from '../../imports/api/recipesBase.js';

Template.ShoppingList.onCreated(function () {

    Session.set("ready", false);
    this.countData = new ReactiveVar();

    this.autorun(() => {
        this.subscribe('shopListPersonal');
    })
    
});

Template.ShoppingList.onDestroyed(function () {
    clearModals();
});

Template.ShoppingList.onRendered(function () {

    clearModals();

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
        console.log({result});
        return result;
    },
    getRecipesCount: () => {
        return ShopLists.findOne().recipes.length;
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
    getConfirmModal: () => {
        return Session.get('confirmModal');
    },
    getConfirmModalTitle: () => {
        return Session.get('confirmModal')[0];
    }
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
        Session.set('confirmModal', ['Delete item', this.name, this.recipe, this.checked]);
        // Meteor.call('delete.ingridient', this.name, this.recipe, this.checked);
    },
    "click .recipe-tasks-menu-wrapper.active #emptyShoplistBtn"() {
        Session.set('confirmModal', ['Delete shoplist', this.recId]);
        // Meteor.call('shoplist.deleteList', this.recId)
    },
    "click .remove-from-shoplist-btn"() {
        Session.set('confirmModal', ['Remove recipe from shoplist', this.recId]);
        // Meteor.call('shoplist.deleteRecipe', this.recId)
    },
    "click .remove-finished-from-recipe-btn"() {
        Session.set('confirmModal', ['Remove finished tasks', this.recId]);
        // Meteor.call('shoplist.deleteFinishedIngredients', this.recId)
        // Meteor.call('shoplist.deleteRecipe', this.recId)
    },

    "click #confirmModalsBtn"(event) {
        const getThisData = Session.get('confirmModal');
        console.log(getThisData);
        if (getThisData[0] === 'Delete item') {
            const getSLData = ShopLists.findOne({}, {fields: {counter: 1, entries: 1}});

            const checkExisting = getSLData.entries.filter(x => x.recipe===getThisData[2]).length;
            const checkIt = getSLData.counter[getThisData[2]];
            if ((checkExisting===1 && checkIt === 1 && !getThisData[3]) || (checkExisting===1 && !checkIt && getThisData[3])) {
                Meteor.call('shoplist.deleteRecipe', getThisData[2], (err, res) => {
                    if (err) {
                        Bert.alert(err.reason, 'danger');
                    } else {
                        if (res.isError) {
                            Bert.alert(res.err.reason, 'danger');
                        } else {
                            Bert.alert('Recipe removed succesfully', 'success');
                        }
                    }
                });
            } else {
                Meteor.call('delete.ingridient', getThisData[1], getThisData[2], getThisData[3], (err, res) => {
                    if (err) {
                        Bert.alert(err.reason, 'danger');
                    } else {
                        if (res.isError) {
                            Bert.alert(res.err.reason, 'danger');
                        } else {
                            Bert.alert('Task removed succesfully', 'success');
                        }
                    }
                });
            }

        } else if (getThisData[0] === 'Delete shoplist') {
            Meteor.call('shoplist.deleteList', getThisData[1], (err, res) => {
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
        } else if (getThisData[0] === 'Remove recipe from shoplist') {
            Meteor.call('shoplist.deleteRecipe', getThisData[1], (err, res) => {
                if (err) {
                    Bert.alert(err.reason, 'danger');
                } else {
                    if (res.isError) {
                        Bert.alert(res.err.reason, 'danger');
                    } else {
                        Bert.alert('Recipe removed succesfully', 'success');
                    }
                }
            });
        } else if (getThisData[0] === 'Remove finished tasks') {
            const checkIt = ShopLists.findOne({}, {fields: {counter:1}}).counter[getThisData[1]];
            if (checkIt) {
            Meteor.call('shoplist.deleteFinishedIngredients', getThisData[1], (err, res) => {
                if (err) {
                    Bert.alert(err.reason, 'danger');
                } else {
                    if (res.isError) {
                        Bert.alert(res.err.reason, 'danger');
                    } else {
                        Bert.alert('Finished tasks removed succesfully', 'success');
                    }
                }
            });
            } else {
                Meteor.call('shoplist.deleteRecipe', getThisData[1], (err, res) => {
                    if (err) {
                        Bert.alert(err.reason, 'danger');
                    } else {
                        if (res.isError) {
                            Bert.alert(res.err.reason, 'danger');
                        } else {
                            Bert.alert('Finished tasks removed succesfully', 'success');
                        }
                    }
                });
            }
        }
        clearModals();
    },
    "click #confirmModal"(event) {
        // close modal if clicked outside .confirm-modal-inside element
        if (event.target===event.currentTarget) {
            clearModals();
        }
    },
    "click #cancelModalsBtn"(event) {
        clearModals();
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
    "click #switchBtn"() {
        console.log(this);
        if (Session.get('getShoplistMode')===true){
            setTimeout(() => {
                Session.set('getShoplistMode', null);
            }, 0)
            console.log('set null');
            clearModals();
            return true;
        } else {
            setTimeout(() => {
                Session.set('getShoplistMode', true);
            }, 0)
            console.log('set simple');
            clearModals();
            return true;
        }
    },
});

const clearModals = function() {
    Session.set('recipeTaskMenu', null);
    Session.set('recipeItemMenu', null);
    Session.set('recipeMainMenu', null);
    Session.set('confirmModal', null);
}

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

