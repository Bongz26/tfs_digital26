const { sendEmail } = require('./emailService');

/**
 * Finds an inventory item in the specific branch, or auto-creates a "Ghost Stock" item (negative balance)
 * if it doesn't exist. Triggers an email alert for ghost stock creation.
 * 
 * @param {object} supabase - Supabase client
 * @param {object} params - { name, color, branch, category, caseNumber }
 * @returns {Promise<object|null>} The inventory item (existing or newly created)
 */
exports.findOrCreateInventoryItem = async (supabase, { name, color, branch, category = 'coffin', caseNumber }) => {
    const nameStr = String(name || '').trim();
    const colorStr = String(color || '').trim();
    const selectedBranch = (branch || 'Head Office').trim().toUpperCase();

    if (!nameStr) return null;

    // Parse Name/Model (e.g. "Pongee - Poper")
    let primaryName = nameStr;
    let modelMatch = null;
    if (nameStr.includes(' - ')) {
        const lastDashIndex = nameStr.lastIndexOf(' - ');
        primaryName = nameStr.substring(0, lastDashIndex).trim();
        modelMatch = nameStr.substring(lastDashIndex + 3).trim();
    }

    // 1. STRICT SEARCH: Look for item in Case Branch ONLY
    let invItem = null;

    let query = supabase
        .from('inventory')
        .select('id, stock_quantity, reserved_quantity, name, model, color, unit_price, low_stock_threshold, sku, description, supplier, location')
        .eq('category', category)
        .eq('location', selectedBranch)
        .ilike('name', primaryName)
        .order('stock_quantity', { ascending: false });

    const { data: matches, error: fetchErr } = await query;

    if (matches && matches.length > 0) {
        let candidates = matches;

        // Filter by model if specified
        if (modelMatch) {
            const exactModel = candidates.filter(i => i.model && i.model.toLowerCase() === modelMatch.toLowerCase());
            if (exactModel.length > 0) candidates = exactModel;
        }

        // Filter by color if specified
        if (colorStr && candidates.length > 0) {
            const colorMatch = candidates.find(i => i.color && i.color.toLowerCase() === colorStr.toLowerCase());
            if (colorMatch) invItem = colorMatch;
            else {
                invItem = null; // Found name match but not color match -> Create new
            }
        } else if (candidates.length > 0) {
            invItem = candidates[0];
        }
    }

    // 2. Return Found Item
    if (invItem) {
        return invItem;
    }

    // 3. Auto-Create "Ghost Stock" (Negative Balance)
    console.log(`👻 Item '${nameStr}' (${colorStr}) not found in ${selectedBranch}. Auto-creating Ghost Stock...`);

    // A. Try to find a TEMPLATE from another branch (to get pricing/SKU/Desc)
    const { data: templates } = await supabase
        .from('inventory')
        .select('*')
        .eq('category', category)
        .ilike('name', primaryName)
        .limit(1);

    const template = templates && templates.length > 0 ? templates[0] : {};

    // B. Insert new item (Strict Column Mapping)
    const newItemObj = {
        name: primaryName,
        model: modelMatch || template.model || '',
        color: colorStr || template.color || '',
        category: category,
        location: selectedBranch, // Already uppercased
        stock_quantity: 0,
        reserved_quantity: 0,
        low_stock_threshold: 5,
        unit_price: template.unit_price || 0,
        sku: template.sku ? `${template.sku}-${selectedBranch.substring(0, 3).toUpperCase()}` : `AUTO-${Date.now()}`,
        notes: `Auto-created for Case ${caseNumber || 'Unknown'}`
    };

    const result = await supabase
        .from('inventory')
        .insert(newItemObj)
        .select();

    const { data, error: createErr } = result;

    if (createErr) {
        console.error('❌ Failed to auto-create ghost stock:', JSON.stringify(createErr, null, 2));
        return null;
    }

    if (!data || data.length === 0) {
        console.error('❌ Insert succeeded but returned NO DATA.');
        return null;
    }

    const createdItem = data[0];
    console.log(`✅ Ghost Stock Created: ID ${createdItem.id} at ${selectedBranch}`);

    // C. Send Alert
    try {
        const alertTo = process.env.INVENTORY_ALERTS_TO || process.env.ALERTS_TO || process.env.MANAGEMENT_EMAIL;
        if (alertTo) {
            const subject = `⚠️ Negative Stock Alert: ${nameStr} (${selectedBranch})`;
            const html = `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f44336; border-radius: 5px;">
                    <h2 style="color: #d32f2f;">Negative Stock Created</h2>
                    <p>The following item was selected for a case but did not exist in the branch inventory.</p>
                    <p>The system has <strong>auto-created</strong> it. Once reserved, it will show a negative availability.</p>
                    <ul style="background: #fff3f3; padding: 15px;">
                        <li><strong>Item:</strong> ${nameStr}</li>
                        <li><strong>Model:</strong> ${modelMatch || 'N/A'}</li>
                        <li><strong>Color:</strong> ${colorStr || 'N/A'}</li>
                        <li><strong>Location:</strong> ${selectedBranch}</li>
                        <li><strong>Case Number:</strong> ${caseNumber || 'N/A'}</li>
                    </ul>
                    <p><strong>Action Required:</strong> Please transfer stock to ${selectedBranch} or update the inventory levels.</p>
                </div>
            `;
            sendEmail(alertTo, subject, html).catch(e => console.error('Failed to send negative stock alert:', e));
        }
    } catch (emailErr) {
        console.error('Failed to initialize email service for alert:', emailErr);
    }

    return createdItem;
};
