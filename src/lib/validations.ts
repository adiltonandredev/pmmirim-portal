import { z } from "zod"

export const createUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["ADMIN", "EDITOR"], { message: "Role inválido" })
})

export const updateUserSchema = z.object({
  id: z.string().cuid("ID inválido"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
  role: z.enum(["ADMIN", "EDITOR"]).optional()
})

export const createPostSchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres"),
  summary: z.string().min(10, "Resumo deve ter no mínimo 10 caracteres"),
  content: z.string().min(20, "Conteúdo deve ter no mínimo 20 caracteres"),
  type: z.enum(["NEWS", "EVENT", "ACTIVITY", "PROJECT"]),
  eventDate: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  published: z.boolean().optional()
})

export const updatePostSchema = createPostSchema.extend({
  id: z.string().cuid("ID inválido")
})

export const contactMessageSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(5, "Assunto deve ter no mínimo 5 caracteres").optional(),
  message: z.string().min(20, "Mensagem deve ter no mínimo 20 caracteres")
})
