import { Card, CardContent } from "@/components/ui/card";

export default function Rules() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <Card className="flex-1 bg-gray-100">
        <CardContent className="bg-gray-100 text-black p-8 overflow-y-auto">
          <main className="flex flex-col items-start justify-start flex-1">
            <h1 className="text-4xl font-bold mb-6 text-orange-900">
              Les règles du jeu{" "}
              <span className="text-orange-700">The Mind</span>
            </h1>

            {/* === GAME INFO === */}
            <section className="flex flex-wrap gap-4 mb-8 text-sky-900 text-base font-medium">
              <div className="bg-orange-100 rounded px-3 py-1 shadow-sm">
                Langue : Français
              </div>
              <div className="bg-orange-100 rounded px-3 py-1 shadow-sm">
                2-4 joueurs
              </div>
              <div className="bg-orange-100 rounded px-3 py-1 shadow-sm">
                Durée ≈ 20 min
              </div>
              <div className="bg-orange-100 rounded px-3 py-1 shadow-sm">
                Âge 8+
              </div>
              <div className="bg-orange-100 rounded px-3 py-1 shadow-sm">
                Style : Déduction, Coopératif
              </div>
            </section>

            <section className="text-gray-800 leading-relaxed space-y-4 max-w-3xl">
              <p>
                <strong>The Mind</strong> se distingue par sa simplicité
                incroyablement addictive. Ce jeu a le don de captiver les
                joueurs avec ses mécanismes épurés et son gameplay intuitif.
              </p>
              <p>
                Cependant, la présentation des règles du jeu, bien que brève,
                laisse quelque peu à désirer. La feuille de règles, simplement
                pliée en deux, pourrait bénéficier d'une réduction et d'une
                simplification supplémentaires pour mieux refléter la nature
                directe et accessible du jeu.
              </p>
              <p>
                Malgré cette petite critique, il est important de noter que leur
                compréhension ne prendra que très peu de temps. En seulement
                deux minutes, les joueurs peuvent facilement les lire et saisir
                l'essence du jeu. Cette rapidité d'apprentissage permet aux
                joueurs de se lancer rapidement dans l'action et de profiter
                pleinement de l'expérience ludique que <em>"The Mind"</em>{" "}
                offre.
              </p>

              <h2 className="text-2xl font-semibold text-orange-800 mt-8">
                🎯 Comment ça se joue ?
              </h2>

              <h3 className="text-xl font-semibold text-orange-700 mt-4">
                Le but du jeu
              </h3>
              <p>
                Le jeu comporte 12 niveaux que vous devrez affronter en équipe.
                Chaque joueur reçoit un certain nombre de cartes numérotées au
                début de chaque niveau, sans pouvoir les montrer à ses
                coéquipiers.
              </p>
              <p>
                Le but : placer toutes les cartes au centre de l'écran dans un
                ordre croissant sans se parler ni communiquer !
              </p>
              <p>
                Vous devrez vous synchroniser et atteindre le 12ᵉ niveau du jeu.
                Si vous échouez, ce n’est pas grave — recommencez pour battre
                votre score précédent !
              </p>

              <h3 className="text-xl font-semibold text-orange-700 mt-6">
                Le tour de jeu
              </h3>
              <p>
                Au niveau 1, chaque joueur reçoit 1 carte (puis 2 au niveau 2,
                etc.). Plus le niveau est haut, plus la difficulté augmente.
              </p>
              <p>
                Le but est de poser les cartes dans l’ordre croissant. Dès qu’un
                joueur pense avoir la plus petite carte, il la pose face
                visible. Le niveau est gagné si toutes les cartes ont été posées
                correctement et qu’il vous reste des vies.
              </p>
              <p>
                Le silence est d’or ! Observez les autres joueurs et essayez de
                ressentir le bon moment pour jouer votre carte.
              </p>

              <h3 className="text-xl font-semibold text-orange-700 mt-6">
                Quand un niveau se termine ?
              </h3>
              <p>
                Lorsqu’il n’y a plus de cartes sur les écrans des joueurs.
                Prenez la récompense du niveau, puis commencez le suivant.
              </p>

              <h3 className="text-xl font-semibold text-orange-700 mt-6">
                Mince ! Je me suis trompé !
              </h3>
              <p>
                Si un joueur pose une carte dans le mauvais ordre, le jeu est
                interrompu. Vous perdez une vie, puis toutes les cartes de
                valeur plus basse sont écartées. Le niveau continue avec les
                cartes restantes.
              </p>

              <h3 className="text-xl font-semibold text-orange-700 mt-6">
                Et les Etoiles ?
              </h3>
              <p>
                Les Etoiles peuvent être utilisées si tous les joueurs sont
                d’accord (chacun accepte la notification). Ca affiche la carte
                la plus basse de chaque joueur, qui est ensuite écartée. Cela
                aide à débloquer des situations tendues.
              </p>

              <h3 className="text-xl font-semibold text-orange-700 mt-6">
                Fin du jeu
              </h3>
              <p>
                La partie se termine si vous n’avez plus de vies… ou si vous
                triomphez du dernier niveau !
              </p>
            </section>
          </main>
        </CardContent>
      </Card>
    </div>
  );
}
