const Branch = require("../models/branch");

const getBranchs = async (req, res) => {
  const branches = await Branch.find({});
  res.json(branches);
};

const createBranch = async (req, res) => {
  const branch = new Branch({
    name,
    longitude,
    latitude,
  });

  await branch.save();
  res.json(newBranch);
};

const deleteBranch = async (req, res) => {
  const branch = await Branch.findById(id);
  if (!branch) return null;

  await branch.remove();
  res.json(branch);
};

const editBranch = async (req, res) => {

  const branch = await Branch.findById(id);
  if (!branch) return null;

  branch.name = name;
  branch.longitude = longitude;
  branch.latitude = latitude;
  await branch.save();
  res.json(branch);
};

module.exports = {
  getBranchs,
  createBranch,
  deleteBranch,
  editBranch,
};