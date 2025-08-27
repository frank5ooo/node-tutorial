// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
import z, { ZodType } from "zod/v4";

export type Revenue = {
  month: string;
  revenue: number;
};

export const PaginationPayload = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(6),
});

export type Pagination = z.input<typeof PaginationPayload>;

interface Payload<D> {
  pagination: Pagination;
  data?: D;
}

export function payloadSchema<S extends ZodType>(data: S) {
  type D= z.output<S>
  
  return z.object({
    data,
    pagination: PaginationPayload,
  }) satisfies ZodType<Payload<D>>;
}

export const FormSchema = payloadSchema(
  z.object({
    idCustomer: z.string(),
  })
);