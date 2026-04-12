import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).required().messages({
    "string.empty": "Task title is required",
    "any.required": "Task title is required",
  }),
  description: Joi.string().trim().allow("").max(1000).optional(),
  status: Joi.string().valid("todo", "in_progress", "done").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  assignee: Joi.string().allow(null, "").optional(),
  dueDate: Joi.date().allow(null, "").optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).optional(),
  description: Joi.string().trim().allow("").max(1000).optional(),
  status: Joi.string().valid("todo", "in_progress", "done").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  assignee: Joi.string().allow(null, "").optional(),
  dueDate: Joi.date().allow(null, "").optional(),
}).min(1);

export const updateTaskStatusSchema = Joi.object({
  status: Joi.string()
    .valid("todo", "in_progress", "done")
    .required()
    .messages({
      "any.required": "Status is required",
    }),
});
