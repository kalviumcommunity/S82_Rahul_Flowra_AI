// utils/schemaValidator.js
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true, strict: false });

export const uiSchema = {
  type: "object",
  required: ["title", "description", "palette", "typography", "pages", "navigation"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    palette: {
      type: "array",
      items: { type: "string", pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" }
    },
    typography: { type: "string" },
    pages: {
      type: "array",
      items: { type: "string" }
    },
    navigation: {
      type: "array",
      items: { type: "string" }
    },
    // optional additional fields
    metadata: { type: "object", additionalProperties: true },
    reasoning_steps: { type: "array", items: { type: "string" } }
  },
  additionalProperties: false
};

const validate = ajv.compile(uiSchema);

export const validateUIJson = (obj) => {
  const valid = validate(obj);
  return {
    valid,
    errors: valid ? null : (validate.errors || []).map(e => `${e.instancePath || '/'} ${e.message}`)
  };
};
