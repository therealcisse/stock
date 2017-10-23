const dbStatus = state => state.getIn(['app', 'dbStatus']);
const unAuthorized = state => state.getIn(['app', 'unAuthorized']);

export { dbStatus, unAuthorized };
