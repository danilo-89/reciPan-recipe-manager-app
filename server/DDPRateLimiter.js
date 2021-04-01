// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

const getDDPRateLimiterMatcher = (name) => {
    return { type: 'method', name: name }
}

DDPRateLimiter.addRule(getDDPRateLimiterMatcher('rateRecipe.insert'), 3, 10000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('add.to.favorites'), 3, 10000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('getRandomRecipe'), 50, 60000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('share.recipe'), 10, 60000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('check.ingridient'), 55, 60000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('shoplist.deleteRecipe'), 3, 10000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('shoplist.deleteFinishedIngredients'), 3, 10000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('recipes.insert'), 1, 10000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('shoplist.insert'), 3, 10000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('read.inbox'), 3, 10000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('createUser'), 7, 60000);
DDPRateLimiter.addRule(getDDPRateLimiterMatcher('login'), 5, 60000);