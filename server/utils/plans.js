const PLAN_DATA = {
    motjha: {
      'Budget Buster': { 6: 145, 10: 165, 14: 195 },
      'Plan A': { 6: 180, 10: 242, 14: 308 },
      'Plan B': { 6: 259, 10: 336, 14: 468 },
      'Plan C': { 6: 325, 10: 457, 14: 677 },
      'Plan D': { 6: 455, 10: 699 },
      'Plan E': { 6: 635, 10: 941 },
      'Plan F': { 6: 785, 10: 1363 },
      Green: { 6: 132, 10: 165, 14: 187 },
      Silver: { 6: 180, 10: 242, 14: 308 },
      Gold: { 6: 264, 10: 341, 14: 473 },
      Platinum: { 6: 330, 10: 462, 14: 682 },
      Black: { 6: 460, 10: 704 },
      Pearl: { 6: 640, 10: 946 },
      Ivory: { 6: 790, 10: 1368 },
    },
    single: {
      'Budget Buster': { '18-65': 88, '66-85': 130, '86-100': 205 },
      'Plan A': { '18-65': 115, '66-85': 170, '86-100': 295 },
      'Plan B': { '18-65': 132, '66-85': 187, '86-100': 312 },
      'Plan C': { '18-65': 165, '66-85': 275, '86-100': 415 },
      'Plan D': { '18-65': 240, '66-85': 410 },
      'Plan E': { '18-65': 315 },
      'Plan F': { '18-65': 450 },
      Green: { '18-65': 45, '66-85': 80, '86-100': 105 },
      Silver: { '18-65': 88, '66-85': 130, '86-100': 205 },
      Gold: { '18-65': 132, '66-85': 187, '86-100': 312 },
      Platinum: { '18-65': 165, '66-85': 275, '86-100': 415 },
      Black: { '18-65': 240, '66-85': 410 },
      Pearl: { '18-65': 315 },
      Ivory: { '18-65': 450 }
    },
    family: {
      'Budget Buster': { '18-65': 115, '66-85': 150, '86-100': 285 },
      'Plan A': { '18-65': 135, '66-85': 190, '86-100': 385 },
      'Plan B': { '18-65': 152, '66-85': 207, '86-100': 402 },
      'Plan C': { '18-65': 195, '66-85': 315, '86-100': 535 },
      'Plan D': { '18-65': 280, '66-85': 470 },
      'Plan E': { '18-65': 405 },
      'Plan F': { '18-65': 565 },
      Green: { '18-65': 65, '66-85': 90, '86-100': 145 },
      Silver: { '18-65': 115, '66-85': 150, '86-100': 285 },
      Gold: { '18-65': 152, '66-85': 207, '86-100': 402 },
      Platinum: { '18-65': 195, '66-85': 315, '86-100': 535 },
      Black: { '18-65': 280, '66-85': 470 },
      Pearl: { '18-65': 405 },
      Ivory: { '18-65': 565 }
    },
    specials: {
      'Spring A': { 6: 0, 10: 0, 14: 0, '18-65': 0, '66-85': 0, '86-100': 0 },
      'Spring B': { 6: 0, 10: 0, 14: 0, '18-65': 0, '66-85': 0, '86-100': 0 }
    }
  };

/**
 * Get Age Bracket string for single/family plans
 */
function getAgeBracket(age) {
    if (age <= 65) return '18-65';
    if (age <= 85) return '66-85';
    if (age <= 100) return '86-100';
    return null;
}

/**
 * Recommend top 3 plans based on user input
 * @param {string} category - 'single', 'family', 'motjha'
 * @param {number} ageOrMembers - age for single/family, members for motjha
 * @param {number} maxBudget - monthly budget constraint
 */
function getRecommendedPlans(category, ageOrMembers, maxBudget) {
    const plans = PLAN_DATA[category];
    if (!plans) return [];

    const key = (category === 'motjha') ? ageOrMembers : getAgeBracket(ageOrMembers);
    if (!key) return [];

    const results = [];
    for (const [planName, prices] of Object.entries(plans)) {
        const price = prices[key];
        if (price && price <= maxBudget) {
            results.push({ name: planName, price, category });
        }
    }

    // Sort by price descending (show most value first within budget)
    return results.sort((a, b) => b.price - a.price).slice(0, 3);
}

module.exports = {
    PLAN_DATA,
    getRecommendedPlans
};
