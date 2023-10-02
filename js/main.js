const quantities = {
    mousePos: { x: -1, y: -1 },
    previousMousePos: { x: -1, y: -1 },
    previousPos: {
        "behind": { x: 30, y: 60 },
        "front": { x: 60, y: 30 },
    },
};

const constants = {
    XMLNS: "http://www.w3.org/2000/svg",
    MAX_X: 88,
    MAX_Y: 88,
    SIZE: 212,
};

const utils = {
    updateOverlap: () => {
        const dx = Math.abs(quantities.previousPos.front.x - quantities.previousPos.behind.x) / constants.SIZE;
        const dy = Math.abs(quantities.previousPos.front.y - quantities.previousPos.behind.y) / constants.SIZE;
        const overlap = (1 - dx) * (1 - dy) * 100;
        const overlapElement = document.getElementById("overlap");
        overlapElement.innerText = overlap.toFixed(3) + "%";
    },
    catch: (event) => {
        quantities.previousMousePos.x = parseFloat(event.clientX);
        quantities.previousMousePos.y = parseFloat(event.clientY);
        quantities.mousePos.x = parseFloat(event.clientX);
        quantities.mousePos.y = parseFloat(event.clientY);
        event.currentTarget.addEventListener("mousemove", utils.drag);
        // console.log("init:", quantities.previousMousePos);
    },
    drag: (event) => {
        const newMousePosX = parseFloat(event.clientX);
        const newMousePosY = parseFloat(event.clientY);
        // console.log("new:", newMousePosX, newMousePosY);
        if (quantities.mousePos.x === newMousePosX && quantities.mousePos.y === newMousePosY) {
            return;
        }
        // console.log(quantities.previousMousePos);
        const dx = newMousePosX - quantities.previousMousePos.x;
        const dy = newMousePosY - quantities.previousMousePos.y;
        // console.log("ds:", dx, dy);
        quantities.previousMousePos.x = quantities.mousePos.x;
        quantities.previousMousePos.y = quantities.mousePos.y;
        quantities.mousePos.x = newMousePosX;
        quantities.mousePos.y = newMousePosY;
        const square = event.currentTarget;
        const squareId = square.id;
        const previousPos = quantities.previousPos[squareId];
        // console.log(quantities, dx, dy);
        // debugger;
        let newPos = previousPos.x + dx;
        if (newPos <= constants.MAX_X && newPos >= 0) {
            // console.log("x:", newPos);
            square.style.left = newPos + "px";
            previousPos.x = newPos;
        }
        newPos = previousPos.y + dy;
        if (newPos <= constants.MAX_Y && newPos >= 0) {
            // console.log("y:", newPos);
            square.style.top = newPos + "px";
            previousPos.y = newPos;
        }
        utils.updateOverlap();
    },
    drop: (event) => {
        // console.log("drop");
        quantities.previousMousePos.x = -1;
        quantities.previousMousePos.y = -1;
        quantities.mousePos.x = -1;
        quantities.mousePos.y = -1;
        event.currentTarget.removeEventListener("mousemove", utils.drag);
    },
    attachListeners: (event) => {
        const square1 = document.getElementById("behind");
        const square2 = document.getElementById("front");
        square1.style.top = quantities.previousPos.behind.y + "px";
        square1.style.left = quantities.previousPos.behind.x + "px";
        square2.style.top = quantities.previousPos.front.y + "px";
        square2.style.left = quantities.previousPos.front.x + "px";
        square1.addEventListener("mousedown", utils.catch);
        square1.addEventListener("mouseout", utils.drop);
        square1.addEventListener("mouseup", utils.drop);
        square2.addEventListener("mousedown", utils.catch);
        square2.addEventListener("mouseout", utils.drop);
        square2.addEventListener("mouseup", utils.drop);
    },
    onWindowLoad: (event) => {
        utils.updateOverlap();
        utils.attachListeners(event);
    },
};

function main() {
    window.addEventListener("load", utils.onWindowLoad);
}

main();