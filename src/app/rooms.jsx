import React, { useState, useEffect } from "react";
import { rooms } from "@/lib/functions/rooms";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
export const Rooms = () => {
  const [roomList, setRoomList] = useState([]);
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await rooms.listRooms();
      setRoomList(response.rows);
    };
    fetchRooms();
  }, []);
  return (
    <div>
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
