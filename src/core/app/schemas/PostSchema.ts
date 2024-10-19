import { z } from 'zod'

const ProductSuggestionSchema = z.object({
  cod_cliente: z.string().optional(),
  des_nombre_cliente: z.string().optional(),
  suggestedProductsCount:z.number().optional()
})

type ProductSuggestionType = z.infer<typeof ProductSuggestionSchema>

export { ProductSuggestionSchema, type ProductSuggestionType }

