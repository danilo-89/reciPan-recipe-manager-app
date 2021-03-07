import { Recipes } from '../../imports/api/recipesBase.js';

Template.EditRecipe.onCreated(function() {
    const recipeId = FlowRouter.getParam("recipeId");
    // this.subscribe('recipes');
    this.subscribe("recipesSingle", recipeId);
    console.log(recipeId);
});

Template.EditRecipe.helpers({
    getSingleRecipe: () => {
        console.log("test");
        return Recipes.find().fetch()[0];
    },
    getInputCategory: (category) => {
        return category===Recipes.find().fetch()[0].category;
    },
    checkIfPrivate: () => {
        return Recipes.find().fetch()[0].private;
    },
    getHours: () => {
        const time = Recipes.find().fetch()[0].time;
        return (Math.floor(time / 60)) || 0;
    },
    getMinutes: () => {
        const time = Recipes.find().fetch()[0].time;
        return (time % 60) || 0;
    },
});

Template.EditRecipe.events({

    "click .add-direction-fields"() {
        $("#inputsDirections").append(`
        <textarea id="" class="input-directions" name="" rows="7" cols="50"></textarea>
        `);
        console.log("dgdgtdfg","dsfsfd");
    },
    "click .add-ingredient-fields"() {
        $("#tableCreateBody").append(`
        <tr>
        <td></td>
        <td><input type="text"  name="" class="input-create inputIngridient"></td>
        <td><input type="text" name="" class="input-create inputIngridientAmount"></td>
        <td class="delete-row">&#10006;</td>
        </tr>
        `);
        console.log("dgdgtdfg","dsfsfd");
    },
    "click .delete-row"(e) {
        $( e.target ).parent().remove();
        console.log("dgdgtdfg","dsfsfd");
    },
    "click .test"(e) {
        let hours = "" ;
        let mins = "";
        if (+($( "#inputPrepTimeHours" ).val()) || "") {
            hours = $( "#inputPrepTimeHours" ).val() + " hr";
        }
        if (+($( "#inputPrepTimeMins" ).val()) || "") {
            mins = " " + $( "#inputPrepTimeMins" ).val() + " min";
        }
        console.log(hours + mins);

    },
});