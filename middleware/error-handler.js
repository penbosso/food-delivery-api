const logEvents = require('./log-event');

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    typeof err === 'string' ? logEvents(`${err}`, 'errLog.log') : logEvents(`${err.name}: ${err.message}`, 'errLog.log');
    switch (true) {
        case typeof err === 'string':
            // custom application error
            let statusCode = 400;
            if (err.toLowerCase().endsWith('taken')) {
                statusCode = 409;
            } else if (err.toLowerCase().endsWith('not found')) {
                statusCode = 404;
            }
            return res.status(statusCode).json({ message: err });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            return res.status(500).json({ message: err.message });
    }
}