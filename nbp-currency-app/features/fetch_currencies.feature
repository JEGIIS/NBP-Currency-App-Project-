Feature: Pobieranie kursów walut NBP

  Scenario: Użytkownik pobiera kursy walut dla zakresu dat
    Given użytkownik znajduje się na stronie aplikacji
    When wybiera zakres dat
    And klika przycisk "Pobierz kursy"
    Then aplikacja pobiera dane z API NBP
    And backend zapisuje dane w bazie danych
    And frontend wyświetla kursy w tabeli

  Scenario: Użytkownik filtruje dane według kwartałów
    Given w bazie danych istnieją kursy walut
    When użytkownik wybiera grupowanie "Kwartały"
    Then aplikacja pokazuje dane z podziałem na kwartały
