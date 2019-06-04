var svg;
const snake = {
    direction: "E",
    length: 1,
    score: 0
}
var animate;
var snakeElement;
var isPaused;
var interval;
var foodInterval;
var g;
const foods = [];
const visitedCoords = [];
var pathLength = 0;

window.addEventListener('load', () => {
    svg = document.getElementById('svg');
    animate = document.getElementById('motion');
    snakeElement = document.getElementById('snake');
    g = document.getElementById('g');
});

/*
Up: 38
Down: 40
Left: 37
Right: 39
*/
window.addEventListener('keydown', (e) => {
    let direction = snake.direction;
    switch (e.keyCode)
    {
        case (38):
            if (snake.length !== 1 ? snake.direction !== "S" : true)
            {
                snake.direction = "N";
            }
            break;
        case (40):
            if (snake.length !== 1 ? snake.direction !== "N" : true)
            {
                snake.direction = "S";
            }
            break;
        case (37):
            if (snake.length !== 1 ? snake.direction !== "E" : true)
            {
                snake.direction = "W";
            }
            break;
        case (39):
            if (snake.length !== 1 ? snake.direction !== "W" : true)
            {
                snake.direction = "E";
            }
            break;
    }
    if ((e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) && direction !== snake.direction)
    {
        visitedCoords.unshift({
            x: Number(snakeElement.getAttributeNS(null, 'x')),
            y: Number(snakeElement.getAttributeNS(null, 'y'))
        });
        // console.table(visitedCoords);
    }
});

function gameStart()
{
    if (isPaused)
    {
        isPaused = false;
        document.getElementById('startbutton').textContent = 'Start';
    }
    interval = setInterval(() => {
        if (isPaused)
        {
            clearInterval(interval);
        }
        foods.forEach((food) => {
            let svgRect = svg.createSVGRect();
            svgRect.x = Number(food.getAttributeNS(null, 'x'));
            svgRect.y = Number(food.getAttributeNS(null, 'y'));
            svgRect.width = Number(food.getAttributeNS(null, 'width'));
            svgRect.height = Number(food.getAttributeNS(null, 'height'));
            if (svg.checkIntersection(snakeElement, svgRect))
            {
                g.removeChild(food);
                foods.splice(foods.indexOf(food), 1);
                snake.score++;
                snake.length++;
                document.getElementById('scoreboard').textContent = "Score: " + snake.score.toString();
            }
        });

        let lengthHandler = (prev, point) => {
            let prevPoint = visitedCoords[visitedCoords.indexOf(point) - 1];

            if (prevPoint === undefined)
            {
                return prev;
            }

            prev += Math.abs(point.y - prevPoint.y) + Math.abs(point.x - prevPoint.x);

            return prev;
        }
        let temp = null;

        if (visitedCoords.length === 0 || visitedCoords.length === 1)
        {
            pathLength = snake.length * 10;
        }
        else
        {
            pathLength = visitedCoords.reduce(lengthHandler, 0);
        }
        
        while (pathLength > snake.length * 10)
        {
            temp = visitedCoords.pop();
            pathLength = visitedCoords.reduce(lengthHandler, 0);
        }

        if (temp !== null)
        {
            visitedCoords.push(temp);
        }

        let point1 = {
            x: Number(snakeElement.getAttributeNS(null, 'x')),
            y: Number(snakeElement.getAttributeNS(null, 'y'))
        };
        let index = 0;

        while (pathLength > 0)
        {
            if (visitedCoords.length < 0)
            {
                let point2 = {
                    x: visitedCoords[index].x,
                    y: visitedCoords[index].y
                };
                let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                line.setAttributeNS(null, 'x1', point1.x.toString());
                line.setAttributeNS(null, 'y1', point1.y.toString());
                line.setAttributeNS(null, 'x2', point2.x.toString());
                line.setAttributeNS(null, 'y2', point2.y.toString());
                line.setAttributeNS(null, 'style', "stroke:rgb(255, 255, 255);stroke-width:20");
                line.setAttributeNS(null, 'class', 'snakebody');
                g.appendChild(line);
                index++;
                point1 = point2;
                pathLength -= Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
            }
            else
            {
                let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                let x2 = point1.x;
                let y2 = point1.y;
                switch (snake.direction)
                {
                    case ("N"):
                        y2 += snake.length * 10;
                        break;
                    case ("E"):
                        x2 -= snake.length * 10;
                        break;
                    case ("S"):
                        y2 -= snake.length * 10;
                        break;
                    case ("W"):
                        x2 += snake.length * 10;
                        break;
                }
                line.setAttributeNS(null, 'x1', point1.x.toString());
                line.setAttributeNS(null, 'y1', point1.y.toString());
                line.setAttributeNS(null, 'x2', x2.toString());
                line.setAttributeNS(null, 'y2', y2.toString());
                line.setAttributeNS(null, 'style', "stroke:rgb(255, 255, 255);stroke-width:20");
                line.setAttributeNS(null, 'class', 'snakebody');
                g.appendChild(line);
                pathLength = 0;
            }
        }

        switch (snake.direction)
        {
            case ("N"):
                let newY1 = Number(snakeElement.getAttributeNS(null, 'y')) - (0.5 * Math.pow(1.1, snake.score));
                snakeElement.setAttributeNS(null, 'y', `${newY1 < 0 ? 400 : newY1}`);
                break;
            case ("E"):
                let newX1 = Number(snakeElement.getAttributeNS(null, 'x')) + (0.5 * Math.pow(1.1, snake.score));
                snakeElement.setAttributeNS(null, 'x', `${newX1 > 400 ? 0 : newX1}`);
                break;
            case ("S"):
                let newY2 = Number(snakeElement.getAttributeNS(null, 'y')) + (0.5 * Math.pow(1.1, snake.score));
                snakeElement.setAttributeNS(null, 'y', `${newY2 > 400 ? 0 : newY2}`);
                break;
            case ("W"):
                let newX2 = Number(snakeElement.getAttributeNS(null, 'x')) - (0.5 * Math.pow(1.1, snake.score));
                snakeElement.setAttributeNS(null, 'x', `${newX2 < 0 ? 400 : newX2}`);
                break;
        }

        Array.from(document.getElementsByClassName('snakebody')).forEach((item) => g.removeChild(item));
    }, 10);

    foodInterval = setInterval(() => {
        if (isPaused)
        {
            clearInterval(interval);
        }
        let x = Math.ceil(Math.random() * 400);
        let y = Math.ceil(Math.random() * 400);
        let food = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        food.setAttributeNS(null, 'x', x.toString());
        food.setAttributeNS(null, 'y', y.toString());
        food.setAttributeNS(null, 'width', "10");
        food.setAttributeNS(null, 'height', "10");
        food.setAttributeNS(null, 'style', "fill:red");
        food.setAttributeNS(null, 'class', "food");
        g.appendChild(food);
        foods.push(food);
    }, 5000);
}

function gamePause()
{
    isPaused = true;
    document.getElementById('startbutton').textContent = 'Resume';
}

function reset()
{
    clearInterval(interval);
    clearInterval(foodInterval);
    Array.from(document.getElementsByClassName('food')).forEach((item) => g.removeChild(item));
    snake.direction = "E";
    snake.length = 1;
    snake.score = 0;
    snakeElement.setAttributeNS(null, 'x', "0");
    snakeElement.setAttributeNS(null, 'y', "0");
    document.getElementById('startbutton').textContent = 'Start';
    document.getElementById('scoreboard').textContent = "Score: " + snake.score.toString();
    visitedCoords.splice(0, visitedCoords.length);
    foods.splice(0, foods.length);
}