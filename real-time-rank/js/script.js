const createEle = (ele, attr) => {
    const element = document.createElement(ele);
    for(let i in attr) {
        switch(i) {
            case 'class':
                const classes = attr[i].split(' ');
                classes.forEach(cl => {
                    element.classList.add(cl);
                })
                break;
            case 'readonly':
            case 'disabled':
            case 'for':
                element.setAttribute(i,attr[i]);
                break;
            default :
                element[i] = attr[i];
                break;
        }
    }
    return element;
}

const rank = document.querySelector('#rank');

let initRanklist = () => {

  let list = [];

  for(let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i)
          
      storage = JSON.parse(localStorage.getItem(key))
      storage.keyword = key;
        
      list.push(storage)
  }

  list.sort((a,b) => {
      return a.rank - b.rank   
  })

  for(let i in list) {
      let rankList = createEle('li')
      let ranking = createEle('span', {class: 'ranking', textContent: list[i].rank});
      let rankKwd = createEle('a', {class: 'rank-keyword', textContent: list[i].keyword});

      if(list[i].rank == 'new') {ranking.classList.add('new')};

      rankKwd.dataset.rank = list[i].rank;
      rankKwd.href = 'javascript:;';

      rankList.append(ranking);
      rankList.append(rankKwd);
      rank.append(rankList)
  }

}

let obj = {
  count: 1,
  rank: 'new'
}

const form = document.querySelector('#searchForm');

form.onsubmit = () => {
  let storage;

  let keyword = document.querySelector('#sch_keyword').value;

  if(localStorage.length > 0) {

    for(let i = 0; i < localStorage.length; i++) {

      if(localStorage.key(i) == keyword) {
        storage = JSON.parse(localStorage.getItem(keyword));

        storage.count++;

        break;
      }
    }

    if(!storage) {
      localStorage.setItem(keyword, JSON.stringify(obj));
    } else {
      localStorage.setItem(keyword, JSON.stringify(storage));
    }
  } else {

    localStorage.setItem(keyword, JSON.stringify(obj));

  }

}

let changeRank = () => {
  let storage;
  let count;
  let list = [];

  for(let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i)
      
      storage = JSON.parse(localStorage.getItem(key))
      storage.keyword = key;
      
      list.push(storage)
  }

  list.sort((a,b) => {
      return b.count - a.count
  })

  for(let i = 0; i < list.length; i++) {
      let changeObj = JSON.parse(localStorage.getItem(list[i].keyword));
      
      changeObj.rank = i + 1

      localStorage.setItem(list[i].keyword, JSON.stringify(changeObj))

  }

  document.querySelectorAll('#rank > li > #rank-keyword').forEach(el => {
    for(let i in list) {
      if(el.dataset.rank == list[i].rank) {
        el.textContent = list[i].keyword;
      }
    }
  })

}

// let move = (index) => {
//   let count = document.querySelectorAll('#rank-list li').length;
//   let height = document.querySelector('#rank-list li').clientHeight;

//   document.querySelector('#rank-list ol').animate({
//        top: -height * index + 'px',
//       }, {
//         duration: 500
//       });
// }

let change = () => new Promise ((resolve, reject) => { 
  let first = document.querySelector('#rank li:first-child');

  resolve(first);

})

// let change = () => new Promise ((resolve, reject) => {
//   let first = document.querySelector('#rank li:first-child');
//   let rank = document.querySelector('#rank');

//   first.animate(
//     {
//       marginTop : '-20px'
//     }, 500
//   );

//   resolve(first);
// })

let ticker = () => {
  let first = document.querySelector('#rank li:first-child');

  first.classList.add('move');

  timer = setTimeout(() => {

    change().then( (first) => {

      first.classList.remove('move');
      first.remove();
      rank.append(first);

      ticker();
    })

  }, 3000)
}

let tickerover = () => {
  document.querySelector('#content').onmouseover = () => {
    clearTimeout(timer);
  }
  document.querySelector('#content').onmouseout = () => {
    ticker();
  }
}

document.querySelector('#clear').onclick = () => {
  window.localStorage.clear();
}

window.onload = () => {
  initRanklist();

  if(rank.childElementCount > 0) {
    ticker();

    tickerover();
  } 

  setInterval( () => {

    changeRank();

  }, 5000);
}
