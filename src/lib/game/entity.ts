import { Application, Sprite, Assets, AnimatedSprite, Texture } from "pixi.js";
import Board from "./board";
import Fruit from "./structure/tree/fruit";
import Item from "./item";
import Tree from "./structure/tree/tree";
import { TileType } from "./tile";

export enum Direction {
    UP,
    DOWN,
    RIGHT,
    LEFT
}

export default class Entity {

    private app: Application;
    private board: Board | undefined
    // reference value SHOULD allow direct manipulation of board. I know its really weird but trust
    private me: boolean
    private tileCoords: [number, number]
    private sprite: Sprite;
    private texture: string;
    private textures: string[];
    private health: number;
    private maxHealth: number;
    private inventory: Fruit[];
    private heldItem?: Fruit;
    private dimensions?: [number, number];
    private openTexture?: string;

    constructor({ board, app, texture, me, startingCoords, maxHealth, dimensions, textures, openTexture }: { board: Board, app: Application, texture: string, me: boolean, startingCoords?: [number, number], dimensions?: [number, number], maxHealth: number, textures?: string[], openTexture?: string }) {
        this.textures = (textures ? [texture, ...textures] : [texture]);
        if (dimensions) {
            this.dimensions = dimensions;
        }
        //if undefined is passed in as board, everthing breaks. So don't let it break please. It is solved by reloading the page i think though. Its client caused and only hurts the client idc.
        this.inventory = [];

        this.app = app;

        this.maxHealth = maxHealth;
        this.health = this.maxHealth;


        this.me = me;
        this.board = board;
        if (startingCoords) {
            this.tileCoords = [...startingCoords];
        } else {
            this.tileCoords = [0, 0];
        }
        this.getTile()?.addEntity(this);
        this.texture = texture;
        openTexture && (this.openTexture = openTexture);
        // this.init(app);
        this.sprite = new Sprite();
        Assets.load(this.textures);
    }
    public async render() {

        await Assets.load(this.textures);
        console.log("loaded texture of" + this);
        if (this.sprite) {
            this.deRender();
        }
        this.sprite = Sprite.from(this.texture);

        this.sprite.zIndex = 1

        // if (this.dimensions) {
        //     this.sprite.width = this.dimensions[0];
        //     this.sprite.height = this.dimensions[1];
        // }

        this.app.stage.addChild(this.sprite);
        console.log("Added child to stage");
        this.sprite.x = this.tileCoords[1] * 32;
        this.sprite.y = this.tileCoords[0] * 32;

        if (!this.me) {
            this.sprite.x += 20;
        }

    }
    public isMe() {
        return this.me;
    }
    public getTexture() {
        return this.texture;
    }
    public getTileCoords() {
        return this.tileCoords;
    }
    private die() {
        this.app.stage.removeChild(this.sprite);
    }
    private spawn() {
        this.app.stage.addChild(this.sprite);
    }
    public takeDamage(damage: number) {
        if (!this.health) {
            return;

        }
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
            this.die();
        }
    }
    public punch(damage: number) {
        const entities = this.getTile()?.getEntities()
        if (entities) {
            for (let i = 0; i < entities.length; i++) {
                if (entities[i] !== this) {
                    entities[i].takeDamage(damage);
                }
            }
        }
    }
    public eatSlot(invSlot: number) {
        if (this.inventory[invSlot]) {
            this.eat(this.inventory[invSlot]);
            this.inventory.splice(invSlot, 1);
        }
    }
    private eat(fruit: Fruit) {
        console.log("nom nom nom");
        if (!this.health || !this.maxHealth) {
            console.log('sad');
            return;
        }
        if (!fruit.isEdible()) {
            console.log("yucky");
            return;
        }
        this.health += fruit.getNutrition()!;
        // gotta trust me isEdible already checks for it
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
        console.log("yum yum " + this.health);

    }
    public teleport(coords: [number, number]) {
        this.sprite.x = coords[1] * 32
        this.sprite.y = coords[0] * 32
        console.log(this.getTile()?.getEntities());
        this.getTile()?.boonkEntity(this);
        console.log(this.getTile()?.getEntities());
        this.setTileCoords([...coords]);
        this.getTile()?.addEntity(this);
        console.log(this.getTile()?.getEntities());
    }
    public move(direction: string) {
        console.log();
        const distance = 32;
        const preCoords: [number, number] = [...this.tileCoords];
        this.getTile()?.boonkEntity(this);

        if (direction === "right") {
            this.tileCoords[1]++;
            if (this.checkCoords(preCoords)) {
                this.sprite.x += distance;
                this.board?.board[this.tileCoords[0]][this.tileCoords[1]].addEntity(this);
            }
        }
        if (direction === "left") {
            this.tileCoords[1]--;
            if (this.checkCoords(preCoords)) {
                this.sprite.x -= distance;
                this.board?.board[this.tileCoords[0]][this.tileCoords[1]].addEntity(this);
            }
        }
        if (direction === "up") {
            this.tileCoords[0]--;
            if (this.checkCoords(preCoords)) {
                this.sprite.y -= distance;
                this.board?.board[this.tileCoords[0]][this.tileCoords[1]].addEntity(this);
            }
        }
        if (direction === "down") {
            this.tileCoords[0]++;
            if (this.checkCoords(preCoords)) {
                this.sprite.y += distance;
                this.board?.board[this.tileCoords[0]][this.tileCoords[1]].addEntity(this);
            }
        }

    }
    private checkCoords(preCoords: [number, number]): boolean {
        if (!this.getTile() || (this.getTile()?.getType() === TileType.VOID)) {
            console.error("You cannot move out of bounds >:(");
            this.tileCoords = preCoords;
            return false;
        }
        this.getTile()?.addEntity(this); //gettile doesnt work only when the entity is in the proecess of being removed from the program
        return true;
    }
    private getTile() {
        return (this.board?.board[this.tileCoords[0]][this.tileCoords[1]]);
        //might be the most awful line of code written
    }
    public getSprite() {
        return this.sprite;
    }
    public shakeTree() {

        console.log("shaking");

        if (this.getTile()?.structure?.shake) {

            console.log("is tree");

            const fruit = this.getTile()?.structure!.shake!();
            //typescript when i literally just checked for it O:
            if (fruit) {
                this.inventory.push(fruit);
                console.log(fruit);
                console.log(this.inventory);
            } else {
                console.log("no fruit :(");
            }


        }
    }
    public shakeTreeBeta(): string {
        if (this.getTile()?.structure?.shake) {

            console.log("is tree");

            const fruit: Fruit = this.getTile()?.structure!.shake!();
            //typescript when i literally just checked for it O:
            if (fruit) {
                this.openTexture && (this.sprite.texture = Texture.from(this.openTexture))
                setTimeout(() => {
                    this.inventory.push(fruit);
                }, 200)
                console.log(fruit);
                console.log(this.inventory);
                this.sprite.texture = Texture.from(this.texture);
                return fruit.getType();

            } else {
                console.log("no fruit :(");

            }


        }
        return ("");
    }
    public setTileCoords(coords: [number, number]) {
        this.tileCoords = [...coords];
    }
    public death() {
        //it should really have a board. it is definitely assigned in the constructor and can only be undefined after this or if i pass in undefined like an ape
        this.getTile()?.boonkEntity(this)
        this.board = undefined;
        this.app.stage.removeChild(this.sprite); //ill finish tomorrow. You still need to cut the cord with the tile and yteah. Look at the sheet. Cut the things it refers to then the things that refer to it if possible.
    }
    public deRender() {
        this.app.stage.removeChild(this.sprite);
    }

    public clone(newBoard: Board): Entity {
        if (!this.board) {
            return this; //this should never happen but just in case --- ai generated comment
        }
        return new Entity({ board: newBoard, app: this.app, texture: this.texture, me: this.me, startingCoords: this.tileCoords, maxHealth: this.maxHealth });
    }

    public toJSON() {
        return {
            texture: this.texture,
            maxHealth: this.maxHealth,
            mainCharacter: this.me,
            startingCoords: this.tileCoords

        }
    }
    public static fromJSON({ app, board, texture, maxHealth, mainCharacter, startingCoords }: { app: Application, board: Board, texture: string, maxHealth: number, mainCharacter: boolean, startingCoords: [number, number] }): Entity {
        return (
            new Entity({ app, board, texture, maxHealth, me: mainCharacter, startingCoords })
        )

    }



}