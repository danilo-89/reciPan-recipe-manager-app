if (Meteor.isClient){

    // get current route with "Session.get('currentRoute')"
    currentRoute = Tracker.autorun(() => {
    const routeName = FlowRouter.getRouteName();
    Session.set('currentRoute', routeName);
    });

    rootUrl = Meteor.absoluteUrl().substring(0, Meteor.absoluteUrl().length - 1);

    // global session helpers
    Template.registerHelper('whatRoute', () => Session.get('currentRoute'));

    Template.registerHelper('getAction', () => Session.get('action'));
    Template.registerHelper('isActionAdd', action => action === 'add');
    Template.registerHelper('isActionDelete', action => action === 'delete');
    Template.registerHelper('isActionUpdate', action => action === 'update');
    Template.registerHelper('getCurrentDoc', () => Session.get('currentDoc'));
    Template.registerHelper('and', (a, b) => {
        return a && b;
    });
    Template.registerHelper('or', (a, b) => {
        return a || b;
    });
    Template.registerHelper('isEqual', (a, b) => a === b);
    Template.registerHelper('isNotNumber', (a) => Number.isNaN(a));
    Template.registerHelper('isEmptyObj', (a) => jQuery.isEmptyObject(a));
    Template.registerHelper('isRegExEqual', (a, b) => (new RegExp(b)).test(a));
    Template.registerHelper('isEqualOr', (a, b, c) => a === b || a === c);
    Template.registerHelper('includes', (a, b) => a.inclides(b));
    Template.registerHelper('isEqualToZero', a => a === 0);
    Template.registerHelper('isEqualToZero3', (a, b, c) => { return a === 0 && b === 0 && c === 0 });
    Template.registerHelper('isNotEqual', (a, b) => a !== b);
    Template.registerHelper('isLessThen', (a, b) => { return a < b });
    Template.registerHelper('isGreaterThen', (a, b) => { return a > b });
    Template.registerHelper('isBetween', (a, b, c) => { return a > b && a < c });
    Template.registerHelper('capitalize', (a) => { return a.charAt(0).toUpperCase() + a.slice(1) });
    Template.registerHelper('uppercase', (a) => { return a.toUpperCase() });
    Template.registerHelper('roundTo1', (a) => { return Math.round(a * 10) / 10 });

    Template.registerHelper('formatDateWithoutTime', d => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if(d) {
            const date = new Date(d);
            let formatted_date;
            if (date.getMonth() < 9) {
                formatted_date = String(date.getFullYear()) + "/" + "0" + (date.getMonth() + 1) + "/" + date.getDate();
            } else {
                formatted_date = String(date.getFullYear()) + "/" + (date.getMonth() + 1) + "/" + date.getDate();
            }
        
            return formatted_date;
        }
    });

    Template.registerHelper('formatDateWithTime', d => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = new Date(d);
        let formatted_date;
        if (date.getMonth() < 9) {
            formatted_date = String(date.getFullYear()) + "/" + "0" + (date.getMonth() + 1) + "/" + date.getDate() + " (" + date.getHours() + ":" + date.getMinutes() + ")";
        } else {
            formatted_date = String(date.getFullYear()) + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " (" + date.getHours() + ":" + date.getMinutes() + ")";
        }
    
        return formatted_date;
    });

    Template.body.events({
        "click .back-btn": function(e, data, tpl) {
          // e -> jquery event
          // data -> Blaze data context of the DOM element triggering the event handler
          // tpl -> the parent template instance for the target element
            if (document.referrer == "") {
                FlowRouter.go("/home");
                // console.log("go home");
                // history.back();
            } else {
                history.back();
            }
        },
        "click #logoutBtn": function() {
            Meteor.logout()
        }
    })


}

