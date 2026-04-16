const { getClient } = require('./server/config/db');
(async () => {
    const client = await getClient();
    const branch = "Head Office";
    const nameStr = "4 TIER - CASKET";
    const colorStr = "ASH";

    const selectedBranch = branch.trim().toUpperCase();
    const primaryName = "4 TIER";
    const modelMatch = "CASKET";

    const { rows: matches } = await client.query('SELECT * FROM inventory WHERE location ILIKE $1 AND name ILIKE $2 ORDER BY stock_quantity DESC', [selectedBranch, primaryName]);

    let candidates = matches;
    console.log("Matches:", candidates.map(c => c.id));

    if (modelMatch) {
        const exactModel = candidates.filter(i => i.model && i.model.toLowerCase() === modelMatch.toLowerCase());
        if (exactModel.length > 0) candidates = exactModel;
        console.log("After modelMatch:", candidates.map(c => c.id));
    }

    let invItem = null;
    if (colorStr && candidates.length > 0) {
        const colorMatch = candidates.find(i => i.color && i.color.toLowerCase() === colorStr.toLowerCase());
        if (colorMatch) invItem = colorMatch;
        else invItem = null;
        console.log("After colorMatch:", invItem ? invItem.id : "null");
    } else if (candidates.length > 0) {
        invItem = candidates[0];
    }

    console.log("Final Output ID:", invItem ? invItem.id : "null");
    client.release();
    process.exit(0);
})();
