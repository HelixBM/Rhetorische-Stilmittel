﻿const STILMITTEL = [
  {
    name: "Allegorie",
    definition: "Erweiterte Metapher: Ein abstrakter Begriff wird über einen längeren Textabschnitt hinweg durch ein konkretes Bild dargestellt, oft als Personifikation.",
    examples: [
      "\"Justitia\" – Frauenfigur mit Waage und Schwert steht für Gerechtigkeit",
      "\"Sensenmann\" – Figur mit Sense steht für den Tod",
      "\"Fortuna\" – das Glücksrad als Bild für das wechselhafte Schicksal",
      "\"Platons Höhlengleichnis\" – die Höhle steht für die Welt der Täuschung"
    ]
  },
  {
    name: "Alliteration",
    definition: "Gleicher Anfangslaut bei zwei oder mehr aufeinanderfolgenden Wörtern.",
    examples: [
      "\"Milch macht müde Männer munter.\"",
      "\"Kind und Kegel\"",
      "\"Wind und Wetter\"",
      "\"Über Stock und Stein\"",
      "\"Mit Mann und Maus\""
    ]
  },
  {
    name: "Anapher",
    definition: "Wiederholung desselben Wortes oder derselben Wortgruppe am Anfang aufeinanderfolgender Sätze oder Verse.",
    examples: [
      "\"Ich bin müde. Ich bin erschöpft. Ich bin am Ende.\"",
      "\"Das Wasser rauscht'. Das Wasser schwoll.\"",
      "\"Wer nie sein Brot mit Tränen aß, / Wer nie die kummervollen Nächte…\"",
      "\"Er rannte los. Er rannte schnell. Er rannte um sein Leben.\""
    ]
  },
  {
    name: "Anglizismus",
    definition: "Verwendung eines englischen Wortes oder Ausdrucks in einem deutschsprachigen Text.",
    examples: [
      "\"Das Meeting wurde gecancelt.\"",
      "\"Wir brauchen mehr Content für die Website.\"",
      "\"Das war ein absoluter Gamechanger.\"",
      "\"Ich muss das noch downloaden.\"",
      "\"Sie hat ein gutes Standing in der Firma.\""
    ]
  },
  {
    name: "Antiklimax",
    definition: "Stufenweise Abstufung vom Starken zum Schwachen – das Gegenteil der Klimax.",
    examples: [
      "\"Könige, Fürsten, Grafen, Ritter, Edelleute, Bürger, Bauern.\"",
      "\"Er war ein großer Feldherr, ein guter Soldat, ein brauchbarer Mann.\"",
      "\"Ich kam, ich sah, ich ging wieder.\"",
      "\"Er war wütend, verärgert, leicht genervt.\""
    ]
  },
  {
    name: "Antithese",
    definition: "Gegenüberstellung von gegensätzlichen Begriffen oder Gedanken.",
    examples: [
      "\"Der Wahn ist kurz, die Reu ist lang.\"",
      "\"Der Geist ist willig, aber das Fleisch ist schwach.\"",
      "\"Krieg und Frieden\"",
      "\"Himmel und Hölle\"",
      "\"Jung und Alt, Arm und Reich\""
    ]
  },
  {
    name: "Asyndeton",
    definition: "Aufzählung ohne Bindewörter (Konjunktionen) – die Begriffe stehen nur durch Kommata getrennt.",
    examples: [
      "\"Alles rennet, rettet, flüchtet.\"",
      "\"Er kam, sah, siegte.\"",
      "\"Heute, morgen, übermorgen.\"",
      "\"Friede, Freude, Eierkuchen.\""
    ]
  },
  {
    name: "Chiasmus",
    definition: "Überkreuzstellung: Zwei aufeinanderfolgende Satzteile sind syntaktisch spiegelbildlich aufgebaut (AB – BA).",
    examples: [
      "\"Die Kunst ist lang, und kurz ist unser Leben.\"",
      "\"Ich schlafe am Tag, in der Nacht wache ich.\"",
      "\"Eng ist die Welt und das Gehirn ist weit.\"",
      "\"Sie ist bescheiden, gierig bist du.\""
    ]
  },
  {
    name: "Chiffre",
    definition: "Rätselhaftes, verschlüsseltes Bild, das sich nur aus dem Werk oder Gesamtwerk der Autorin/des Autors erschließen lässt.",
    examples: [
      "\"blaues Klavier\" (Else Lasker-Schüler)",
      "\"schwarze Milch der Frühe\" (Paul Celan, Todesfuge)",
      "\"die Windsbraut\" (Georg Trakl)",
      "\"Der Panther\" als Chiffre für Gefangenschaft (Rilke)"
    ]
  },
  {
    name: "Ellipse",
    definition: "Auslassung eines Satzteils, der zum Verständnis nicht zwingend nötig ist. Der Satz ist grammatisch unvollständig.",
    examples: [
      "\"Je früher, desto besser.\"",
      "\"Ende gut, alles gut.\"",
      "\"Was nun?\"",
      "\"Erst die Arbeit, dann das Vergnügen.\"",
      "\"Du vielleicht, ich sicher nicht.\""
    ]
  },
  {
    name: "Emphase",
    definition: "Hervorhebung eines Wortes durch besondere Betonung, sodass es einen tieferen oder stärkeren Sinn bekommt.",
    examples: [
      "\"Das ist ein MENSCH!\" (im Sinne von: ein besonderer Mensch)",
      "\"DAS nenne ich Kunst!\"",
      "\"Ach du meine Güte!\"",
      "\"Jetzt ist SCHLUSS!\""
    ]
  },
  {
    name: "Enjambement",
    definition: "Zeilensprung in der Lyrik: Ein Satz oder Satzteil wird über das Versende hinaus in die nächste Zeile fortgeführt.",
    examples: [
      "\"Der Nebel drückt / die Dächer schwer…\"",
      "\"Ich ging im Feld / und sah die Blumen stehen.\"",
      "\"Am Brunnen vor / dem Tore…\"",
      "\"Und es wallet und siedet / und brauset und zischt.\""
    ]
  },
  {
    name: "Enumeration",
    definition: "Aufzählung mehrerer Begriffe, um einen Oberbegriff zu veranschaulichen oder eine Aussage zu verstärken.",
    examples: [
      "\"Nun ruhen alle Wälder, / Vieh, Menschen, Städt und Felder.\"",
      "\"Sonne, Mond und Sterne\"",
      "\"Feld, Wald und Wiese\"",
      "\"Feuer, Wasser, Erde, Luft\"",
      "\"Alte und Junge, Dumme und Gescheite, Arme und Reiche sind betroffen.\""
    ]
  },
  {
    name: "Epipher",
    definition: "Wiederholung desselben Wortes am Ende aufeinanderfolgender Sätze oder Verse (Gegenteil der Anapher).",
    examples: [
      "\"Er schreibt nicht. Er liest nicht. Er lernt nicht.\"",
      "\"Doch alle Lust will Ewigkeit, / will tiefe, tiefe Ewigkeit.\"",
      "\"Ich bin glücklich, wir alle sind glücklich.\"",
      "\"Er kopiert nicht. Er liest nicht.\""
    ]
  },
  {
    name: "Euphemismus",
    definition: "Beschönigende oder verharmlosende Umschreibung für etwas Unangenehmes.",
    examples: [
      "\"Er ist von uns gegangen.\" (statt: Er ist gestorben.)",
      "\"Freisetzung von Mitarbeitern\" (statt: Entlassung)",
      "\"Seniorenresidenz\" (statt: Altenheim)",
      "\"Ewiger Schlaf\" (statt: Tod)",
      "\"Kollateralschaden\" (statt: zivile Opfer)"
    ]
  },
  {
    name: "Hendiadyoin",
    definition: "Doppelausdruck: Zwei bedeutungsähnliche Wörter werden mit \"und\" verbunden, um einen einzigen Begriff zu verstärken.",
    examples: [
      "\"Angst und Bange\"",
      "\"Grund und Boden\"",
      "\"Art und Weise\"",
      "\"Hilfe und Beistand\"",
      "\"Rat und Tat\""
    ]
  },
  {
    name: "Hyperbel",
    definition: "Starke Übertreibung eines Ausdrucks, um eine besondere Wirkung zu erzielen.",
    examples: [
      "\"Ich habe dir das schon tausendmal gesagt!\"",
      "\"Ein Meer von Tränen\"",
      "\"Todmüde sein\"",
      "\"Blitzschnell\"",
      "\"Das dauert ja eine Ewigkeit!\"",
      "\"Ich sterbe vor Hunger!\""
    ]
  },
  {
    name: "Inversion",
    definition: "Umkehrung der üblichen Wortstellung im Satz, z. B. das Verb oder Objekt wird vorangestellt.",
    examples: [
      "\"Gering war unser Auskommen.\"",
      "\"Schlimm ist diese Lage.\"",
      "\"Müde bin ich, geh zur Ruh.\"",
      "\"Natürlich mag sie verwelkte Blumen.\""
    ]
  },
  {
    name: "Ironie",
    definition: "Man sagt das Gegenteil von dem, was man meint – die wahre Bedeutung ergibt sich aus dem Zusammenhang.",
    examples: [
      "\"Das hast du ja toll hinbekommen!\" (bei einem Fehler)",
      "\"Na, das ist ja eine schöne Bescherung!\"",
      "\"Schönes Wetter heute!\" (bei Regen)",
      "\"Danke für die pünktliche Lieferung!\" (nach wochenlanger Verspätung)"
    ]
  },
  {
    name: "Klimax",
    definition: "Stufenweise Steigerung von Ausdrücken – vom Schwachen zum Starken.",
    examples: [
      "\"Ich kam, sah und siegte.\"",
      "\"Ich bin erstaunt, erschrocken, entsetzt!\"",
      "\"Er war unzufrieden, wütend, rasend.\"",
      "\"Heute back ich, morgen brau ich, übermorgen hol ich der Königin ihr Kind.\""
    ]
  },
  {
    name: "Litotes",
    definition: "Untertreibung oder Verneinung des Gegenteils, um etwas hervorzuheben.",
    examples: [
      "\"Das war nicht schlecht.\" (= Es war gut.)",
      "\"Nicht übel!\" (= Sehr gut!)",
      "\"Sie ist nicht unhübsch.\"",
      "\"Er ist nicht gerade ein Genie.\"",
      "\"Sie ist nicht das hellste Licht auf dem Geburtstagskuchen.\""
    ]
  },
  {
    name: "Metapher",
    definition: "Übertragung eines Bildes aus einem Bedeutungsbereich in einen anderen, ohne Vergleichswort (\"wie\").",
    examples: [
      "\"Das Feuer der Leidenschaft\"",
      "\"Jemandem das Herz brechen\"",
      "\"Der Zahn der Zeit\"",
      "\"Rabeneltern\"",
      "\"Am Fuße des Berges\"",
      "\"Wüstenschiff\" (= Kamel)"
    ]
  },
  {
    name: "Metonymie",
    definition: "Ersetzung eines Begriffs durch einen anderen, der in sachlicher (nicht bildlicher) Beziehung zu ihm steht.",
    examples: [
      "\"Das Weiße Haus erklärte…\" (statt: der Präsident)",
      "\"Ich lese Goethe.\" (statt: ein Werk von Goethe)",
      "\"Er trinkt gern ein Glas.\" (statt: den Inhalt)",
      "\"Berlin hat entschieden.\" (statt: die Regierung)",
      "\"Wir leben alle unter einem Dach.\""
    ]
  },
  {
    name: "Neologismus",
    definition: "Wortneuschöpfung – ein neu gebildetes Wort, das es so vorher nicht gab.",
    examples: [
      "\"Smombie\" (Smartphone + Zombie)",
      "\"Fremdschämen\"",
      "\"Wutbürger\"",
      "\"Digitalnomade\"",
      "\"Chillen\""
    ]
  },
  {
    name: "Onomatopoesie",
    definition: "Lautmalerei: Wörter, die den Klang oder das Geräusch nachahmen, das sie bezeichnen.",
    examples: [
      "\"Die Bienen summen.\"",
      "\"Das Wasser plätschert.\"",
      "\"Es knistert im Kamin.\"",
      "\"Die Tür knarrt.\"",
      "\"Kuckuck, Miau, Kikeriki\""
    ]
  },
  {
    name: "Oxymoron",
    definition: "Verbindung zweier sich widersprechender Begriffe zu einer Einheit.",
    examples: [
      "\"Bittersüß\"",
      "\"Alter Knabe\"",
      "\"Offenes Geheimnis\"",
      "\"Beredtes Schweigen\"",
      "\"Hölzernes Eisen\"",
      "\"Kalte Glut\""
    ]
  },
  {
    name: "Paradoxon",
    definition: "Scheinbar widersprüchliche Aussage, die bei genauerem Nachdenken einen tieferen Sinn enthält.",
    examples: [
      "\"Weniger ist mehr.\"",
      "\"Ich weiß, dass ich nichts weiß.\"",
      "\"Das Gesetz ist das Kleid der Freiheit.\"",
      "\"Wer den Tod fürchtet, hat das Leben verloren.\""
    ]
  },
  {
    name: "Parallelismus",
    definition: "Wiederholung der gleichen syntaktischen Struktur in aufeinanderfolgenden Sätzen oder Satzteilen.",
    examples: [
      "\"Heiß ist die Liebe, kalt ist der Schnee.\"",
      "\"Der Vater lacht, die Mutter weint.\"",
      "\"Reden ist Silber, Schweigen ist Gold.\"",
      "\"Kleine Kinder, kleine Sorgen – große Kinder, große Sorgen.\""
    ]
  },
  {
    name: "Personifikation",
    definition: "Vermenschlichung: Tieren, Gegenständen oder abstrakten Begriffen werden menschliche Eigenschaften zugeschrieben.",
    examples: [
      "\"Die Sonne lacht.\"",
      "\"Der Wind flüstert.\"",
      "\"Die Zeit heilt alle Wunden.\"",
      "\"Der Tod klopft an die Tür.\"",
      "\"Mutter Natur\""
    ]
  },
  {
    name: "Polysyndeton",
    definition: "Aufzählung, bei der die Glieder durch die wiederholte gleiche Konjunktion verbunden sind.",
    examples: [
      "\"Und es wallet und siedet und brauset und zischt.\"",
      "\"Und der Regen fällt und der Wind weht und die Blätter treiben.\"",
      "\"Das bringt nichts als Hunger und Tod und Verderben.\"",
      "\"Oder heute oder morgen oder übermorgen.\""
    ]
  },
  {
    name: "Rhetorische Frage",
    definition: "Eine Frage, auf die keine Antwort erwartet wird, weil die Antwort offensichtlich ist.",
    examples: [
      "\"Bin ich denn der Einzige, der hier arbeitet?\"",
      "\"Haben wir nicht alle schon mal einen Fehler gemacht?\"",
      "\"Wer will das schon?\"",
      "\"Sind wir nicht alle ein bisschen Weltmeister?\""
    ]
  },
  {
    name: "Symbol",
    definition: "Ein konkreter Gegenstand, der für eine allgemein bekannte abstrakte Idee steht.",
    examples: [
      "Taube = Frieden",
      "Herz = Liebe",
      "Wasser = Leben, Reinigung",
      "Kreuz = Christentum, Opfer",
      "Krone = Macht, Herrschaft"
    ]
  },
  {
    name: "Synästhesie",
    definition: "Verknüpfung von Sinneswahrnehmungen aus verschiedenen Bereichen (z. B. Hören + Sehen).",
    examples: [
      "\"Süß klingende Glocken\"",
      "\"Schreiendes Rot\"",
      "\"Warme Farben\"",
      "\"Helle und dunkle Töne\"",
      "\"Weicher Klang\""
    ]
  },
  {
    name: "Tautologie",
    definition: "Wiederholung desselben Sachverhalts mit bedeutungsgleichen oder sinnverwandten Wörtern.",
    examples: [
      "\"Immer und ewig\"",
      "\"Voll und ganz\"",
      "\"Nie und nimmer\"",
      "\"Angst und Bange\"",
      "\"Hegen und pflegen\""
    ]
  },
  {
    name: "Trias",
    definition: "Dreigliedrige Aufzählung – drei Begriffe oder Satzteile werden aneinandergereiht.",
    examples: [
      "\"Freiheit, Gleichheit, Brüderlichkeit\"",
      "\"Blut, Schweiß und Tränen\"",
      "\"Er geht über Tische, Stühle und Bänke.\"",
      "\"Guten Morgen, guten Tag, gute Nacht.\""
    ]
  },
  {
    name: "Vergleich",
    definition: "Verknüpfung zweier Bereiche durch ein Vergleichswort: \"wie\" oder \"als ob\".",
    examples: [
      "\"Stark wie ein Löwe\"",
      "\"Schnell wie der Wind\"",
      "\"Sie ist schön wie eine Rose.\"",
      "\"Kalt wie Eis\"",
      "\"Als ob ihm das Ereignis nichts ausmache.\""
    ]
  },
  {
    name: "Wiederholung",
    definition: "Mehrfache Nennung desselben Wortes oder derselben Wendung zur Verstärkung.",
    examples: [
      "\"O Freunde, nicht diese Töne!\"",
      "\"Ein Meer von Tränen, ein Meer von Schmerz.\"",
      "\"Nein, nein, nein!\"",
      "\"Ich habe es dir schon tausendmal gesagt, tausendmal!\""
    ]
  },
  {
    name: "Zeugma",
    definition: "Ein Verb wird auf mehrere Satzglieder bezogen, passt aber nur zu einem davon wirklich sinnvoll.",
    examples: [
      "\"Nimm dir Zeit und nicht das Leben!\"",
      "\"Er schlug die Scheibe und danach den Heimweg ein.\"",
      "\"Ich hob den Blick und eine Tasche auf.\"",
      "\"Er verlor seinen Hut und die Geduld.\""
    ]
  },
];
