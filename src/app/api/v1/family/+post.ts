import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Family, Occupant, TInsertFamily } from "@/server/db/schema"
import { toFamilyResponse } from "@/server/models/responses/family"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { bindJson } from "@/server/web/request"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"
import { z } from "zod"

const Param = z.object({
  occupant_id: z.number().nonnegative(),
  name: z.string(),
  identity_number: z.string(),
  birthday: z.date(),
  gender: z.enum(["laki-laki", "perempuan"]),
  birthplace: z.string(),
  religion: z.string(),
  education: z.string().optional(),
  job_type: z.string().optional(),
  marital_status: z.string(),
  relationship_status: z.string(),
  father_name: z.string(),
  mother_name: z.string(),
})

export const POST = defineHandler(async (req) => {
  useAuth(req, "admin", "secretary", "owner", "renter")
  const param = await bindJson(req, Param)
  const occupant = await db().query.Occupant.findFirst({
    where: eq(Occupant.id, param.occupant_id),
  })
  if (!occupant) return sendErrors(404, errorDefinition.occupant_not_found)

  const family: TInsertFamily = {
    occupantId: occupant.id,
    name: param.name,
    identityNumber: param.identity_number,
    birthday: param.birthday,
    gender: param.gender,
    birthplace: param.birthplace,
    religion: param.religion,
    education: param.education,
    job_type: param.job_type,
    maritalStatus: param.marital_status,
    relationshipStatus: param.relationship_status,
    fatherName: param.father_name,
    motherName: param.mother_name,
  }

  const [newFamily] = await db().insert(Family).values(family).returning()
  return sendData(201, toFamilyResponse(newFamily))
})
