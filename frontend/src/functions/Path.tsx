function buildPath(route) {
    // TODO: Change production buildPath
    if (process.env.NODE_ENV === 'production')
        return '';
    else
        return 'http://localhost:3001/' + route;
}

export { buildPath };