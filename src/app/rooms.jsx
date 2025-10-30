import React, { useState, useEffect } from "react";
import { rooms } from "@/lib/functions/rooms";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
      <div>
        <h1 className="text-2xl font-bold p-10">Create a room :</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <span className="text-sm">Create Room</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <RoomCreate onSuccess={handleRoomCreated} />
          </DialogContent>
        </Dialog>

      </div>
      <div className="grid grid-cols-3 gap-2 p-10">
        {roomList.map((room) => (
          <div
            key={room.$id}
            className="bg-gray-100 rounded-md p-2 flex flex-col gap-2 justify-between"
          >
            <div className="text-lg font-bold">{room.name}</div>
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
