module.exports = function (req, res, chalk) {
    const {rawHeaders, httpVersion, method, socket, url} = req;
    const {remoteAddress, remoteFamily} = socket;
    const loggerStage = process.env.LOGGER_DETAILS ? process.env.LOGGER_DETAILS : '1';
    const requestStart = Date.now();

    res.on("finish", () => {
        const {statusCode, statusMessage} = res;

        console.log(chalk.green(statusCode) + ' '
            + chalk.cyan((Date.now() - requestStart) + 'ms') + ' '
            + url);
    });
};
