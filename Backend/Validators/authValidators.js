import { z } from "zod";

export const registerSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    age: z.number().min(13, "Must be at least 13 years old").max(120, "Age must be realistic"),
    gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Gender must be Male, Female, or Other' }) }),
    height: z.number().min(100, "Height must be at least 100 cm").max(250, "Height must be less than 250 cm"),
    weight: z.number().min(30, "Weight must be at least 30 kg"),
    fitnessGoals: z.array(z.enum(['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Health'], { errorMap: () => ({ message: 'Invalid fitness goal' }) })).optional(),
    fitnessLevel: z.enum(['Beginner', 'Intermediate', 'Advanced'], { errorMap: () => ({ message: 'Fitness level must be Beginner, Intermediate, or Advanced' }) }).optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});


