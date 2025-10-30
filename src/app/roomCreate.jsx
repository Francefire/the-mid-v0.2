import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { rooms } from "@/lib/functions/rooms";
import { useAuth } from "@/context/authContext";
import { ID } from "appwrite";

const RoomCreate = ({ onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.target);
      const roomName = formData.get("roomName");
      const maxPlayers = formData.get("maxPlayers");

      // Créer la room avec un ID unique
      const roomId = ID.unique();
      const newRoom = {
        $id: roomId,
        name: roomName,
        maxPlayers: parseInt(maxPlayers),
        creatorId: user.$id,
        gameStatus: "waiting",
        currentLevel: 1,
        playerIds: [user.$id], // Le créateur rejoint automatiquement
        livesRemaining: 0,
      };

      await rooms.createRoom(newRoom);
      
      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Failed to create room:", err);
      setError("Échec de la création de la room. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Créer une nouvelle room</CardTitle>
          <CardDescription>
            Configurez votre room de jeu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="roomName">Nom de la room</FieldLabel>
                <Input
                  id="roomName"
                  name="roomName"
                  type="text"
                  placeholder="Ma super room"
                  required
                  disabled={isLoading}
                />
                <FieldDescription>
                  Choisissez un nom pour votre room
                </FieldDescription>
              </Field>
              
              <Field>
                <FieldLabel htmlFor="maxPlayers">Nombre de joueurs maximum</FieldLabel>
                <Input
                  id="maxPlayers"
                  name="maxPlayers"
                  type="number"
                  min="2"
                  max="10"
                  defaultValue="4"
                  required
                  disabled={isLoading}
                />
                <FieldDescription>
                  Entre 2 et 10 joueurs
                </FieldDescription>
              </Field>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <Field>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Création..." : "Créer la room"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomCreate;