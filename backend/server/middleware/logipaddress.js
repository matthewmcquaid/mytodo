// Middleware for logging the IP address of the request

const logIp = (req, res, next) => {
    console.log('Request from: ', req.ip);
    next();
}

export default async (req, res, next) => {
    logIp(req, res, next);
}