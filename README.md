# Evocation 

Teammitglieder: 596418 - Deniz Yilmaz Babig
HTW Mail: deniz.babig@student.htw-berlin.de

Evocation ist eine kartenbasierte Travel-/Memory-App, mit der man Orte als Marker speichern, in Trips organisieren und mit anderen teilen kannst.  
Die App besteht aus einem Vue-Frontend und einem Spring-Boot-Backend.

---

## Idee & Motivation
Beim Reisen (oder auch beim Erkunden der eigenen Stadt) entdeckt man ständig Orte, die man später wiederfinden will:
- ein Streetfood-Spot, den man zufällig entdeckt hat  
- ein Viewpoint für Sonnenuntergang  
- ein Café-Tipp von Freunden  
- eine Marktgasse mit guter Atmosphäre  

Evocation macht daraus strukturierte Erinnerungen: Marker + Notizen + Medien, organisiert in Trips und direkt auf der Karte sichtbar.

---

## Features
- **Interaktive Karte**
  - Marker auf der Karte anzeigen (inkl. optionalem Clustering)
  - Zoomen/Bewegen und visuell erkunden

- **Marker**
  - Marker erstellen mit Titel, Beschreibung, Kategorie, Koordinaten
  - Medien hochladen (Bilder/Videos) + Cover auswählen
  - Marker bearbeiten und Medien sortieren

- **Trips**
  - Trips erstellen und Marker zuweisen
  - Trip-Routen/Verbindungen visualisieren

- **Sharing**
  - Trips über einen öffentlichen Link teilen
  - Shared Trips ansehen (ohne Account möglich)

- **Authentifizierung (Okta)**
  - Login & geschützte API-Endpunkte

---

## 🧱 Tech-Stack
### Frontend
- Vue 3 + TypeScript + Vite  
- Pinia (State Management)  
- Vitest (Unit Tests)  

### Backend
- Java 21  
- Spring Boot 3  
- Spring Security + OAuth2 Resource Server (Okta)  
- Spring Data JPA (PostgreSQL / H2 für Tests)  
- Cloudinary (Media Hosting)  
- Nominatim & Photon (Geocoding)

