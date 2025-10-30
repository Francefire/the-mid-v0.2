import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { rooms } from "@/lib/functions/rooms";
import { game } from "@/lib/functions/game";
import { profile } from "@/lib/functions/profile";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { client } from "@/lib/appwrite";

export const Room = () => {
  const { id } = useParams();
  const [hand, setHand] = useState({});
  const [lastRoomPlayedCard, setLastRoomPlayedCard] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isStarting, setIsStarting] = useState(false);
  const { user } = useAuth();

  // Rejoindre automatiquement la room lors du chargement
  useEffect(() => {
    const joinRoomOnLoad = async () => {
      try {
        await rooms.joinRoom(id, user.$id);
      } catch (error) {
        console.error("Erreur lors de la connexion à la room:", error);
      }
    };
    
    joinRoomOnLoad();
  }, [id, user.$id]);

  // Fonction pour charger les informations des joueurs
  const loadPlayers = async (playerIds) => {
    if (!playerIds || playerIds.length === 0) return;
    
    try {
      const playerProfiles = await Promise.all(
        playerIds.map(async (playerId) => {
          try {
            const profileData = await profile.getProfile(playerId);
            return profileData || { $id: playerId, firstName: "Joueur", lastName: "" };
          } catch {
            return { $id: playerId, firstName: "Joueur", lastName: "" };
          }
        })
      );
      setPlayers(playerProfiles);
    } catch (error) {
      console.error("Erreur lors du chargement des joueurs:", error);
    }
  };

  // Démarrer la partie
  const handleStartGame = async () => {
    if (!roomData || roomData.gameStatus !== "waiting") return;
    
    setIsStarting(true);
    try {
      await game.initializeGame(id, roomData.playerIds);
      // Les données seront mises à jour via la subscription
    } catch (error) {
      console.error("Erreur lors du démarrage de la partie:", error);
      alert("Erreur lors du démarrage de la partie");
    } finally {
      setIsStarting(false);
    }
  };

  // Jouer une carte
  function updateHand(card) {
    setHand((prev) => {
      const newHand = { ...prev, cards: prev.cards.filter((c) => c !== card) };
      rooms.playCard(hand.$id, newHand, card, id);
      
      // Vérifier si le niveau est terminé après avoir joué
      setTimeout(() => {
        game.checkLevelCompletion(id);
      }, 500);
      
      return newHand;
    });
  }

  useEffect(() => {
    // Charger la main du joueur
    rooms.getHand(id, user.$id).then((response) => {
      if (response.rows && response.rows.length > 0) {
        setHand(response.rows[0]);
      }
    });

    // Charger les infos de la room
    rooms.getRoom(id).then((response) => {
      if (response.rows && response.rows.length > 0) {
        const room = response.rows[0];
        setRoomData(room);
        setLastRoomPlayedCard(room.lastPlayed);
        loadPlayers(room.playerIds);
      }
    });

    // S'abonner aux changements de la room
    const unsub = client.subscribe(
      [
        `databases.${
          import.meta.env.VITE_APPWRITE_DB_ID
        }.tables.rooms.rows.${id}`,
      ],
      (response) => {
        const updatedRoom = response.payload;
        setRoomData(updatedRoom);
        setLastRoomPlayedCard(updatedRoom.lastPlayed);
        if (updatedRoom.playerIds) {
          loadPlayers(updatedRoom.playerIds);
        }
      }
    );

    // S'abonner aux changements des mains pour recharger automatiquement
    const unsubHands = client.subscribe(
      [
        `databases.${
          import.meta.env.VITE_APPWRITE_DB_ID
        }.tables.hands.rows`,
      ],
      (response) => {
        // Recharger la main si c'est celle du joueur actuel
        if (response.payload.userId === user.$id && response.payload.roomId === id) {
          setHand(response.payload);
        }
      }
    );

    return () => {
      unsub();
      unsubHands();
    };
  }, [id, user.$id]);

  const isCreator = roomData && roomData.creatorId === user.$id;
  const canStartGame = isCreator && roomData?.gameStatus === "waiting" && players.length >= 2;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* En-tête de la room */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{roomData?.name || "Chargement..."}</span>
            <div className="flex gap-2">
              {roomData?.gameStatus === "waiting" && (
                <Badge variant="secondary">En attente</Badge>
              )}
              {roomData?.gameStatus === "playing" && (
                <Badge variant="default">En cours</Badge>
              )}
              {roomData?.gameStatus === "won" && (
                <Badge variant="success" className="bg-green-600">Gagné !</Badge>
              )}
              {roomData?.gameStatus === "lost" && (
                <Badge variant="destructive">Perdu</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Informations du jeu */}
            {roomData?.gameStatus === "playing" && (
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-semibold">Niveau:</span>{" "}
                  <Badge>{roomData.currentLevel}/12</Badge>
                </div>
                <div>
                  <span className="font-semibold">Vies:</span>{" "}
                  <Badge variant="destructive">❤️ {roomData.livesRemaining}</Badge>
                </div>
                <div>
                  <span className="font-semibold">Étoiles:</span>{" "}
                  <Badge variant="secondary">⭐ {roomData.throwingStars}</Badge>
                </div>
              </div>
            )}

            {/* Liste des joueurs */}
            <div>
              <h3 className="font-semibold mb-2">
                Joueurs ({players.length}/{roomData?.maxPlayers})
              </h3>
              <div className="flex flex-wrap gap-2">
                {players.map((player) => (
                  <Badge key={player.$id} variant="outline">
                    {player.firstName} {player.lastName}
                    {player.$id === roomData?.creatorId && " 👑"}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Bouton démarrer */}
            {canStartGame && (
              <Button
                onClick={handleStartGame}
                disabled={isStarting}
                className="w-full"
                size="lg"
              >
                {isStarting ? "Démarrage..." : "🎮 Démarrer la partie"}
              </Button>
            )}

            {roomData?.gameStatus === "waiting" && !isCreator && (
              <p className="text-sm text-muted-foreground text-center">
                En attente que l'hôte démarre la partie...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Zone de jeu */}
      {roomData?.gameStatus === "playing" && (
        <>
          <Separator />

          {/* Dernière carte jouée */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dernière carte jouée</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {lastRoomPlayedCard ? (
                  <div className="inline-flex items-center justify-center w-20 h-28 bg-primary text-primary-foreground rounded-lg text-3xl font-bold shadow-lg">
                    {lastRoomPlayedCard}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune carte jouée</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main du joueur */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ma main ({hand?.cards?.length || 0} cartes)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 justify-center">
                {hand?.cards && hand.cards.length > 0 ? (
                  hand.cards
                    .sort((a, b) => a - b)
                    .map((card, index) => (
                      <Button
                        key={index}
                        onClick={() => updateHand(card)}
                        className="w-16 h-24 text-2xl font-bold"
                        variant="outline"
                      >
                        {card}
                      </Button>
                    ))
                ) : (
                  <p className="text-muted-foreground">Aucune carte en main</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Message de victoire/défaite */}
      {roomData?.gameStatus === "won" && (
        <Card className="border-green-600">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-center text-green-600">
              🎉 Félicitations ! Vous avez gagné ! 🎉
            </h2>
          </CardContent>
        </Card>
      )}

      {roomData?.gameStatus === "lost" && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-center text-destructive">
              💔 Partie terminée - Vous avez perdu
            </h2>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
