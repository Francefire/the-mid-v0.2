import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Palette() {
  const brandColors = [
    { name: "Brand", class: "bg-brand", textClass: "text-brand-foreground", text: "Brand", tailwind: "bg-brand" },
    { name: "Brand Foreground", class: "bg-brand-foreground", textClass: "text-background", text: "Texte", tailwind: "text-brand-foreground" },
    { name: "Brand Muted", class: "bg-brand-muted", textClass: "text-background", text: "Muted", tailwind: "bg-brand-muted" },
  ];

  const backgroundColors = [
    { name: "Background", class: "bg-background", textClass: "text-foreground", text: "Background", tailwind: "bg-background" },
    { name: "Gradient Light", class: "bg-gradient-light", textClass: "text-foreground", text: "Light", tailwind: "from-gradient-light" },
    { name: "Gradient Dark", class: "bg-gradient-dark", textClass: "text-foreground", text: "Dark", tailwind: "to-gradient-dark" },
  ];

  const surfaceColors = [
    { name: "Card", class: "bg-card", textClass: "text-card-foreground", text: "Card", tailwind: "bg-card" },
    { name: "Card Foreground", class: "bg-card-foreground", textClass: "text-card", text: "Texte", tailwind: "text-card-foreground" },
    { name: "Foreground", class: "bg-foreground", textClass: "text-background", text: "Foreground", tailwind: "text-foreground" },
    { name: "Muted Foreground", class: "bg-muted-foreground", textClass: "text-background", text: "Muted", tailwind: "text-muted-foreground" },
  ];

  const borderColors = [
    { name: "Border", class: "bg-border", textClass: "text-foreground", text: "Border", tailwind: "border-border" },
    { name: "Input", class: "bg-input", textClass: "text-foreground", text: "Input", tailwind: "border-input" },
    { name: "Ring", class: "bg-ring", textClass: "text-background", text: "Ring", tailwind: "ring-ring" },
  ];

  const semanticColors = [
    { name: "Primary", class: "bg-primary", textClass: "text-primary-foreground", text: "Primary", tailwind: "bg-primary" },
    { name: "Secondary", class: "bg-secondary", textClass: "text-secondary-foreground", text: "Secondary", tailwind: "bg-secondary" },
    { name: "Accent", class: "bg-accent", textClass: "text-accent-foreground", text: "Accent", tailwind: "bg-accent" },
    { name: "Muted", class: "bg-muted", textClass: "text-muted-foreground", text: "Muted", tailwind: "bg-muted" },
    { name: "Destructive", class: "bg-destructive", textClass: "text-foreground", text: "Destructive", tailwind: "bg-destructive" },
  ];

  const sidebarColors = [
    { name: "Sidebar", class: "bg-sidebar", textClass: "text-sidebar-foreground", text: "Sidebar", tailwind: "bg-sidebar" },
    { name: "Sidebar Primary", class: "bg-sidebar-primary", textClass: "text-sidebar-primary-foreground", text: "Primary", tailwind: "bg-sidebar-primary" },
    { name: "Sidebar Accent", class: "bg-sidebar-accent", textClass: "text-sidebar-accent-foreground", text: "Accent", tailwind: "bg-sidebar-accent" },
  ];

  const ColorCard = ({ name, colorClass, textClass, text, tailwind }) => (
    <div className="flex flex-col gap-2">
      <div className={`${colorClass} h-24 rounded-lg border border-border transition-transform hover:scale-105 relative`}>
        <span className={`${textClass} absolute bottom-2 right-2 text-xs opacity-50 font-bold`}>
          {text}
        </span>
      </div>
      <div className="text-sm">
        <div className="font-semibold text-foreground">{name}</div>
        <code className="text-xs text-brand bg-card px-2 py-1 rounded">{tailwind}</code>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-brand mb-2">🎨 Palette de couleurs</h1>
        <p className="text-muted-foreground">Système de design de The Mind avec Tailwind CSS</p>
      </div>

      {/* Gradient Demo */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-gradient-light via-background to-gradient-light h-48 flex items-center justify-center">
          <h2 className="text-4xl font-bold text-foreground drop-shadow-lg">Dégradé principal</h2>
        </div>
        <CardContent className="pt-4">
          <code className="text-sm text-brand">
            bg-gradient-to-br from-gradient-light via-background to-gradient-light
          </code>
        </CardContent>
      </Card>

      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand">🔥 Couleurs de marque</CardTitle>
          <CardDescription>Orange signature pour les actions principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brandColors.map((color) => (
              <ColorCard
                key={color.name}
                name={color.name}
                colorClass={color.class}
                textClass={color.textClass}
                text={color.text}
                tailwind={color.tailwind}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Background Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand">🌌 Couleurs de fond</CardTitle>
          <CardDescription>Bleu nuit et variantes pour les dégradés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {backgroundColors.map((color) => (
              <ColorCard
                key={color.name}
                name={color.name}
                colorClass={color.class}
                textClass={color.textClass}
                text={color.text}
                tailwind={color.tailwind}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Surface Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand">📄 Couleurs de surface</CardTitle>
          <CardDescription>Cartes, textes et surfaces élevées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {surfaceColors.map((color) => (
              <ColorCard
                key={color.name}
                name={color.name}
                colorClass={color.class}
                textClass={color.textClass}
                text={color.text}
                tailwind={color.tailwind}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Border Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand">🔲 Bordures & Focus</CardTitle>
          <CardDescription>Bordures, inputs et anneaux de focus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {borderColors.map((color) => (
              <ColorCard
                key={color.name}
                name={color.name}
                colorClass={color.class}
                textClass={color.textClass}
                text={color.text}
                tailwind={color.tailwind}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Semantic Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand">🎯 Couleurs sémantiques</CardTitle>
          <CardDescription>États et actions contextuelles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {semanticColors.map((color) => (
              <ColorCard
                key={color.name}
                name={color.name}
                colorClass={color.class}
                textClass={color.textClass}
                text={color.text}
                tailwind={color.tailwind}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand">🧭 Couleurs de navigation</CardTitle>
          <CardDescription>Sidebar et éléments de navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sidebarColors.map((color) => (
              <ColorCard
                key={color.name}
                name={color.name}
                colorClass={color.class}
                textClass={color.textClass}
                text={color.text}
                tailwind={color.tailwind}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand">✨ Exemples d'utilisation</CardTitle>
          <CardDescription>Composants utilisant les couleurs du thème</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Boutons</h3>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
                Bouton Principal
              </Button>
              <Button variant="secondary">
                Bouton Secondaire
              </Button>
              <Button variant="destructive">
                Supprimer
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-brand-muted text-background">Badge 1</Badge>
              <Badge className="bg-brand-muted text-background">Badge 2</Badge>
              <Badge className="bg-brand-muted text-background">Badge 3</Badge>
            </div>
          </div>

          {/* Text Hierarchy */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Hiérarchie de texte</h3>
            <div className="space-y-2">
              <p className="text-foreground text-lg font-semibold">Texte principal (foreground)</p>
              <p className="text-brand text-base font-semibold">Texte accentué (brand)</p>
              <p className="text-muted-foreground text-sm">Texte secondaire (muted-foreground)</p>
            </div>
          </div>

          {/* Card Example */}
          <div className="bg-background p-4 rounded-2xl">
            <h3 className="font-semibold text-foreground mb-3">Carte exemple</h3>
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Titre de la carte</CardTitle>
                <CardDescription>
                  Une description avec text-muted-foreground
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-3">
                  Contenu de la carte avec les couleurs du thème.
                </p>
                <Button className="bg-brand text-brand-foreground hover:bg-brand/90 w-full">
                  Action
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Focus & Borders */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Focus & Bordures</h3>
            <div className="space-y-3">
              <div className="p-4 border-2 border-border rounded-lg">
                <p className="text-foreground">Élément avec bordure (border-border)</p>
              </div>
              <Input className="px-4 py-2 bg-card border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder="Input avec focus (ring-ring)">
              </Input>
            </div>
          </div>

          {/* Gradient Backgrounds */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Fonds avec dégradés</h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-gradient-light to-gradient-dark p-6 rounded-lg">
                <p className="text-foreground font-semibold">Dégradé horizontal</p>
                <code className="text-xs text-brand-muted">from-gradient-light to-gradient-dark</code>
              </div>
              <div className="bg-gradient-to-br from-background via-gradient-light to-background p-6 rounded-lg">
                <p className="text-foreground font-semibold">Dégradé diagonal avec via</p>
                <code className="text-xs text-brand-muted">from-background via-gradient-light to-background</code>
              </div>
            </div>
          </div>

          {/* States */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">États interactifs</h3>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer">
                <span className="text-secondary-foreground">Hover secondaire</span>
              </div>
              <div className="px-4 py-2 bg-brand rounded-lg hover:bg-brand/90 transition-colors cursor-pointer">
                <span className="text-brand-foreground">Hover brand</span>
              </div>
              <div className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                <span className="text-muted-foreground">Hover muted</span>
              </div>
            </div>
          </div>

          {/* Sidebar Preview */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Navigation (Sidebar)</h3>
            <div className="bg-sidebar border border-sidebar-border rounded-lg p-4 max-w-xs">
              <div className="space-y-2">
                <div className="px-3 py-2 bg-sidebar-primary rounded-md">
                  <span className="text-sidebar-primary-foreground font-medium">Élément actif</span>
                </div>
                <div className="px-3 py-2 hover:bg-sidebar-accent rounded-md transition-colors cursor-pointer">
                  <span className="text-sidebar-foreground">Élément normal</span>
                </div>
                <div className="px-3 py-2 hover:bg-sidebar-accent rounded-md transition-colors cursor-pointer">
                  <span className="text-sidebar-foreground">Élément normal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts/Messages */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Messages & Alertes</h3>
            <div className="space-y-3">
              <div className="bg-card border-l-4 border-brand p-4 rounded">
                <p className="text-card-foreground font-semibold mb-1">Information</p>
                <p className="text-muted-foreground text-sm">Message avec accent brand</p>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded">
                <p className="text-destructive font-semibold mb-1">Erreur</p>
                <p className="text-muted-foreground text-sm">Message d'erreur avec couleur destructive</p>
              </div>
              <div className="bg-brand-muted/20 border border-brand-muted p-4 rounded">
                <p className="text-foreground font-semibold mb-1">Succès</p>
                <p className="text-muted-foreground text-sm">Message de succès avec brand-muted</p>
              </div>
            </div>
          </div>

          {/* Complex Card Layout */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Disposition complexe</h3>
            <Card className="max-w-2xl">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-brand">Projet The Mind</CardTitle>
                    <CardDescription>Créé le 2 novembre 2025</CardDescription>
                  </div>
                  <Badge className="bg-brand-muted text-background">Actif</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Joueurs</p>
                    <p className="text-foreground text-2xl font-bold">4</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Niveau</p>
                    <p className="text-foreground text-2xl font-bold">8</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-brand text-brand-foreground hover:bg-brand/90 flex-1">
                    Rejoindre
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    Partager
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
