import { getCookie } from "cookies-next"
import { House, Occupant, OccupantLogin, StaffLogin } from "./model"
import { AnnouncementResponse } from "@/server/models/responses/announcement"
import { StaffResponse } from "@/server/models/responses/staff"
import { AnnouncementCategoryResponse } from "@/server/models/responses/announcement-category"

const isServer = typeof window === "undefined"
const baseURL = isServer ? "http://127.0.0.1:3000/api/v1" : "/api/v1"

const getToken = async () => {
  let token: string
  if (isServer) {
    const { cookies } = await import("next/headers")
    token = `Bearer ${cookies().get("token")?.value}`
  } else {
    token = String(getCookie("token"))
  }
  return token
}

export type FetchError = string[] | null

async function handleFetch<T>(
  url: string,
  requestOptions?: RequestInit,
): Promise<[T, FetchError]> {
  try {
    const res = await fetch(url, requestOptions)

    const resJson = await res.json()

    // Sometimes we need errors fields (example: login)
    if (!res.ok) {
      if (resJson.errors) return [null as T, resJson.errors]
      else {
        throw new Error("Something went wrong")
      }
    }

    return [resJson.data, null]
  } catch (error) {
    throw new Error("Something went wrong")
  }
}

export async function occupantLogin(body: {}): Promise<
  [OccupantLogin, FetchError]
> {
  const res = await handleFetch<OccupantLogin>(
    `${baseURL}/auth/occupant/login`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  )

  return res
}

export async function staffLogin(body: {}): Promise<[StaffLogin, FetchError]> {
  const res = await handleFetch<StaffLogin>(`${baseURL}/auth/staff/login`, {
    method: "POST",
    body: JSON.stringify(body),
  })

  return res
}

export async function getHouse(id: string): Promise<[House, FetchError]> {
  const res = await handleFetch<House>(`${baseURL}/house/${id}`)
  return res
}

export async function getHouses(): Promise<[House[], FetchError]> {
  const res = await handleFetch<House[]>(`${baseURL}/house`)
  return res
}

export async function getOccupant(id: string): Promise<[Occupant, FetchError]> {
  const token = await getToken()

  const res = await handleFetch<Occupant>(`${baseURL}/occupant/${id}`, {
    headers: {
      Authorization: token,
    },
  })

  return res
}

export async function getOccupants(): Promise<[Occupant[], FetchError]> {
  const token = await getToken()

  const res = await handleFetch<Occupant[]>(`${baseURL}/occupant`, {
    headers: {
      Authorization: token,
    },
  })
  return res
}

export async function getStaff(
  id: string,
): Promise<[StaffResponse, FetchError]> {
  const token = await getToken()

  const res = await handleFetch<StaffResponse>(`${baseURL}/staff/${id}`, {
    headers: {
      Authorization: token,
    },
  })

  return res
}

export async function getStaffs(): Promise<[StaffResponse[], FetchError]> {
  const token = await getToken()

  const res = await handleFetch<StaffResponse[]>(`${baseURL}/staff`, {
    headers: {
      Authorization: token,
    },
  })
  return res
}

export async function getAnnouncements(): Promise<
  [AnnouncementResponse[], FetchError]
> {
  const res = await handleFetch<AnnouncementResponse[]>(
    `${baseURL}/announcement`,
  )

  return res
}

export async function getAnnouncement(
  id: string,
): Promise<[AnnouncementResponse, FetchError]> {
  const token = await getToken()

  const res = await handleFetch<AnnouncementResponse>(
    `${baseURL}/announcement/${id}`,
    {
      headers: {
        Authorization: token,
      },
    },
  )

  return res
}

export async function getAnnouncementCategories(): Promise<
  [AnnouncementCategoryResponse[], FetchError]
> {
  const res = await handleFetch<AnnouncementCategoryResponse[]>(
    `${baseURL}/announcement/category`,
  )

  return res
}
