const baseUrl =
    process.env.NODE_ENV !== "production"
        ? "http://localhost:3000"
        : "https://red-social-alan.herokuapp.com"

module.exports = baseUrl;
