
# TradeTracker - BackEnd
### O projekcie: 

Aplikacja która pomaga śledzić, notować i analizować Twoje poczynania na rynkach finansowych. Jest to świetne narzędzie do rozwijania i uskuteczniania swojej metody handlowej. Sprawdź, jakie decyzje handlowe przynoszą Ci największe zyski, dzięki aplikacji TradeTracker!

![DEMO](./demo.gif)

## Funkcjonalności:
- podstawowe informacje dotyczące transakcji

- którki opis sytuacji w której podejmowana była decyzja handlowa
- grafika wykresu z serwisu TradingView
- zaznaczenie istotnych wniosków z transakcji za pomoca flagi
- obliczeni skuteczności metodologii handlowej 
- obliczanie średniego współczynnika zysk / strata
- graficzne przedstawienie skuteczności na przestrzeni całego roku handlowego

### Informacja: 
Aplikacja jest ciągle rozwijana ale puki co działa w wersji 1.0.0. Z powodu natłoku obowiązków zabrakło czasu na wdrożenie niektórych rozwiązań takich jak: 

- autoryzacja i autentykacja uzytkownika za pomocą JWT

- opcja przypomnienia hasła użytkownika

- obsługa wyszukiwarki / filtrów pozwalających na sortowanie pozycji wg. potrzeb.

- Dodatkowe dane dotyczące statystyki.

- rozbudowanie sekcji USTAWIENIA o przełączanie motywu, zmianę języka, zmiana avatara

- dodanie breakpointów odpowiadających za responsywność aplikacji oraz widok mobilny

Dodatkowo zauważyłem problem ze stylami w przeglądarce Chrome a dokładniej z właściwością backdrop-filter: blur dla niektórych elementów. Jest to o tyle dziwne że problem ten nie występuje w FireFoxie. 
W najbliższym czasie postaram się rozwiązać ten problem.

Tak jak wspomniałem powyższe funkcjonalności będą stopniowo implementowane do projektu.

Jeśli chodzi o repozytorium to korzystałem z git flow i każdą funkcjonalność realizowałem na osobnym branchu który nasępnie był mergowany i usuwany. 

## Demo

Demo aplikacji dostępne jest pod tym adresem:
https://tradetracker.networkmanager.pl/

Link do repozytorium FrontEnd: 
https://github.com/XPoweR29/TradeTracker-FrontEnd.git

## Technologie

- Express 
- TypeScript 
- mySQL
- Jest 


