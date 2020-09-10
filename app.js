document.addEventListener('DOMContentLoaded',()=>{


  const patternIcons=document.querySelector(".mini-grid")
  const splatterPatterns=document.querySelectorAll(".blast");
  splatterPatterns.forEach(pattern=>{
    pattern.addEventListener('click',selectSplatter)

  })
  const squares=document.querySelectorAll(".grid div");
  squares.forEach(square=>{
    square.addEventListener('click',takeTurn)
    square.addEventListener('mouseover',showPattern)
    square.addEventListener('mouseout',hidePattern)
  })
  let turn=0;
  let players=["player1","player2"];
  let currentPlayer=players[turn%2];
  let splatterMode;
  //const displayCurrentPlayer=document.querySelector("#current-player")
  const splatterDisplay=document.querySelector("#splatter-display")
  const displaySplatterMode=document.querySelector("#splatter-mode")
  const displayResult=document.querySelector("#result")
  splatterDisplay.style.visibility="hidden";
  patternIcons.style.visibility="hidden"




  //chooses a splatter pattern
  function selectSplatter(e){
    splatterPatterns.forEach(pattern=>{pattern.style.border=""})
    const splatterArray=Array.from(splatterPatterns)
    const index=splatterArray.indexOf(e.target)
    splatterPatterns[index].style.border='3px solid'
    if (index===0){
      splatterMode="orthogonal";
    }
    else if (index===1){
      splatterMode="diagonal"
    }
    else {
      splatterMode="all"
    }
    displaySplatterMode.innerHTML=splatterMode

  }
  function showPattern(e){
    if (turn>=36){
      const squareArray=Array.from(squares)
      const index=squareArray.indexOf(e.target)
      if (squares[index].classList.contains(currentPlayer) && !squares[index].classList.contains('splattered')){
        let arr;
        let pattern=splatterMode;
        if (pattern==="orthogonal"){

          arr=orthogonalSplatter(index);
          }
        else if (pattern==="diagonal"){
          arr=diagonalSplatter(index);
        }
        else {
          arr=allSplatter(index);
        }

        for (let item of arr){
          if (!squares[item].classList.contains('splattered')){

            if (currentPlayer=='player1'){
              squares[item].style.backgroundColor='darkmagenta'
            }
            else {
              squares[item].style.backgroundColor='gold'
            }

          }
        }
      }
      }

  }
  function hidePattern(e){
    if (turn>=36){
      const squareArray=Array.from(squares)
      const index=squareArray.indexOf(e.target)
      if (squares[index].classList.contains(currentPlayer)){
        let arr;
        let pattern=splatterMode;
        if (pattern==="orthogonal"){

          arr=orthogonalSplatter(index);
          }
        else if (pattern==="diagonal"){
          arr=diagonalSplatter(index);
        }
        else {
          arr=allSplatter(index);
        }

        for (let item of arr){
          if (!squares[item].classList.contains('splattered')){
            //squares[item].classList.add('splattered')
            squares[item].style.backgroundColor="white"

          }
        }
      }

      }

  }
  //returns an array whose first entry is the square to splatter and the second is the pattern to use
  function calculatePain(n){
    let orthogonal=orthogonalSplatter(n);
    let diagonal=diagonalSplatter(n);
    let m1=0;
    for (let i=0;i<orthogonal.length;i++){
      if (!squares[orthogonal[i]].classList.contains('splattered')){
        if (squares[orthogonal[i]].classList.contains('player2')){
          m1-=1
        }
        else {m1+=1}
      }

    }
    let m2=0;
    for (let i=0;i<diagonal.length;i++){
      if (!squares[diagonal[i]].classList.contains('splattered')){
        if (squares[diagonal[i]].classList.contains('player2')){
          m2-=1
        }
        else {m2+=1}
      }

    }
    if (m2>=0 && m1>=0){
      return [m2+m1+1,"all"]
    }
    else if (m1>=m2){
      return [m1,"orthogonal"]
    }
    else {return [m2,"diagonal"]}
    }

  function maximizePain(){
    let m=-4;
    let maxIndex=0;
    let maxPattern="orthogonal";
    for (let i=0;i<squares.length;i++){
      if (!squares[i].classList.contains('splattered') && squares[i].classList.contains('player2')){
        if (calculatePain(i)[0]>m){
          m=calculatePain(i)[0];
          console.log(m)
          maxPattern=calculatePain(i)[1];
          maxIndex=i
        }
      }
    }
    return [maxIndex,maxPattern]
  }
  //this function does the splattering and is called by the click event callback.
  function splatter(i,pattern,player){

    let arr;
    if (pattern==="orthogonal"){

      arr=orthogonalSplatter(i);
      }
    else if (pattern==="diagonal"){
      arr=diagonalSplatter(i);
    }
    else {
      arr=allSplatter(i);
    }

    for (let item of arr){
      if (!squares[item].classList.contains('splattered')){
        squares[item].classList.add('splattered')
        if (currentPlayer=='player1'){
          squares[item].style.backgroundColor='darkmagenta'
        }
        else {
          squares[item].style.backgroundColor='gold'
        }

      }
    }

  }
  function orthogonalSplatter(i){
    const x=i%6;
    const y=Math.floor(i/6);
    let arr=[];
    if (y>0){
      arr.push(i-6)
    }
    if (x>0){
      arr.push(i-1)
    }
    arr.push(i)
    if (x<5){
      arr.push(i+1)
    }
    if (y<5){
      arr.push(i+6)
    }
    return arr
  }
  function diagonalSplatter(i){
    const x=i%6;
    const y=Math.floor(i/6);
    let arr=[];
    if (x>0 && y>0){
      arr.push(i-7)
    }
    if (x<5 && y>0){
      arr.push(i-5)
    }
    arr.push(i)
    if (x>0 && y<5){
      arr.push(i+5)
    }
    if (x<5 && y<5){
      arr.push(i+7)
    }
    return arr
  }
  function allSplatter(i){
    let arr=diagonalSplatter(i).concat(orthogonalSplatter(i))
    let index=arr.indexOf(i);
    arr.splice(index,1)
    return arr
  }

  function computerMove(){
    if (turn<36){
      let count=0;
      while (count<3){
        //takes 3 squares at random
        rand=Math.floor(Math.random()*squares.length);
        if (!squares[rand].classList.contains('taken')){
          squares[rand].classList.add('taken','player2')
          count+=1

          turn+=1


          }


      }
      if (turn===36){
        splatterMode="orthogonal"
        displaySplatterMode.innerHTML=splatterMode
        splatterDisplay.style.visibility="visible"
        patternIcons.style.visibility="visible"
        splatterPatterns[0].style.border='3px solid'
        currentPlayer=players[1]
        //displayCurrentPlayer.innerHTML=currentPlayer
        //displayCurrentPlayer.style.color="gold"
        computerMove()
      }

      }

    else {
      let temp=maximizePain()
      //console.log(temp)
      splatter(temp[0],temp[1],'player2')
      turn+=1

    }
    currentPlayer=players[0]
    //displayCurrentPlayer.innerHTML=currentPlayer
    //displayCurrentPlayer.style.color="darkmagenta"
    let gameOver=true;
    for (i=0;i<squares.length;i++){

      if (!squares[i].classList.contains('splattered') && squares[i].classList.contains('player1')){

        gameOver=false
      }
    }
    if (gameOver)
    {
      //displayCurrentPlayer.style.visibility="hidden"
      displayResult.innerHTML=`COMPUTER WINS!!!`
      squares.forEach((square) => {
        square.classList.add('splattered')
      });

    }
  }

  //event handler for clicking the gameboard (where all the action happens)
  function takeTurn(e){
    const squareArray=Array.from(squares)
    const index=squareArray.indexOf(e.target)
    //Phase one: fill the board w/dots
    if (turn<36){
      if (!squares[index].classList.contains('taken')){
        squares[index].classList.add(currentPlayer,'taken')
        turn+=1
        if (turn%3===0){
          currentPlayer=players[turn%2]

          //displayCurrentPlayer.innerHTML=currentPlayer
          if (currentPlayer==='player1'){
            //displayCurrentPlayer.style.color='darkmagenta'

          }
          else {
            //displayCurrentPlayer.style.color='gold'
          }

          if (currentPlayer==='player2'){
            computerMove()
          }
        }
      }
    }

    //phase two: Splatter!
    else{
      if (squares[index].classList.contains(currentPlayer) && !squares[index].classList.contains('splattered')){
        splatter(index,splatterMode,currentPlayer);
        turn+=1;
        currentPlayer=players[(turn+1)%2]
        let gameOver=true;
        for (i=0;i<squares.length;i++){

          if (!squares[i].classList.contains('splattered') && squares[i].classList.contains('player2')){

            gameOver=false
          }
        }
        if (gameOver)
        {
          //displayCurrentPlayer.style.visibility="hidden"
          displayResult.innerHTML=`${players[(turn)%2]} WINS!!!`
          squares.forEach((square) => {
            square.classList.add('splattered')
          });

        }
        else {
          //displayCurrentPlayer.style.color='gold'
          computerMove();
        }
        //displayCurrentPlayer.innerHTML=currentPlayer



      }

    }
  }
})
