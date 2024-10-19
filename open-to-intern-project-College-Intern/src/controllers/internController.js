const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");

// Validation function
const isValid = function (value) {
  if (typeof value == undefined || value == null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const createIntern = async function (req, res) {
  try {
    const data = req.body;
    const { name, email, mobile,collegeId } = data;

    if (Object.keys(data) == 0) {
      return res.status(400).send({ status: false, msg: " Data is  missing" });
    }

    const request = isValid(name);
    if (!request) {
      return res.status(400).send({ status: false, msg: " Name is required" });
    }

    const request1 = isValid(email);
    if (!request1) {
      return res.status(400).send({ status: false, msg: " Email is required" });
    }

    const request2 = isValid(mobile);
    if (!request2) {
      return res
        .status(400)
        .send({ status: false, msg: " Mobile is required" });
    }

    const request3 = isValid(collegeId);
    if (!request3) {
      return res.status(400).send({ status: false, msg: " Id is required" });
    }
    
    const isEmailAlreadyUsed = await internModel.findOne({ email });
    if (isEmailAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: `${email} email is already used` });
    }

    //Email validating
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))    
      return res.status(400).send({ status: false, msg: " Email is invalid" });


    const isMobileAlreadyUsed = await internModel.findOne({ mobile });
    if (isMobileAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: `${mobile} mobile is already used` });
    }

    //Mobile validating
    if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile))
      return res.status(400).send({ status: false, msg: " Mobile is invalid" });
      
    const Id = await collegeModel.findOne({_id: collegeId})
    if(!Id)
            return res.status(404).send({status: false, message: 'Id not found'})
            const internData = { name, email, mobile, collegeId}

    const saveData = await internModel.create(internData);
    res
      .status(201)
      .send({ status: "successful-response-structure", msg: saveData });
  } catch (error) {
    res.status(500).send({ status:false, error: error.message });
  }
};

//getCollegeDetails

const getCollegeDetails = async (req, res) => {
  try {
    const queryParams = req.query;
    const { name1 } = req.query;
    
    const input = isValid(queryParams);

    if (!input) {
      return res.status(400).send({ status: false, msg: " Invalid Input" });
    }

    if (Object.keys(queryParams).length > 1) {
      return res.status(400).send({ status: false, message: "Invalid Input" });
    }

    if (!name1) {
      return res
        .status(400)
        .send({ status: false, message: "name Is Required" });
    }

    if (name1.split(" ").length > 1) {
      return res
        .status(400)
        .send({
          status: false,
          message: "please provide The Valid Abbreviation",
        });
    }

    const collegeNames = await collegeModel.findOne({ name: name1 });
    if (!collegeNames) {
      return res
        .status(404)
        .send({
          status: false,
          message: "College Not Found, Please Check College Name",
        });
    }

    const collegeId = collegeNames._id;

    const InternsInCollege = await internModel
      .find({ collegeId: collegeId })
      .select({ _id: 1, email: 1, name: 1, mobile: 1 });

    const { name, fullName, logoLink } = collegeNames;


    const finalData = {
      name: name,
      fullName: fullName,
      logoLink: logoLink,
      interns: InternsInCollege.length
        ? InternsInCollege
        : { message: "No one applied for internship in this college" },
    };

    return res
      .status(200)
      .send({ status: true, message: "College Details", Data: finalData });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.createIntern = createIntern;

module.exports.getCollegeDetails = getCollegeDetails;
