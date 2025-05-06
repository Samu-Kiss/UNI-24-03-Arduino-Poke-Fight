//Librerías necesarias
#include <SPI.h>
#include <LiquidCrystal.h>
#include <Servo.h>
 
  // Definición de pines para componentes
 
// ENTRADAS
#define PIN_SD_MOSI 50
#define PIN_SD_MISO 51
#define PIN_SD_SCK 52
#define PIN_SD_CS 53
 
#define PIN_BUTTON_P1 38
#define PIN_BUTTON_P2 34
#define PIN_POT_P1 A1
#define PIN_POT_P2 A15
#define PIN_MIC A0
Servo servo;
 
// SALIDAS
#define PIN_LED_P1_R 8
#define PIN_LED_P1_G 9
#define PIN_LED_P1_B 10
#define PIN_LED_P2_R 5
#define PIN_LED_P2_G 6
#define PIN_LED_P2_B 7
#define PIN_LED_P1 46
#define PIN_LED_P2 48
 
// Pantalla LCD
#define PIN_LCD_RS 39
#define PIN_LCD_ENABLE 41
#define PIN_LCD_D4 43
#define PIN_LCD_D5 45
#define PIN_LCD_D6 47
#define PIN_LCD_D7 49
 
//Servo motor y sensor ultrasonido
int motorPin = 31;
#define trigPin 26
#define echoPin 28
// Configuración de la pantalla LCD con sus pines
LiquidCrystal lcd(PIN_LCD_RS, PIN_LCD_ENABLE, PIN_LCD_D4, PIN_LCD_D5, PIN_LCD_D6, PIN_LCD_D7);
 
//Caracteres especiales para la imprimir en la LCD  
byte flecha[] = {
  B00000,
  B11000,
  B01100,
  B00110,
  B00011,
  B00110,
  B01100,
  B11000
};
byte corazon[] = {
  B00000,
  B00000,
  B01010,
  B11111,
  B11111,
  B01110,
  B00100,
  B00000
};
byte espada[] = {
  B00000,
  B00011,
  B00111,
  B11110,
  B01100,
  B10100,
  B00000,
  B00000
};
byte escudo[] = {
  B00000,
  B10101,
  B11111,
  B11111,
  B11111,
  B01110,
  B00100,
  B00000
};
byte pokeball[] = {
  B00000,
  B01110,
  B11111,
  B11011,
  B10101,
  B01110,
  B00000,
  B00000
};
byte skull[] = {
  B00000,
  B01110,
  B11111,
  B11111,
  B10101,
  B01110,
  B10101,
  B00000
};
 
// Estructura para almacenar la información de cada Pokémon
  struct Pokemon {
      String name;
      String type;
      int r, g, b; // Color RGB
      int health;
      bool shieldActivado;
      bool main;
  };
 
// PEGAR ACÁ LO COPIADO DEL WEBSITE
Pokemon player1[2] = {
    {"Pikachu", "Eléctrico", 255, 255, 0, 75, false, true},  // Primer Pokémon del jugador 1
    {"Bulbasaur", "Planta", 0, 255, 0, 75, false, false}     // Segundo Pokémon del jugador 1
};
 
Pokemon player2[2] = {
    {"Charmander", "Fuego", 255, 0, 0, 75, false, true},    // Primer Pokémon del jugador 2
    {"Squirtle", "Agua", 0, 0, 255, 75, false, false}     // Segundo Pokémon del jugador 2
};
 
