const verifyOpenAIApiKey = (req, res, next) => {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
      return res.status(500).json({
        error: 'OPENAI_API_KEY is not configured in environment variables. Please set OPENAI_API_KEY in your .env file.'
      });
    }
    next();
  };

  module.exports = verifyOpenAIApiKey;