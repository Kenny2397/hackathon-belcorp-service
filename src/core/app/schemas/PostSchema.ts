import { z } from 'zod'

const ProductSuggestionSchema = z.object({
  username: z.string(),
  suggestedProductsCount:z.number().optional()
})

type ProductSuggestionType = z.infer<typeof ProductSuggestionSchema>

export { ProductSuggestionSchema, type ProductSuggestionType }

