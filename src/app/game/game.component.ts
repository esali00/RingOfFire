import { Component, OnInit } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  
  game: Game; 
  items: Observable<any[]>;
  gameID: string;

  constructor(private route: ActivatedRoute ,private firestore: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame()
    
    this.route.params.subscribe((params) => {
      console.log(params["id"])
      this.gameID = params["id"]

      this.
      firestore.
      collection('games').
      doc(params["id"]).
      valueChanges().
      subscribe((game: any) => {
        console.log("Game update", game)
        this.game.currentPlayer = game.currentPlayer
        this.game.playedCards = game.playedCards
        this.game.players = game.players
        this.game.stack = game.stack
        this.game.pickCardAnimation = game.pickCardAnimation
        this.game.currentCard = game.currentCard 
      });
    })

  }

  newGame() {
    this.game = new Game()
    console.log(this.game)
  }

  showCurrentPlayer() {
    let players = document.querySelectorAll<HTMLDivElement>(".player")

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      let topPos;

      if (player.classList.contains("player-active") ) {
        console.log("found active player")
        topPos = 32 + i * 80
        if (i == players.length - 1) {
          topPos = 0
        } 
        document.querySelector(".display-player").scrollTop = topPos
      }
      
    }
  }


  takeCard() {
    if (!this.game.pickCardAnimation && this.game.players.length >=2 ) {
      this.game.currentCard = this.game.stack.pop();
      console.log(this.game.currentCard)

      this.game.pickCardAnimation = true  
      
      this.game.currentPlayer++
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length
      this.saveGame()

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard) 
        this.game.pickCardAnimation = false  
        this.saveGame()
      }, 1500)

      this.showCurrentPlayer()

    }
    
    if (this.game.players.length < 2 ) {
      this.openDialog()
    }

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent)
   
    dialogRef.afterClosed().subscribe(name => {
      console.log(name)
    
      if (name && name.length > 0) {
        this.game.players.push(name)
        this.saveGame()
      }
      console.log('The dialog was closed'); 
    });
  }

  saveGame() {
    this.
      firestore.
      collection('games').
      doc(this.gameID).
      update(this.game.toJSON())
  }

}

