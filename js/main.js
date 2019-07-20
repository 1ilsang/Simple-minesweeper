(function () {
    const table = document.getElementById('table');
    const timer = document.getElementById('timer');
    let started = false;
    let end = false;
    let timeInterval;
    let totalCnt = 0;
    let mines = [];
    let minesTd = [];

    const init = async function(mineNums = 3, tableSize = 3) {
        await setMines(mineNums);
        totalCnt = Math.floor(tableSize * tableSize - mineNums);
        console.log(mines);
        makeTable(tableSize);
    };

    const setMines = function (num) {
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

    const makeTable = function (tableSize) {
        for (let i = 0; i < tableSize; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < tableSize; j++) {
                const curNum = i * tableSize + j;
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
                    if (end) return;
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

    const deadTrigger = function () {
        end = true;
        for (let e of minesTd) e.style.background = 'red';
        clearInterval(timeInterval);
        alert('Dead!');
    };

    const setCount = function (element, curNum, tableSize) {
        const dr = [0, 1, 0, -1, -1, 1, 1, -1];
        const dc = [1, 0, -1, 0, 1, 1, -1, -1];
        const r = Math.floor(curNum / tableSize);
        const c = curNum % tableSize;
        let cnt = 0;
        for (let i = 0; i < 8; i++) {
            let nr = r + dr[i];
            let nc = c + dc[i];
            let nextNumber = curNum + Math.floor(dr[i] * tableSize + dc[i]);
            if (nr < 0 || nc < 0 || nr >= tableSize || nc >= tableSize) continue;
            if (mines.indexOf(nextNumber) !== -1) cnt++;
        }
        element.innerHTML = cnt + '';
        element.style.background = 'gray';
        if (--totalCnt === 0) {
            for (let e of minesTd) e.style.background = 'red';
            end = true;
            clearInterval(timeInterval);
            alert('Win!');
        }
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
