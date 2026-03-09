# System Zarządzania Zadaniami (Task Manager)

## Opis projektu

Task Manager to aplikacja webowa umożliwiająca zarządzanie projektami i zadaniami.
System pozwala użytkownikom tworzyć projekty, dodawać zadania oraz śledzić ich postęp.

Aplikacja została zbudowana w architekturze klient–serwer i wykorzystuje REST API do komunikacji pomiędzy frontendem i backendem.

Dodatkowo system obsługuje tryb **offline**, który pozwala na pracę bez połączenia z internetem oraz synchronizację danych po ponownym połączeniu.

---

## Główne funkcjonalności

* Rejestracja i logowanie użytkowników (JWT Authentication)
* Tworzenie i zarządzanie projektami
* Tworzenie i edycja zadań
* Komunikacja frontend–backend przez REST API
* Tryb offline z lokalnym zapisem danych
* Synchronizacja danych po przywróceniu połączenia z internetem
* Dokumentacja API dostępna w Swagger

---

## Wykorzystane technologie

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite / PostgreSQL
* JWT Authentication

### Frontend

* React
* Vite
* JavaScript
* CSS

### Inne narzędzia

* Docker
* Swagger (dokumentacja API)

---

## Architektura systemu

Aplikacja wykorzystuje architekturę klient–serwer.

Frontend komunikuje się z backendem poprzez REST API.

Frontend (React)
↓
REST API (FastAPI)
↓
Warstwa logiki aplikacji
↓
Baza danych (SQLAlchemy)

---

## Struktura bazy danych

System wykorzystuje trzy główne tabele:

Users
Projects
Tasks

Relacje pomiędzy tabelami:

* jeden użytkownik może posiadać wiele projektów
* jeden projekt może zawierać wiele zadań

Schemat relacji:

User → Projects → Tasks

---

## Endpointy API

### Uwierzytelnianie użytkownika

POST /users/register – rejestracja użytkownika
POST /users/login – logowanie i otrzymanie tokena JWT
GET /users/me – pobranie informacji o aktualnym użytkowniku

### Projekty

GET /projects – pobranie wszystkich projektów
POST /projects – utworzenie nowego projektu
GET /projects/{id} – pobranie projektu po ID
PUT /projects/{id} – edycja projektu
DELETE /projects/{id} – usunięcie projektu

### Zadania

GET /tasks – pobranie wszystkich zadań
POST /tasks – utworzenie zadania
PUT /tasks/{id} – edycja zadania
DELETE /tasks/{id} – usunięcie zadania

---

## Tryb offline

Aplikacja wspiera pracę w trybie offline.

W przypadku utraty połączenia z internetem:

* dane zapisywane są lokalnie w przeglądarce
* zmiany trafiają do kolejki synchronizacji

Po ponownym połączeniu z internetem użytkownik może użyć funkcji **Sync**, aby wysłać dane na serwer.

---

## Uruchomienie projektu

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Serwer backend będzie dostępny pod adresem:

```
http://localhost:8000
```

Dokumentacja API (Swagger):

```
http://localhost:8000/docs
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikacja frontend będzie dostępna pod adresem:

```
http://localhost:5173
```

---

## Demonstracja funkcjonalności

System umożliwia:

* rejestrację i logowanie użytkownika
* tworzenie projektów
* zarządzanie zadaniami
* pracę w trybie offline
* synchronizację danych z serwerem
* testowanie API poprzez Swagger

---

## Autorzy

Autorzy:

Oleh Bilko 51751
Maksym Bartashuk 51750