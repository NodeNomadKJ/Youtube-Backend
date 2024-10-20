import { body} from "express-validator";
const fileValidation = (
    fieldName,
    allowedFormats,
    errorMessage,
    required = true
  ) => {
    return body(fieldName).custom((value, { req }) => {
      const file = req.files && req.files[fieldName] && req.files[fieldName][0];
  
      // Handle required/optional file validation
      if (required && !file) {
        throw new Error(
          `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`
        );
      }
  
      if (file && !allowedFormats.includes(file.mimetype)) {
        throw new Error(errorMessage);
      }
  
      return true;
    });
  };

export {fileValidation};