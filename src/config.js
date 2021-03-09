module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://topher.dunlap@localhost/traveler',
    JWT_SECRET: process.env.JWT_SECRET || 'i-am-a-banana-my-spoon-is-too-big',
    // API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api'
};