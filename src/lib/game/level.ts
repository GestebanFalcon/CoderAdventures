import { Application } from "pixi.js";
import Board from "./board";
import Entity from "./entity";
import Tree from "./structure/tree/tree";
import { TileJSON, TileType } from "./tile";
import Tile from "./tile";
import { TreeType } from "./structure/tree/tree";
import { Direction } from "./entity";
// import levels from "./levels/levels";
import { Dispatch, SetStateAction } from "react";

export type LevelJSON = {
    tiles: TileJSON[],
    index: number,
    dimensions: [number, number],
    mainCoords: [number, number],
    winCon: string,
    adventureName: string

}

export default class Level {

    public app: Application;
    public board: Board;
    private number: number;
    private setup?: Function;
    private removeListeners?: Function;
    public mainCharacter: Entity;
    private winCon;
    private setIsComplete: Dispatch<SetStateAction<boolean>>
    private dimensions: [number, number]
    private startingCoords: [number, number]
    private startingBoard: Board;

    constructor(number: number, app: Application, setIsComplete: Dispatch<SetStateAction<boolean>>, dimensions: [number, number], winCon: string, board?: Board, mainCharacter?: Entity) {

        this.setIsComplete = setIsComplete;
        this.winCon = winCon;
        this.app = app;
        this.number = number;
        this.dimensions = dimensions
        // if (levels[number - 1]) {
        //     this.setup = levels[number - 1];
        // } else {
        //     this.setup = levels[0];
        // }
        this.board = (board ? board : new Board({ app, dimensions }));
        this.mainCharacter = (mainCharacter ? mainCharacter : new Entity({ maxHealth: 30, board: this.board, app: this.app, texture: "https://i.postimg.cc/50jSSKGS/robot-Small.png", me: true }));
        this.startingCoords = this.mainCharacter.getTileCoords();
        this.startingBoard = new Board({ app, dimensions });
        this.startingBoard.cloneFrom(this.board);


    }


    //eventually, setup will also include things such as configuring unique blockly setups and attaching them to their resultant outputs. These setups should not reload every time. 

    //Fuck what i just said. The blocks will be part of the level object itself passed into as an input. therefore they arent tied to the setup function and just chill there each time. The only thing that needs to change is the character they control as an input

    // mango mango mango mango badum bam badum bam
    //and dont you know how sweet it tastes dont you know how sweet it tastes and dont you know how sweet it tastes now that im without yououuuuuuuuu i love newjeans

    async init() {
        const stageDiv = document.getElementById("stageDiv");
        await this.app.init({ width: this.dimensions[1] * 32 * 2, height: this.dimensions[0] * 32 * 2, resizeTo: stageDiv ? stageDiv : undefined });
        this.app.stage.scale.set(2, 2);
        stageDiv?.appendChild(this.app.canvas);
        await this.board.render();
        console.log("board rendered")
        // this.setup && (this.removeListeners = await this.setup(this));
        console.log(this);
    }
    public setWinCon(winCon: string) {
        this.winCon = winCon;
    }
    public getDimensions() {
        return this.dimensions;
    }
    public async reload() {
        this.app.stage.removeChildren();
        this.removeListeners && this.removeListeners();
        setTimeout(async () => {
            this.board = new Board({ app: this.app });
            await this.board.render();
            this.setup && (this.removeListeners = await this.setup(this));
        }, 1000);


    }
    public async renderBoard() {
        await this.board.render();
    }

    public move(direction: string) {
        this.mainCharacter.move(direction);
        console.log(this.mainCharacter.getTileCoords());
        if (this.winCon.substring(0, 4) === "move") {
            try {
                const coords = [parseInt(this.winCon.substring(4, 5)), parseInt(this.winCon.substring(5, 6))] as [number, number]
                console.log(coords);
                if (coords[0] === this.mainCharacter.getTileCoords()[0] && coords[1] === this.mainCharacter.getTileCoords()[1]) {
                    this.setIsComplete(true);
                }
            } catch (err) {
                console.error(err);
            }

        }
    }
    public shake() {
        return this.mainCharacter.shakeTreeBeta();
    }
    public getNumber() {
        return this.number;
    }
    public static fromJSON({ tiles, index, setIsComplete, dimensions, mainCoords, app, winCon }:
        {
            tiles: TileJSON[],
            index: number,
            setIsComplete: Dispatch<SetStateAction<boolean>>,
            dimensions: [number, number],
            mainCoords: [number, number],
            app: Application,
            winCon: string
        }) {

        const board = new Board({ app, tileList: tiles, dimensions });
        console.log(board.board[mainCoords[0]][mainCoords[1]]);
        return new Level(index, app, setIsComplete, dimensions, winCon, board, board.board[mainCoords[0]][mainCoords[1]].getEntities()[0]);
    }
    public toJSON(adventureName: string): LevelJSON {

        const tileList: TileJSON[] = []

        for (let i = 0; i < this.board.board.length; i++) {
            for (let j = 0; j < this.board.board[i].length; j++) {
                const currentTile = this.board.board[i][j];

                tileList.push(currentTile.toJSON([i, j]));
            }
        }

        return (
            {
                tiles: tileList,
                index: this.number,
                dimensions: this.dimensions,
                mainCoords: this.mainCharacter.getTileCoords(),
                winCon: this.winCon,
                adventureName
            }
        )
    }

    public async reset() {
        this.board.deRender();
        console.log("derenderre");
        this.board = new Board({ app: this.app, dimensions: this.dimensions });
        this.board.cloneFrom(this.startingBoard);
        await this.board.render();
        // console.log(this.board);
        // console.log(this.board.board[this.startingCoords[0]][this.startingCoords[1]]);
        // console.log(this.board.board[this.startingCoords[0]][this.startingCoords[1]].getEntities());
        // console.log(this.board.board[this.startingCoords[0]][this.startingCoords[1]].getEntities()[0].isMe());
        const mainCharacter = this.board.board[this.startingCoords[0]][this.startingCoords[1]].getMainCharacter();
        // console.log(mainCharacter);
        // console.log(mainCharacter?.getSprite());
        this.mainCharacter = mainCharacter ? mainCharacter : new Entity({ maxHealth: 30, board: this.board, app: this.app, texture: "https://i.postimg.cc/rmXbRc1v/johnathmald.png", me: true, startingCoords: this.startingCoords });
        // console.log(this.mainCharacter.getSprite());
    }

}

//this code is actually going to make me crash out its so bad.