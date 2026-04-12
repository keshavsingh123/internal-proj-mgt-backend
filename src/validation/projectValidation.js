import Joi from "joi";

export const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Project name is required",
    "any.required": "Project name is required",
  }),
  description: Joi.string().trim().allow("").max(500).optional(),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().allow("").max(500).optional(),
  status: Joi.string().valid("active", "archived").optional(),
}).min(1);

export const addProjectMemberSchema = Joi.object({
  memberId: Joi.string().trim().required().messages({
    "string.empty": "memberId is required",
    "any.required": "memberId is required",
  }),
});
