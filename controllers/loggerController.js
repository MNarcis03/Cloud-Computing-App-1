module.exports = function (req, res, chalk) {
    //////////////////////////////////////////
    // Logger setting
    //
    // 1 - Minimal (url, status, latency)
    // 2 - Medium (1 + headers, httpVers, method)
    // 3 - Aggressive (2 + many)
    // 4 - Custom
    //////////////////////////////////////////

    const {rawHeaders, httpVersion, method, socket, url} = req;
    const {remoteAddress, remoteFamily} = socket;
    const loggerStage = process.env.LOGGER_DETAILS ? process.env.LOGGER_DETAILS : '1';
    const requestStart = Date.now();

    switch (loggerStage) {
        case '1':
            res.on("finish", () => {
                const {statusCode, statusMessage} = res;

                console.log(chalk.green(statusCode) + ' '
                    + chalk.cyan((Date.now() - requestStart) + 'ms') + ' '
                    + url);
            });
            break;
        default:
            break;
    }
};