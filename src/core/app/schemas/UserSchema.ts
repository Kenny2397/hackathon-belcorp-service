import { z } from 'zod'

const CreateUserSchema = z.object({

  cod_cliente: z.string(),
  
})

type CreateUserType = z.infer<typeof CreateUserSchema>

const UserProductSuggestionSchema = z.object({
  cod_cliente: z.string(),
  productSuggestions: z.object({
    productsBuyed: z.object({}),
    productsSuggested: z.object({})
  }).optional()
})
type UserProductSuggestionType = z.infer<typeof UserProductSuggestionSchema>

export { CreateUserSchema, UserProductSuggestionSchema, type CreateUserType, type UserProductSuggestionType }

