import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { client } from "@/lib/appwrite";
import { config } from "@/lib/config";
import { rooms } from "@/lib/functions/rooms";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RoomCreate from "./roomCreate";

export const Rooms = () => {
  const [roomList, setRoomList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRooms = async () => {
    const response = await rooms.listRooms();
    setRoomList(response.rows);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    // Abonnement aux changements dans la collection "rooms" si c'est un delete ou un ajout gérer différemment
    const unsub = client.subscribe(
      [`databases.${config.appwrite.databaseId}.collections.rooms.documents`],
      (response) => {
        fetchRooms();
      }
    );
    return () => {
      unsub();
    };
  }, []);

  const handleRoomCreated = () => {
    setIsDialogOpen(false);
    // Rafraîchir la liste des rooms
    fetchRooms();
  };

  const handleDeleteRoom = async (roomId) => {
    await rooms.deleteRoom(roomId);
    fetchRooms();
  };

  return (
    <div>
      <div className="flex gap-4">
        <h1 className="text-2xl font-bold">Créer une room :</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>Nouvelle room</DialogTitle>
            <RoomCreate onSuccess={handleRoomCreated} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-3 gap-2 p-10">
        {roomList &&
          roomList.map((room) => (
            <div
              key={room.$id}
              className="bg-muted rounded-md p-4 flex flex-col gap-4 justify-between"
            >
              <div className="flex flex-row justify-between">
                <div className="grow">
                  <div className="text-lg font-bold">{room.name}</div>
                  <div className="font-bold text-sm text-muted-foreground">
                    {room.playerIds.length}/{room.maxPlayers} joueurs
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className={
                    "hover:border-input hover:bg-muted hover:text-destructive border-1 px-2"
                  }
                  onClick={() => handleDeleteRoom(room.$id)}
                >
                  <span>
                    <X className="aspect-square" />
                  </span>
                </Button>
              </div>
              <div className="flex flex-row justify-between items-center gap-2">
                <Button asChild className={"grow"}>
                  <Link to={`/rooms/${room.$id}`}>
                    <span className="text-sm">Join</span>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
