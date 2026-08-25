module.exports = {
  url: process.env.MONGODB_URI || 'mongodb+srv://Typing:<db_password>@cluster0.i9bsuvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
};