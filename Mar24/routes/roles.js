const express = require("express");
const router = express.Router();
const Role = require("../schemas/role");

// Get all roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get role by ID
router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role)
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new role
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingRole = await Role.findOne({ name });
    if (existingRole)
      return res
        .status(400)
        .json({ success: false, message: "Role already exists" });

    const newRole = new Role({ name, description });
    await newRole.save();

    res.status(201).json({ success: true, data: newRole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update role
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.findById(req.params.id);

    if (!role)
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });

    if (name) role.name = name;
    if (description) role.description = description;

    await role.save();
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete role
router.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role)
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });

    await role.deleteOne();
    res.status(200).json({ success: true, message: "Role deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
