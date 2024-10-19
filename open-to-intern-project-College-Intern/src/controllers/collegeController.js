const collegeModel = require("../models/collegeModel");

//Validation function
const isValid = function (value) {
  if (typeof value == undefined || value == null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const createCollege = async (req, res) => {    
  try {
    let data = req.body
     const { name, fullName, logoLink } = data;

    if (Object.keys(data) == 0) {
      return res.status(400).send({ status: false, msg: " Data is  missing" });
    }

    const input1 = isValid(name);
    if (!input1) {
      return res.status(400).send({ status: false, msg: " Name is required" });
    }

    // Abbrevation must be in single word
    const collegeval = name.split(" ");
    const len = collegeval.length;
    if (len > 1) {
      return res.status(400).send({
        status: false,
        msg: "Abbreviated college name should be in single word",
      });
    }

    const input2 = isValid(fullName);
    if (!input2) {
      return res
        .status(400)
        .send({ status: false, msg: " FullName is required" });
    }

    const input3 = isValid(logoLink);
    if (!input3) {
      return res
        .status(400)
        .send({ status: false, msg: " Logolink is required" });
    }

    const isNameAlreadyUsed = await collegeModel.findOne({ name });
    if (isNameAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: "Name  is already used" });
    }

    const isFullNameAlreadyUsed = await collegeModel.findOne({ fullName });
    if (isFullNameAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: "Fullname is already used" });
    }

    const isLogoLinkAlreadyUsed = await collegeModel.findOne({ logoLink });
    if (isLogoLinkAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: "Logolink is already used" });
    }

    // To validate logoLink
    if (!/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(logoLink))
      return res
        .status(400)
        .send({ status: false, msg: " logoLink is invalid" });

    let saveData = await collegeModel.create(data);    
    res.status(201).send({ status: true, msg: saveData });  
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createCollege = createCollege;