//Booleano de turno del jugador 1 para controlar el flujo del juego
  bool player1Turn = true;
 
  void setup() {
      // Inicializar serial
      Serial.begin(9600);
      //Conectar el objeto servo al pin 11
      servo.attach(motorPin);
      //Configuración relacionada con entrada y salida para el sensor ultrasonido
      pinMode(trigPin, OUTPUT);
      pinMode(echoPin, INPUT);
 
      // Configuración de pines
      pinMode(PIN_LED_P1_R, OUTPUT);
      pinMode(PIN_LED_P1_G, OUTPUT);
      pinMode(PIN_LED_P1_B, OUTPUT);
      pinMode(PIN_LED_P2_R, OUTPUT);
      pinMode(PIN_LED_P2_G, OUTPUT);
      pinMode(PIN_LED_P2_B, OUTPUT);
      pinMode(PIN_BUTTON_P1, INPUT);
      pinMode(PIN_BUTTON_P2, INPUT);
      pinMode(PIN_MIC, INPUT);
      pinMode(PIN_POT_P1, INPUT);
      pinMode(PIN_POT_P2, INPUT);
      pinMode(PIN_LED_P1, OUTPUT);
      pinMode(PIN_LED_P2, OUTPUT);
 
      // Inicializar LCD y crear caracteres especiales
      lcd.begin(16, 2);
      lcd.createChar(0, flecha);
      lcd.createChar(1, corazon);
      lcd.createChar(2, espada);
      lcd.createChar(3, escudo);
      lcd.createChar(4, pokeball);
      lcd.createChar(5, skull);
      lcd.home();
      lcd.print("Inicializando...");
      delay(1000);
      // Prender todos los leds (los RGB se prenden con la combinación de color del primer pokemon de cada jugador)
      setLEDColor(PIN_LED_P1_R, PIN_LED_P1_G, PIN_LED_P1_B, player1[0].r, player1[0].g, player1[0].b);
      setLEDColor(PIN_LED_P2_R, PIN_LED_P2_G, PIN_LED_P2_B, player2[0].r, player2[0].g, player2[0].b);
      digitalWrite(PIN_LED_P1, LOW);
      digitalWrite(PIN_LED_P2, LOW);
  }
 
  void loop() {
      //El juego va a correr mientras ambos jugadores tengan al menos un Pokemon con la salud por encima de cero
      while ((player1[0].health > 0 || player1[1].health > 0) && (player2[0].health > 0 || player2[1].health > 0)) {
        //Se imprime en la lcd de quien es el turno
        lcd.clear();
        lcd.setCursor(0, 0);
        String msg = (player1Turn ? "Turno de J1": "Turno de J2");
        //El servo (al que está atado el senor ultrasonido) apunta al jugador que tiene el turno
        if (player1Turn==true){
          servo.write(30);
        }
        else
        {
          servo.write(150);
        }
        lcd.print(msg);
        delay(1750);
        //Se pasa a la función showMenu, de la que recibe cual es la opción a ejecutar
        int choice = showMenu();
        //Se ejecuta la acción de juego según haya escogido el jugador
        executeAction(choice);
        //Se niega el valor actual de player1Turn de manera que se ha cambiado de turno
        player1Turn = !player1Turn;
      }
      //Si salió unos de los dos jugadores tiene ambos pokemones con salud por debajo de 0
      lcd.clear();
      if (player1[0].health <= 0 && player1[1].health <= 0) {
          //Si el jugador 2 gana pone ambos pines de color rojo y lo imprime en la LCD
          setLEDColor(PIN_LED_P1_R, PIN_LED_P1_G, PIN_LED_P1_B, 255, 0, 0);
          setLEDColor(PIN_LED_P2_R, PIN_LED_P2_G, PIN_LED_P2_B, 255, 0, 0);
          lcd.print("J2 gana");
      } else {
          //Si el jugador 1 gana pone ambos pines de color azul y lo imprime en la LCD
          setLEDColor(PIN_LED_P1_R, PIN_LED_P1_G, PIN_LED_P1_B, 0, 0, 255);
          setLEDColor(PIN_LED_P2_R, PIN_LED_P2_G, PIN_LED_P2_B, 0, 0, 255);
          lcd.print("J1 gana");
          Serial.println("J1 Gana");
      }
  }
 
  int showMenu() {
      bool escogido=false;
      //Se va a permanecer en esta función hasta que el jugador del turno escoja una opción
      while(escogido==false)
      {
        //Obtiene el valor del potenciómetro del jugador del turno y lo usa para saber cuál opción imprimir
        int opcionAMostrar;
        if(player1Turn ==true)
          opcionAMostrar=analogRead(PIN_POT_P1);
        else
          opcionAMostrar=analogRead(PIN_POT_P2);
        //Imprime la opción correspondiente según el valor leído del potenciometro y su ubicación en alguno de los intervalos
        //Si estando en cierta opción el jugador del turno presiona su pulsador, se retornará el entero correspondiente a la opción escogida
        lcd.clear();
        lcd.setCursor(0, 0);
        if (opcionAMostrar>=0 &&opcionAMostrar<240){
          lcd.write(byte(0));
          lcd.print("Ataque");
          delay(50);
          if (player1Turn==true){
            if(digitalRead(PIN_BUTTON_P1)==HIGH){
              return 1;
            }
          } else
          if (player1Turn==false){
            if(digitalRead(PIN_BUTTON_P2)==HIGH){
              return 1;
            }
          }
        }
        else if (opcionAMostrar>=240 &&opcionAMostrar<480){
          lcd.write(byte(0));
          lcd.print("Ataque Especial");
          delay(50);
          if (player1Turn==true){
            if(digitalRead(PIN_BUTTON_P1)==HIGH){
              return 2;
            }
          } else
          if (player1Turn==false){
            if(digitalRead(PIN_BUTTON_P2)==HIGH){
              return 2;
            }
          }
        }
        else if (opcionAMostrar>=480 &&opcionAMostrar<720){
          lcd.write(byte(0));
          lcd.print("Escudo");
          delay(50);
          if (player1Turn==true){
            if(digitalRead(PIN_BUTTON_P1)==HIGH){
              return 3;
            }
          } else
          if (player1Turn==false){
            if(digitalRead(PIN_BUTTON_P2)==HIGH){
              return 3;
            }
          }
        }
        else if (opcionAMostrar>=720 &&opcionAMostrar<960){
          lcd.write(byte(0));
          lcd.print("RecuperarSalud");
          delay(50);
          if (player1Turn==true){
            if(digitalRead(PIN_BUTTON_P1)==HIGH){
              return 4;
            }
          } else
          if (player1Turn==false){
            if(digitalRead(PIN_BUTTON_P2)==HIGH){
              return 4;
            }
          }
        }
        else if (opcionAMostrar>=960 &&opcionAMostrar<1200){
          lcd.write(byte(0));
          lcd.print("Cambiar PKM");
          delay(50);
          if (player1Turn==true){
            if(digitalRead(PIN_BUTTON_P1)==HIGH){
              return 5;
            }
          } else
          if (player1Turn==false){
            if(digitalRead(PIN_BUTTON_P2)==HIGH){
              return 5;
            }
          }
      }
    }
  }
 
  void executeAction(int choice) {
    //Dependiendo de la acción seleccionada por el usuario, llama a la función correspondiente
      switch (choice) {
          case 1:
              attack();
              break;
          case 2:
              specialAttack();
              break;
          case 3:
              useShield();
              break;
          case 4:
              recoverHealth();
              break;
          case 5:
              changePokemon();
              break;
      }
  }
 
