export default (error, req, res, next, ) => {
    const message = error.message;
    const code = error.code;

    res.status(code).send({
        success: false,
        error: message,
    })
}