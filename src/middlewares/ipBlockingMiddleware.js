/**
 * Middleware to check for slurs in the request body and blacklist IP if found.
 * 
 * @param {Object} redis - Redis client for handling blacklisting.
 * @returns {Function} - Middleware function.
 */
const checkForSlurs = (redis) => (req, res, next) => {
    const slurRegex = /import|print/gi; // Example regex, replace with actual slurs

    if (req.method === 'POST' && req.body && slurRegex.test(req.body.mc)) {
        const ip = req.ip; // Get the IP address of the requester
        redis.set(ip, 'blacklisted', 'EX', 60); // Blacklist IP for 1 minute
        console.log(`IP ${ip} blacklisted for posting a slur: ${req.body.mc}`);
        return res.status(403).json({ error: 'You are blacklisted for posting a slur.' });
    }

    next();
};

module.exports = checkForSlurs;
