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
var speedFactor = 1;
const snakeParts = [];

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
    switch (e.keyCode)
    {
        case (38):
            if (snake.length !== 1 ? snake.direction !== "S" : true)
            {
                snake.direction = "N";
            }
            break;
        case (87):
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
        case (83):
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
        case (65):
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
        case (68):
            if (snake.length !== 1 ? snake.direction !== "W" : true)
            {
                snake.direction = "E";
            }
            break;
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
                speedFactor = Math.pow(1.1, snake.score/2);
                document.getElementById('scoreboard').textContent = "Score: " + snake.score.toString();
            }
        });

        for (let part of snakeParts)
        {
            let svgRect = svg.createSVGRect();
            svgRect.x = Number(part.getAttributeNS(null, 'x'));
            svgRect.y = Number(part.getAttributeNS(null, 'y'));
            svgRect.width = Number(part.getAttributeNS(null, 'width'));
            svgRect.height = Number(part.getAttributeNS(null, 'height'));
            if (svg.checkIntersection(snakeElement, svgRect))
            {
                reset();
                alert('Game Over!\nYour score was ' + snake.score);
                break;
            }
        }

        switch (snake.direction)
        {
            case ("N"):
                let newY1 = Number(snakeElement.getAttributeNS(null, 'y')) - (0.5 * speedFactor);
                snakeElement.setAttributeNS(null, 'y', `${newY1 < 0 ? 400 : newY1}`);
                break;
            case ("E"):
                let newX1 = Number(snakeElement.getAttributeNS(null, 'x')) + (0.5 * speedFactor);
                snakeElement.setAttributeNS(null, 'x', `${newX1 > 400 ? 0 : newX1}`);
                break;
            case ("S"):
                let newY2 = Number(snakeElement.getAttributeNS(null, 'y')) + (0.5 * speedFactor);
                snakeElement.setAttributeNS(null, 'y', `${newY2 > 400 ? 0 : newY2}`);
                break;
            case ("W"):
                let newX2 = Number(snakeElement.getAttributeNS(null, 'x')) - (0.5 * speedFactor);
                snakeElement.setAttributeNS(null, 'x', `${newX2 < 0 ? 400 : newX2}`);
                break;
        }

        if (snake.length > 1)
        {   
            let snakePart = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            snakePart.setAttributeNS(null, 'x', snakeElement.getAttributeNS(null, 'x'));
            snakePart.setAttributeNS(null, 'y', snakeElement.getAttributeNS(null, 'y'));
            snakePart.setAttributeNS(null, 'width', "10");
            snakePart.setAttributeNS(null, 'height', "10");
            snakePart.setAttributeNS(null, 'style', "fill:black");
            g.appendChild(snakePart);
            let svgRect = svg.createSVGRect();
            let loop = setInterval(() => {
                svgRect.x = Number(snakePart.getAttributeNS(null, 'x'));
                svgRect.y = Number(snakePart.getAttributeNS(null, 'y'));
                svgRect.width = Number(snakePart.getAttributeNS(null, 'width'));
                svgRect.height = Number(snakePart.getAttributeNS(null, 'height'));
                if (!svg.checkIntersection(snakeElement, svgRect))
                {
                    snakeParts.push(snakePart);
                    clearInterval(loop);
                }
            }, 10);
            setTimeout(() => {
                g.removeChild(snakePart);
                snakeParts.splice(snakeParts.indexOf(snakePart), 1);
            }, (100 * (snake.length - 1))/(0.5 * speedFactor));
        }
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
        setTimeout(() => {
            if (food.parentElement === g)
            {
                foods.splice(foods.indexOf(food), 1);
                g.removeChild(food);
            }
        }, 10000 * Math.pow(0.9, snake.score/2))
    }, 5000 * Math.pow(0.9, snake.score/2));
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
    foods.splice(0, foods.length);
    speedFactor = 1;
}