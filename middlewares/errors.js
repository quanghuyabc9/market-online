const http_errors = require('http-errors');

module.exports = app => {
    app.use((req, res, next) => {
        next(http_errors(404));
    })

    app.use((err, req, res, next) => {
        let status = err.status || 500;
        let errorCode = 'error';
        if (status === 404)
            errorCode = '404';
        if (status === 500)
            errorCode = '500';
        let errorMsg = err.message;
        res.render('errors/error_view', {
            layout: false,
            errorCode,
            errorMsg,
            error: err
        });
    });
};