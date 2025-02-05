import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Tokens expiram em 1 hora

export default cache;