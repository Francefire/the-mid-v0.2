import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { rooms } from "@/lib/functions/rooms";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RoomCreate from "./roomCreate";

export const Rooms = () => {
  const [roomList, setRoomList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await rooms.listRooms();
      setRoomList(response.rows);
    };
    fetchRooms();
  }, []);

  const handleRoomCreated = () => {
    setIsDialogOpen(false);
    // Rafraîchir la liste des rooms
    const fetchRooms = async () => {
      const response = await rooms.listRooms();
      setRoomList(response.rows);
    };
    fetchRooms();
  };

  return (
    <div>
      <div className="flex gap-4">
        <h1 className="text-2xl font-bold">Créer une room :</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
                <Plus/>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>Nouvelle room</DialogTitle>
            <RoomCreate onSuccess={handleRoomCreated} />
          </DialogContent>
        </Dialog>

      </div>
      <div className="grid grid-cols-3 gap-2 p-10">
        {roomList.map((room) => (
          <div
            key={room.$id}
            className="bg-muted rounded-md p-4 flex flex-col gap-4 justify-between"
          >
            <div className="flex flex-row justify-between items-center">
            <div className="text-lg font-bold">{room.name}</div>
            <div className="font-bold text-muted-foreground">
              {room.playerIds.length}/{room.maxPlayers}
              </div>
            </div>
            <Button asChild>
              <Link to={`/rooms/${room.$id}`}>
                <span className="text-sm">Join</span>
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
