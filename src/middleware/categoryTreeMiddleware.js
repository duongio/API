function buildTree(categories) {
    let tree = {};
    let lookup = {};

    categories.forEach(category => {
        lookup[category.category_id] = { ...category, children: [] };
    });

    categories.forEach(category => {
        const parent_id = category.parent_id;

        if (parent_id === null || parent_id === 0) {
            tree[category.category_id] = lookup[category.category_id];
        } else {
            lookup[parent_id].children.push(lookup[category.category_id]);
        }
    });

    return tree;
}

module.exports = buildTree;
