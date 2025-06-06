import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(4,{message: "Message must be at least 4 characters long"})
        .max(500,{message: "Message must be at most 500 characters long"}),

})