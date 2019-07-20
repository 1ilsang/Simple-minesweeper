(function () {
    const table = document.getElementById('table');
    const timer = document.getElementById('timer');
    let started = false;
    let dead = false;
    let timeInterval;
    let mines = [];
    let minesTd = [];

    const init = async (mineNums, tableSize) => {
        await setMines(mineNums);
        console.log(mines);
        makeTable(tableSize);
    };

    const setMines = function (num = 10) {
        return new Promise((resolve => {
            let cnt = 0;
            while (cnt < num) {
                let curNum = Math.floor(Math.random() * num * num);
                if (mines.indexOf(curNum) !== -1) continue;
                mines.push(curNum);
                cnt++;
            }
            resolve();
        }));
    };

    const makeTable = function (tableSize = 10) {
        for (let i = 0; i < tableSize; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < tableSize; j++) {
                const curNum = i * 10 + j;
                const td = document.createElement('td');
                const styles = {
                    border: '1px solid black',
                    color: 'white',
                    width: '20px',
                    height: '20px'
                };
                for (let e in styles) td.style[e] = styles[e];
                if (mines.indexOf(curNum) !== -1) minesTd.push(td);
                td.addEventListener('click', () => {
                    if (dead) return;
                    if (!started) {
                        started = true;
                        startTimer();
                    }
                    if (mines.indexOf(curNum) !== -1) deadTrigger(td);
                    else setCount(td, curNum, tableSize);
                }, {once: true});
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    };

    const deadTrigger = function (element) {
        dead = true;
        for (let e of minesTd) e.style.background = 'red';
        clearInterval(timeInterval);
        alert('Dead!');
    };

    const setCount = function (element, curNum, tableSize) {
        const nn = [1, 11, 10, 9, -1, -11, -10, -9];
        const area8 = [];
        for(let i = 0; i < 8; i++) {
            let nextNumber = curNum + nn[i];
            if(nextNumber < 0 || nextNumber >= tableSize * tableSize) continue;
            area8.push(nextNumber);
        }
        let cnt = 0;
        for (let e of area8) if (mines.indexOf(e) !== -1) cnt++;
        element.innerHTML = cnt + '';
        element.style.background = 'gray';
    };

    const startTimer = function () {
        let cnt = 0;
        timer.innerText = ++cnt + '';
        timeInterval = setInterval(function () {
            timer.innerText = ++cnt + '';
        }, 1000);
    };

    return init();
}());
