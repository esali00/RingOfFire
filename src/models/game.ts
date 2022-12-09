export class Game {
    public players: string[] = []
    public stack: string[] = []
    public playedCards: string[] = []
    public currentPlayer: number = 0
    public pickCardAnimation = false;
    public currentCard: string = ""

    constructor() {
       
        for (let i = 1; i < 14; i++) {
            this.stack.push('ace_'+ i);
            this.stack.push('clubs_'+ i);
            this.stack.push('diamonds_'+ i);
            this.stack.push('hearts_'+ i);
        }
        shuffle(this.stack)
    }

    public toJSON() {
        return {
            players: this.players,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            pickCardAnimation: this.pickCardAnimation,
            currentCard: this.currentCard
        }
    }
}


function shuffle(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
    
        // Generate random number
        let j = Math.floor(Math.random() * (i + 1));
                    
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
        
    return array;
 }