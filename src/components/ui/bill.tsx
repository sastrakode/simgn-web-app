"use client"

import { ReactNode } from "react"
import { toast } from "sonner"

import { catchError, numberFormat } from "@/lib/utils"
import { Button } from "./button"
import { BillingResponse } from "@/server/models/responses/billing"
import { useRouter } from "next/navigation"
import { payBill, payBillCash } from "@/lib/api"

export const BillTable = ({ children }: { children: ReactNode }) => (
  <div className="bg-white p-4 mt-[1.125rem] lg:mt-9 rounded-3xl">
    <p className="font-bold text-sm sm:text-base">Tagihan</p>
    <div className="h-[2px] bg-gray-200 mt-3 mb-5" />
    <div className="flex flex-col gap-6 px-5">{children}</div>
  </div>
)

export function BillListItem({
  bill,
  occupantId,
}: {
  bill: BillingResponse
  occupantId?: number
}) {
  const router = useRouter()

  const handlePay = async () => {
    if (occupantId) {
      const [_, err] = await payBillCash(bill.id, {
        occupant_id: occupantId,
      })

      if (err) {
        catchError(new Error("Pembayaran gagal"))
      } else {
        toast.success("Pembayaran berhasil")
      }
    } else {
      const [payment, err] = await payBill(bill.id)
      if (payment.redirectUrl) {
        window.open(payment.redirectUrl)
      }
    }

    router.refresh()
  }

  return (
    <div className="flex justify-between p4 items-center">
      <p className="font-bold text-sm">{`${new Date(bill.period).toLocaleString(
        "id-ID",
        {
          month: "long",
        },
      )} ${new Date(bill.period).getFullYear()}`}</p>
      <p className="font-bold text-sm sm:text-base">
        {numberFormat(bill.amount)}
      </p>
      <Button
        variant="secondary"
        className="hidden sm:block"
        onClick={handlePay}
      >
        Bayar
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="sm:hidden"
        onClick={handlePay}
      >
        Bayar
      </Button>
    </div>
  )
}
