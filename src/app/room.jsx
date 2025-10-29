import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { rooms } from "@/lib/functions/rooms";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/appwrite";

export const Room = () => {
  const { id } = useParams();
  const [hand, setHand] = useState({});
  const [lastRoomPlayedCard, setLastRoomPlayedCard] = useState(null);
  const { user } = useAuth();

  function updateHand(card) {
    setHand((prev) => {
      const newHand = { ...prev, cards: prev.cards.filter((c) => c !== card) };
      rooms.playCard(hand.$id, newHand, card, id);
      return newHand;
    });
  }

  useEffect(() => {
    rooms.getHand(id, user.$id).then((response) => {
      setHand(response.rows[0]);
    });

    rooms.getRoom(id).then((response) => {
      console.log(response.rows[0]);
      setLastRoomPlayedCard(response.rows[0].lastPlayed);
    });

    const unsub = client.subscribe(
      [
        `databases.${
          import.meta.env.VITE_APPWRITE_DB_ID
        }.tables.rooms.rows.${id}`,
      ],
      (response) => {
        setLastRoomPlayedCard(response.payload.lastPlayed);
      }
    );
    return () => unsub();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">My Hand:</h1>
      {hand?.cards?.map((card, index) => (
        <Button key={index} onClick={() => updateHand(card)}>
          {card}
        </Button>
      ))}
      <h1 className="text-2xl font-bold">Last Card Played:</h1>
      {lastRoomPlayedCard}
    </div>
  );
};
