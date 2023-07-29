import { db } from "@/server/db"
import { House, _InsertHouse } from "@/server/db/schema"
import { toHouseResponse } from "@/server/models/responses/house"
import { defineHandler } from "@/server/utils/web/handler"
import { bindJson } from "@/server/utils/web/request"
import { sendData, sendErrors } from "@/server/utils/web/response"
import { eq } from "drizzle-orm"
import { z } from "zod"

const Param = z.object({
  code: z.string(),
})

export const POST = defineHandler(async (req) => {
  const param = await bindJson(req, Param)
  let isHouseExist = await db.query.House.findFirst({
    where: eq(House.code, param.code),
  })
  if (isHouseExist) return sendErrors(409, "House already exist")

  let house: _InsertHouse = {
    code: param.code,
  }

  let [newHouse] = await db.insert(House).values(house).returning()
  return sendData(201, toHouseResponse(newHouse))
})
