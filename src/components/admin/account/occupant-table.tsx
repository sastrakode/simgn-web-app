import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { role } from "@/lib/constants"
import { HouseResponse } from "@/server/models/responses/house"
import { OccupantResponse } from "@/server/models/responses/occupant"

export default function OccupantTable({
  occupants,
  houses,
}: {
  occupants: OccupantResponse[]
  houses: HouseResponse[]
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>No. Rumah</TableHead>
          <TableHead>No. Telp</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tipe</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {occupants.length > 0 &&
          occupants.map((occupant) => (
            <TableRow key={occupant.id}>
              <TableCell>{occupant.id}</TableCell>
              <TableCell>{occupant.name}</TableCell>
              <TableCell>
                {houses.find((house) => house.id == occupant.house_id)?.code}
              </TableCell>
              <TableCell>{occupant.phone ?? "-"}</TableCell>
              <TableCell>{occupant.email ?? "-"}</TableCell>
              <TableCell>{role[occupant.role]}</TableCell>
              <TableCell>
                <a href={`/admin/account/occupant/edit/${occupant.id}`}>
                  <Button className="mr-1" variant="outline" size="sm">
                    Edit
                  </Button>
                </a>
                <Button variant="destructive" size="sm">
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
