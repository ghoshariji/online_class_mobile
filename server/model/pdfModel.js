const mongoose = require("mongoose");
const pdfSchema = mongoose.Schema({
  uri:{String},
  name:{String},
  data: {Buffer},
});
const pdfModel = mongoose.model("Pdf", pdfSchema);
module.exports = pdfModel;
