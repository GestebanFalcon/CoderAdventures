import { Application, Sprite, Assets } from "pixi.js";
import Tile, { TileJSON, TileType } from "./tile";
import Entity from "./entity";
import Structure from "./structure/structure";
import Tree from "./structure/tree/tree";

// board will be generated as an array full of default tile blocks.
// board size is (Currently) 10x10 tiles of size 60px x 60px

export default class Board {

    public app: Application;
    public board: Tile[][] = [];
    // dimensions height by width like a matrix. 4x2 matrix is 4 high 2 wide yknow
    constructor({ app, tileList, dimensions }: {
        app: Application, tileList?: TileJSON[],
        dimensions?: [number, number]
    }) {
        this.app = app

        //if order is not preserved when testing change it to just make the arrays full of null shit and then each tile put it in its exact spot and then assign the finished thing to this.board
        if (tileList && dimensions) {
            console.log("data provided");
            let currentTile;
            for (let i = 0; i < dimensions[0]; i++) {
                this.board[i] = []
                for (let j = 0; j < dimensions[1]; j++) {
                    currentTile = tileList[(i * dimensions[1]) + j];
                    const entitiesList = currentTile.entities.map(entity => new Entity({ app, board: this, maxHealth: entity.maxHealth, texture: entity.texture, me: entity.mainCharacter, startingCoords: [i, j], openTexture: "/robotTorsoOpen(1).png" }));
                    const options: { board: Board, type: TileType, textureURL: string, entities: Entity[], structure?: Structure } = {
                        board: this,
                        type: TileType[currentTile.type],
                        textureURL: currentTile.texture,
                        entities: entitiesList,

                    }
                    currentTile.structure && (options.structure = Tree.fromJSON({ treeType: currentTile.structure.treeType, texture: currentTile.structure.texture, app: this.app, fruitOrder: currentTile.structure.fruitOrder }))
                    //I shouldn't need to spread here but I'll put a comment just in case it breaks.
                    this.board[i][j] = new Tile(options);
                }
            }
            console.log(this.board[5][1]);
        } else {
            if (dimensions) {
                for (let i = 0; i < dimensions[0]; i++) {
                    this.board[i] = [];
                    for (let j = 0; j < dimensions[1]; j++) {
                        this.board[i][j] = new Tile({ type: TileType.GROUND, board: this });
                    }
                }
            } else {
                for (let i = 0; i < 5; i++) {
                    this.board[i] = [];
                    for (let j = 0; j < 5; j++) {
                        this.board[i][j] = new Tile({ type: TileType.GROUND, board: this });
                    }
                }
            }
        }



        return this;
    }

    public async render() {
        console.log("rendering board");
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                await this.board[i][j].render(j * 32, i * 32, this.app);

            }
        }
        console.log(this.board);

    }
    public insertTile(i: number, j: number, tile: Tile) {

        this.board[i][j].deRender();
        this.board[i][j] = tile;
        this.board[i][j].render(j * 32, i * 32, this.app);


    }
    public deRender() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                this.board[i][j].deRender();
            }
        }
    }
    public cloneFrom(oldBoard: Board) {
        for (let i = 0; i < oldBoard.board.length; i++) {
            for (let j = 0; j < oldBoard.board[i].length; j++) {
                this.board[i][j] = oldBoard.board[i][j].clone(this);
            }
        }
    }
    public resetBoard() { }

}