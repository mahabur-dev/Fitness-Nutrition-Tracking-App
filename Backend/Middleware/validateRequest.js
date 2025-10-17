export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Ensure schema is actually a Zod schema
      if (!schema || typeof schema.safeParse !== "function") {
        throw new Error("Invalid schema passed to validateRequest middleware");
      }

      const result = schema.safeParse(req.body);

      if (!result.success) {
        const formattedErrors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors,
        });
      }

      req.validatedData = result.data;
      next();
    } catch (err) {
      console.error("Validation middleware error:", err.message);
      return res.status(500).json({
        success: false,
        message: "Internal validation error",
        error: err.message,
      });
    }
  };
};