module.exports = function(req, res, models, url) {
    const urlParams = url.parse(req.url, true);
    const urlQuery = urlParams.query;
    const Category = models.categoryModel;
    const Racer = models.racerModel;

    if (urlParams.pathname === '/populateDatabase') {
        populateDatabase(res, Category, Racer);
    } else if (urlParams.pathname === '/racers') {
        switch (req.method) {
            case 'GET':
                handleGetRequest(Category, Racer, urlQuery)
                    .then(([statusCode, response]) => {
                        sendResponse(res, statusCode, response);
                    });
                break;
            case 'POST':
                getRequestBody(req)
                    .then((body) => {
                        handlePostRequest(Category, Racer, urlQuery, body)
                            .then(([statusCode, response]) => {
                                sendResponse(res, statusCode, response);
                            });
                    });
                break;
            case 'PUT':
                getRequestBody(req)
                    .then((body) => {
                        handlePutRequest(Category, Racer, urlQuery, body)
                            .then(([statusCode, response]) => {
                                sendResponse(res, statusCode, response);
                            });
                    });
                break;
            case 'DELETE':
                handleDeleteRequest(Category, Racer, urlQuery)
                    .then(([statusCode, response]) => {
                        sendResponse(res, statusCode, response);
                    });
                break;
        }
    } else {
        sendResponse(res, 404, 'Invalid Request');
    }
};

function populateDatabase(res, Category, Racer) {
    const RACE_TYPE_F1 = 'F1';
    const RACE_TYPE_STREET = 'Street';
    const RACE_TYPE_NASCAR = 'Nascar';

    const categories = [RACE_TYPE_F1, RACE_TYPE_STREET, RACE_TYPE_NASCAR];

    const racers = {
        [RACE_TYPE_F1]: [{name: "Alex"}, {name: "Narcis"}],
        [RACE_TYPE_STREET]: [{name: "Alex"}, {name: "Narcis"}],
        [RACE_TYPE_NASCAR]: [{name: "Alex"}, {name: "Narcis"}]
    };

    Racer.findOne({}, (err, data) => {
        if (err) {
            throw err;
        }

        if (data !== null) {
            // already created
            sendResponse(res, 400, 'Already created DB');
        } else {
            // not created
            categories.forEach((category) => {
                Category({name: category}).save((err, data) => {
                    if (err) {
                        throw err;
                    }

                    let categoryId = data._id;

                    racers[category].forEach((racer) => {
                        racer.category = categoryId;

                        Racer(racer).save((err, data) => {
                            if (err) {
                                throw err;
                            }
                        });
                    });
                });
            });

            sendResponse(res, 201, 'Db created');
        }
    });
}

function sendResponse(res, statusCode = 200, message = '') {
    res.writeHead(
        statusCode,
        {
            'Content-Type': 'application/json'
        }
    );
    res.end(JSON.stringify(message));
}

function getRacers(Racer, conditions) {
    return new Promise(resolve => {
        Racer.find(conditions, (err, data) => {
            if (err) {
                throw err;
            }

            resolve(data);
        });
    });
}

function updateRacer(Racer, conditions, newValues) {
    return new Promise(resolve => {
        Racer.updateOne(conditions, newValues, (err, data) => {
            if (err) {
                throw err;
            }

            if (data.nModified === 0) {
                // no update
                resolve([404, 'No entitie to update']);
            } else {
                resolve([200, 'Modified ' + data.nModified + ' entity']);
            }
        });
    })
}

function getCategoryId(Category, categoryName) {
    return new Promise(resolve => {
        Category.findOne({name: categoryName}, (err, data) => {
            if (err) {
                throw err;
            }

            if (data && data._id !== 'undefined') {
                resolve(data._id);
            } else {
                resolve(null);
            }
        });
    });
}

function getRequestBody(req) {
    return new Promise(resolve => {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let response = JSON.parse(body);

            resolve(response);
        });
    });
}

function handleGetRequest(Category, Racer, urlParams) {
    return new Promise(resolve => {
        if (urlParams.category && urlParams.category !== 'undefined') {
            getCategoryId(Category, urlParams.category)
                .then((result) => {
                    if (result) {
                        urlParams.category = result;

                        getRacers(Racer, urlParams)
                            .then((result) => {
                                resolve([201, result]);
                            });
                    } else {
                        resolve([400, 'Bad Category']);
                    }
                });
        } else {
            getRacers(Racer, urlParams)
                .then((result) => {
                    resolve([201, result]);
                });
        }
    });
}

function handlePostRequest(Category, Racer, urlParams, body) {
    return new Promise(resolve => {
        if (body.category && body.category !== 'undefined') {
            getCategoryId(Category, body.category)
                .then((result) => {

                    if (result) {
                        // category exists
                        body.category = result;

                        Racer(body).save((err, data) => {
                            if (err) {
                                throw err;
                            }

                            // racer added
                            resolve([201, 'Racer added']);
                        });
                    } else {
                        // inexistent category
                        // check if category was sent
                        if (Object.keys(body).length === 1 &&
                            body.category !== 'undefined') {

                            Category({name: body.category}).save((err, data) => {
                                if (err) {
                                    throw err;
                                }

                                // intention was to add a category
                                resolve([201, 'Category Created']);
                            });
                        } else {
                            // if category was not the only one
                            resolve([404, 'First add category']);
                        }
                    }
                });
        } else {
            resolve([400, 'Category not selected!']);
        }
    });
}

function handlePutRequest(Category, Racer, urlParams, body) {
    return new Promise(resolve => {
        if (urlParams.category !== 'undefined') {
            getCategoryId(Category, urlParams.category)
                .then((category) => {
                    urlParams.category = category;

                    updateRacer(Racer, urlParams, body)
                        .then((result) => resolve(result));
                });
        } else {
            updateRacer(Racer, urlParams, body)
                .then((result) => resolve(result));
        }
    });
}

function deleteRacer(Racer, conditions) {
    return new Promise(resolve => {
        Racer.deleteOne(conditions, (err, data) => {
            if (err) {
                resolve([500, 'Server error']);
            } else {
                console.log(data);
                if (data.deletedCount === 0) {
                    resolve([404, 'No entity to delete']);
                } else {
                    resolve([200, 'Entity deleted']);
                }
            }
        })
    });
}

function handleDeleteRequest(Category, Racer, urlParams) {
    return new Promise(resolve => {
        console.log(urlParams);
        if (urlParams.category !== 'undefined') {
            if (Object.keys(urlParams).length === 1) {
                // want to delete by category - not allowed
                resolve([405, 'Not allowd to delete by category']);
            } else {
                console.log("Here!");
                getCategoryId(Category, urlParams.category)
                    .then((categoryId) => {
                        urlParams.category = categoryId;

                        deleteRacer(Racer, urlParams)
                            .then((result) => resolve(result));
                    })
            }
        } else {
            // delete racer that match the query
            deleteRacer(Racer, urlParams)
                .then((result) => resolve(result));
        }
    });
}

