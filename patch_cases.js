const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server', 'controllers', 'casesController.js');
let content = fs.readFileSync(filePath, 'utf8');

// The block to replace in commit section
const oldBlockCommit = `                if (nameStr) {
                    let primaryName = nameStr;
                    let modelMatch = null;
                    if (nameStr.includes(' - ')) {
                    const lastDashIndex = nameStr.lastIndexOf(' - ');
                    primaryName = nameStr.substring(0, lastDashIndex).trim();
                    modelMatch = nameStr.substring(lastDashIndex + 3).trim();
                }

                    let invData = null;
                    let query = supabase
                        .from('inventory')
                        .select('id, stock_quantity, reserved_quantity, name, model, color')
                        .eq('category', 'coffin')
                        .ilike('name', primaryName);

                    if (modelMatch) {
                        query = query.ilike('model', modelMatch);
                    }

                    const { data: matches } = await query.order('stock_quantity', { ascending: false });

                    if (matches && matches.length > 0) {
                        if (colorStr) {
                            invData = matches.find(i => !i.color || i.color.toLowerCase() === colorStr.toLowerCase());
                        } else {
                            invData = matches[0];
                        }
                    }

                    // Legacy Fallback to model if not found
                    if (!invData && !modelMatch) {
                        const { data: modelMatches } = await supabase
                            .from('inventory')
                            .select('id, stock_quantity, reserved_quantity, name, model, color')
                            .eq('category', 'coffin')
                            .ilike('model', nameStr)
                            .order('stock_quantity', { ascending: false });

                        if (modelMatches && modelMatches.length > 0) {
                            if (colorStr) {
                                invData = modelMatches.find(i => !i.color || i.color.toLowerCase() === colorStr.toLowerCase());
                            } else {
                                invData = modelMatches[0];
                            }
                        }
                    }

                    if (invData) {
                        try {
                            const result = await commitStock(invData.id, 1, id, userEmail, \`Case Completed: \${updatedCase.case_number}\`);
                            console.log(\`✅ Stock COMMITTED for case \${id}: \${result.message}\`);
                        } catch (commitErr) {
                            console.error('❌ Stock commit failed:', commitErr.message);
                        }
                    } else {
                        console.warn(\`⚠️ Could not find inventory item '\${nameStr}' to commit for case \${id}\`);
                    }
                }`;

const newBlockCommit = `                if (nameStr) {
                    const caseBranch = updatedCase.branch || 'Head Office';
                    console.log(\`🔍 Attempting to commit stock for case \${id} (\${caseBranch}) - \${nameStr}\`);
                    let invData = null;

                    // 1. TRY EXACT MATCH IN BRANCH
                    const { data: exactMatches } = await supabase
                        .from('inventory')
                        .select('id, name, model, color, location')
                        .eq('category', 'coffin')
                        .eq('location', caseBranch)
                        .eq('name', nameStr);

                    if (exactMatches && exactMatches.length > 0) {
                        if (colorStr) {
                            invData = exactMatches.find(i => !i.color || i.color.toLowerCase() === colorStr.toLowerCase());
                        } else {
                            invData = exactMatches[0];
                        }
                    }

                    // 2. FALLBACK TO PARSED NAME/MODEL IN BRANCH
                    if (!invData) {
                        let primaryName = nameStr;
                        let modelMatch = null;
                        if (nameStr.includes(' - ')) {
                            const lastDashIndex = nameStr.lastIndexOf(' - ');
                            primaryName = nameStr.substring(0, lastDashIndex).trim();
                            modelMatch = nameStr.substring(lastDashIndex + 3).trim();
                        }

                        let query = supabase
                            .from('inventory')
                            .select('id, name, model, color, location')
                            .eq('category', 'coffin')
                            .eq('location', caseBranch)
                            .ilike('name', primaryName);

                        if (modelMatch) query = query.ilike('model', modelMatch);

                        const { data: matches } = await query.order('stock_quantity', { ascending: false });
                        if (matches && matches.length > 0) {
                            if (colorStr) {
                                invData = matches.find(i => !i.color || i.color.toLowerCase() === colorStr.toLowerCase());
                            } else {
                                invData = matches[0];
                            }
                        }
                    }

                    // 3. LEGACY GLOBAL FALLBACK
                    if (!invData) {
                        const { data: globalMatches } = await supabase
                            .from('inventory')
                            .select('id, name, model, color, location')
                            .eq('category', 'coffin')
                            .eq('name', nameStr);

                        if (globalMatches && globalMatches.length > 0) invData = globalMatches[0];
                    }

                    if (invData) {
                        try {
                            const result = await commitStock(invData.id, 1, id, userEmail, \`Case Completed: \${updatedCase.case_number}\`);
                            console.log(\`✅ Stock COMMITTED for case \${id}: \${result.message}\`);
                        } catch (commitErr) {
                            console.error('❌ Stock commit failed:', commitErr.message);
                        }
                    } else {
                        console.warn(\`⚠️ Could not find inventory item '\${nameStr}' to commit for case \${id}\`);
                    }
                }`;

// Note: Using a softer match for the whitespace-sensitive block
const searchStr = "if (nameStr) {\r\n                    let primaryName = nameStr;\r\n                    let modelMatch = null;\r\n                    if (nameStr.includes(' - ')) {\r\n                    const lastDashIndex = nameStr.lastIndexOf(' - ');\r\n                    primaryName = nameStr.substring(0, lastDashIndex).trim();\r\n                    modelMatch = nameStr.substring(lastDashIndex + 3).trim();\r\n                }";

if (content.indexOf(searchStr) === -1) {
    console.log("Could not find block with CRLF, trying LF...");
    const searchStrLF = searchStr.replace(/\\r\\n/g, '\\n');
    if (content.indexOf(searchStrLF) !== -1) {
        console.log("Found with LF, patching...");
        content = content.replace(searchStrLF, newBlockCommit);
    } else {
        console.error("Critical Failure: Block not found!");
        process.exit(1);
    }
} else {
    console.log("Found with CRLF, patching...");
    content = content.replace(searchStr, newBlockCommit);
}

fs.writeFileSync(filePath, content);
console.log("Patch successfully applied.");