void attack() {
  //Obtiene las direcciones de los pokemones atacante y defensor 
  //Asigna a atacante el pokemon en juego (dado por la variable main en la estructura) del jugador del turno
  //Y a defensor el pokemon en juego (dado por la variable main en la estructura) del jugador contrario
    Pokemon* attacker = nullptr;
    Pokemon* defender = nullptr;
    if (player1Turn) {
        attacker = player1[0].main ? &player1[0] : &player1[1];
        defender = player2[0].main ? &player2[0] : &player2[1];
    } else {
        attacker = player2[0].main ? &player2[0] : &player2[1];
        defender = player1[0].main ? &player1[0] : &player1[1];
    }
    //Llama a la función calculateBasicAttack para obtener el valor de daño del ataque
    int damage = calculateBasicAttack(*attacker, *defender);
    //Resta a la salud del pokemon defensor el daño causado
    defender->health -= damage;
 
    //Imprime en la LCD el nombre del pokemon que atacó y el daño que realizó
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print(attacker->name);
    lcd.setCursor(0,1);
    lcd.print("Damages: " + String(damage));
    lcd. write(byte(2));
    delay(1750);
 
    //Imprime en la LCD el nombre del pokemon defensor y su vida restante luego del daño que recibió
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print(defender->name);
    lcd.setCursor(0,1);
    lcd.print("Health: " + String(defender->health));
    Serial.println("Health: " + String(defender->health));
    lcd.write(byte(1));
    delay(1750);
 
    //Si la salud del pokemon defensor queda en 0 o menos, cambia el pokemon en juego del jugador contrincante y apaga el LED auxiliar
    if(defender->health<=0){
      //Dado que la función changePokemon() cambia el pokemon del judagor del turno, cambiamos por un momento el valor de esta variable para hacer el cambio y luego se restaura
      player1Turn = !player1Turn;
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.write(byte(5));
        lcd.print(" "+defender->name);
        lcd.setCursor(0,1);
        lcd.print("Ha muerto");
        delay(1750);
        changePokemon();
      player1Turn = !player1Turn;
        if(player1Turn)
          digitalWrite(PIN_LED_P2, HIGH);
        else
          digitalWrite(PIN_LED_P1, HIGH);
    }
}
 
  void specialAttack() {
    //El superataque ofrece la posibilidad de hacer daño al pokemon del contrincante (entre 0 y 50) a partir de lo detectado por el micrófono
    //En algunas ocasiones, para ciertas combinaciones de pokemones, este ataque será la mejor opción, pero se corre el riesgo de no hacer ruido a tiempo y no realizar mucho daño
 
    //Obtiene las direcciones de los pokemones atacante y defensor 
    //Asigna a atacante el pokemon en juego (dado por la variable main en la estructura) del jugador del turno
    //Y a defensor el pokemon en juego (dado por la variable main en la estructura) del jugador contrario
    Pokemon* attacker = nullptr;
    Pokemon* defender = nullptr;
    if (player1Turn) {
        attacker = player1[0].main ? &player1[0] : &player1[1];
        defender = player2[0].main ? &player2[0] : &player2[1];
    } else {
        attacker = player2[0].main ? &player2[0] : &player2[1];
        defender = player1[0].main ? &player1[0] : &player1[1];
    }
    //Para realizarse el superataque se requiere que el jugador que lo realiza esté a cierta distancia del micrófono
    //Mientras no se cumpla tal condición, el juego no lo va a permitir continuar
    int distance = 0;
    do {
      digitalWrite(trigPin, LOW);
      delayMicroseconds(5);
      digitalWrite(trigPin, HIGH);
      delayMicroseconds(5);
      digitalWrite(trigPin, LOW);
 
      long duration = pulseIn(echoPin, HIGH);
      distance = duration /59;
 
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Alejese de mic");
      lcd.setCursor(0, 1);
      lcd.print("Distancia: " + String(distance));
      delay(50);
    } while (distance < 1170);
 
    //Se muestra en la pantalla LCD un cuenta regresiva tras la cual se hace la lectura del micrófono y el correspondiente mapeo para determinar el nivel de daño
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Haga ruido en");
      delay(1000);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("3");
      delay(1000);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("2");
      delay(1000);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("1");
      delay(1000);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Ya");
      lcd.clear();
      lcd.setCursor(0, 0);
      int micValue = analogRead(PIN_MIC);
      int damage = map(micValue, 0, 1023, 0, 50);
    //Resta a la salud del pokemon defensor el daño causado
      defender->health -= damage;
      
    //Imprime en la LCD el nombre del pokemon que atacó y el daño que realizó
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print(attacker->name);
      lcd.setCursor(0,1);
      lcd.print("Damages: " + String(damage));
      lcd. write(byte(2));
      delay(1750);
 
    //Imprime en la LCD el nombre del pokemon defensor y su vida restante luego del daño que recibió
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print(defender->name);
      lcd.setCursor(0,1);
      lcd.print("Health: " + String(defender->health));
      Serial.println("Health: " + String(defender->health));
      
      lcd.write(byte(1));
      delay(1750);
 
      //Si la salud dle pokemon defensor queda en 0 o menos, cambia el pokemon en juego del jugador contrincante y apaga el LED auxiliar    
      if(defender->health<=0){
      //Dado que la función changePokemon() cambia el pokemon del judagor del turno, cambiamos por un momento el valor de esta variable para hacer el cambio y luego se restaura
        player1Turn = !player1Turn;
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.write(byte(5));
        lcd.print(defender->name);
        lcd.setCursor(0,1);
        lcd.print("Ha muerto");
        delay(1750);
        changePokemon();
        player1Turn = !player1Turn;
        if(player1Turn)
          digitalWrite(PIN_LED_P2, HIGH);
        else
          digitalWrite(PIN_LED_P1, HIGH);
      }
  }
 
  void useShield() {
    //Cambia el valor de shieldActivado del pokemon principal (indicado por la característica main del pokemon) del jugador de turno 
    Pokemon* poke = player1Turn ? (player1[0].main ? &player1[0] : &player1[1]) : (player2[0].main ? &player2[0] : &player2[1]);
    poke->shieldActivado = true;
    //Muestra en la LCD el pokemon que activó el escudo
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print(poke->name);
    lcd.setCursor(0,1);
    lcd.write(byte(3));
    lcd.print("Usa escudo");
    delay(1750);
  }
 
  void recoverHealth() {
    //Aumenta el valor de salud del pokemon principal (indicado por la característica main del pokemon) del jugador de turno
    Pokemon* poke = player1Turn ? (player1[0].main ? &player1[0] : &player1[1]) : (player2[0].main ? &player2[0] : &player2[1]);
    poke->health += 25;
    //Muestra en la LCD el pokemon que recuperó vida
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print(poke->name);
    lcd.setCursor(0,1);
    lcd.print("Recupera Vida ");
    lcd.write(byte(1));
    delay(1750);
  }
 
  void changePokemon() {
    /*
      Esta función permite cambiar el pokemon que está en juego para determinado jugador
      se tiene dos usos: Voluntario, o cuando la salud de el pokemon ha quedado en 0 o menos y toca cambiar de pokemon
      La función usa al jugador del turno para hacer el cambio, mira cual de los dos pokemones tiene actualmente el main en true y si el pokemon auxiliar tiene salud por encima de 0
      Si es así, pone el main pokemon actual en false y el del auxilar en true y cambiar el color del Led RGB al del pokemon que quedó con main true 
    */
    if (player1Turn) {
      if(player1[0].main==true && player1[1].health>0){
        player1[0].main=false;
        player1[1].main=true;
 
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.write(byte(4));
        lcd.print(player1[0].name + " swap");
        lcd.setCursor(0,1);
        lcd.write(byte(4));
        lcd.print(player1[1].name);
 
        setLEDColor(PIN_LED_P1_R, PIN_LED_P1_G, PIN_LED_P1_B, player1[1].r, player1[1].g, player1[1].b);
        delay(1750);
      } else if(player1[1].main==true && player1[0].health>0){
        player1[0].main=true;
        player1[1].main=false;
 
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.write(byte(4));
        lcd.print(player1[1].name + " swap");
        lcd.setCursor(0,1);
        lcd.write(byte(4));
        lcd.print(player1[0].name);
 
        setLEDColor(PIN_LED_P1_R, PIN_LED_P1_G, PIN_LED_P1_B, player1[0].r, player1[0].g, player1[0].b);
        delay(1750);
      }
    } else if (!player1Turn) {
      if(player2[0].main==true && player2[1].health>0){
        player2[0].main=false;
        player2[1].main=true;
 
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.write(byte(4));
        lcd.print(player2[0].name + " swap");
        lcd.setCursor(0,1);
        lcd.write(byte(4));
        lcd.print(player2[1].name);
 
        setLEDColor(PIN_LED_P2_R, PIN_LED_P2_G, PIN_LED_P2_B, player2[1].r, player2[1].g, player2[1].b);
        delay(1750);
      } else if(player2[1].main==true && player2[0].health>0){
        player2[0].main=true;
        player2[1].main=false;
 
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.write(byte(4));
        lcd.print(player1[1].name + " swap");
        lcd.setCursor(0,1);
        lcd.write(byte(4));
        lcd.print(player1[0].name);
 
        setLEDColor(PIN_LED_P2_R, PIN_LED_P2_G, PIN_LED_P2_B, player2[0].r, player2[0].g, player2[0].b);
        delay(1750);
      }
    }
  }
 
  int calculateBasicAttack(Pokemon attacker, Pokemon defender) {
    //Calcula el nivel de daño que hace un ataque a partir de la caondiciones dadas:
      int damage = 0;
      if (!defender.shieldActivado) {
        if ((attacker.type == "Fuego" && defender.type == "Planta") || 
            (attacker.type == "Agua" && defender.type == "Fuego") || 
            (attacker.type == "Planta" && defender.type == "Agua")) {
            damage = 50;
        } else if (attacker.type == defender.type) {
            damage = 20;
        } else {
            damage = 10;
        }
      }
      defender.shieldActivado=false;
      return damage;
  }
 
  void setLEDColor(int redPin, int greenPin, int bluePin, int r, int g, int b) {}
      //Recibe los pines del led RGB a cambiar y los valores para cada color y cambia el led RGB a esta nueva comnbinación
      analogWrite(redPin, r);
      analogWrite(greenPin, g);
      analogWrite(bluePin, b);
  }
