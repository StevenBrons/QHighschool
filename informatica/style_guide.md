Plaats alle theorie/opdrachten in één bestand genaamd `syllabus.docx` wat zich op het hoogste niveau binnen de module bevind.
De overige mappenstructuur mag je naar eigen inzicht indelen maar:
    - Gebruik uniforme namen
    - Gebruik Nederlandse namen
    - Plaats een punt voor een map of document wat uiteindelijk niet publiek moet worden (dus `.antwoorden.docx`, of `.reflectie_module_1.docx`)
			-	Bestanden binnen een onzichtbare map hoeven géén punt te hebben
    - Gebruik voor mappen snake_case, ofwel `woorden_aan_elkaar_zonder_hoofdletters_verbonden_met_underscores` voor mappen en bestanden.
    - Maak voor titels, koppen tussenkoppen etc strict gebruik van de word koppen (dus kop 1, kop 2 en titel etc.), niet zelf lettertypen aanpassen
		- Gebruik geen andere tekst opmaak
    - Gebruik bold voor begrippen (dus niet voor nadruk)
    - Gebruik italics, CAPS of één uitroepteken of indentatie voor nadruk
    - Voor het quoten van code (dus `<div>`, of `int`) gebruik je het volgende:
            - als de code inline moet blijven (dus geen code-blok) omring het met @@
            - als de code een echt code-block moet worden omring het met @@@
        voorbeeld:
        een enkel stukje code zoals @@int x = 2;@@ in een zin
        een code block zoals
        @@@
        for (int i = 0; i < 10; i++) {
            System.out.println(i);
        }
        @@@
				Zorg ervoor dat er tussen de @@@ een lege regel staat (dus gebruik shift+enter ipv enter)!
		- Afbeeldingen
			- Zorg dat de afbeeldingen copyright-vrij zijn en vrij bruikbaar voor commercieel gebruik met modificatie
			- Plaatjes worden tekst-breed neergezet (er kan dus geen tekst naast een plaatje staan)
			- Als je een inline plaatje wil doe dit als volgt:
				Een willkeurige zin @<inline>@@</inline>@ met er in een plaatje
				Waarbij je het plaatje tussen de twee middelste @@ sleept
    - De overige opmaak elementen zullen we individueel moeten bespreken, te veel variatie tussen de modules.
		- Schrijf in de kop van een opdracht @<exercise>@@</exercise>@
				@<exercise>@Opdracht 1: Maak een bestand@</exercise>@
		- Indenteer de tekst van een opdracht, (klik dus één keer op naar rechts bij word)