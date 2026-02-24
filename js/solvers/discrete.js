function parseSet(str) {
    try {
        const cleaned = str.replace(/[{}]/g, '').replace(/\s/g, '');
        if (cleaned === '') return new Set();
        const elements = cleaned.split(',').map(Number);
        return new Set(elements);
    } catch (e) {
        return new Set();
    }
}

function formatSet(set) {
    if (set.size === 0) return '∅';
    return '{' + Array.from(set).sort((a,b)=>a-b).join(',') + '}';
}

function union(setA, setB) {
    return new Set([...setA, ...setB]);
}

function intersection(setA, setB) {
    return new Set([...setA].filter(x => setB.has(x)));
}

function difference(setA, setB) {
    return new Set([...setA].filter(x => !setB.has(x)));
}

function calculateSets(setAStr, setBStr, operation) {
    const setA = parseSet(setAStr);
    const setB = parseSet(setBStr);
    let resultSet;
    switch (operation) {
        case 'union':
            resultSet = union(setA, setB);
            break;
        case 'intersection':
            resultSet = intersection(setA, setB);
            break;
        case 'difference':
            resultSet = difference(setA, setB);
            break;
        default:
            return 'Неизвестная операция';
    }
    return formatSet(resultSet);
}