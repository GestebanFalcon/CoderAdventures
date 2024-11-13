//3 types of tiles. Ground, Wall, Void. Each will have default texture. Void kills if traversed. Wall is impassible and blocks traversal.

import defaultGrassLarge from "@/public/defaultGrassLarge.png";

import { Application, Assets, Sprite, TextureSourceLike } from "pixi.js";
import Entity from "./entity";
import Structure from "./structure/structure";
import Board from "./board";

export type TileJSON = {
    entities: {
        maxHealth: number,
        texture: string,
        mainCharacter: boolean,
    }[],
    index: [number, number],
    structure?: {
        texture: string,
        treeType?: string,
        isTree: boolean,
        fruitOrder?: string[]
    },
    texture: string,
    type: "GROUND" | "WALL" | "VOID"
}

export enum TileType {
    GROUND = "GROUND",
    WALL = "WALL",
    VOID = "VOID"
}

export default class Tile {

    public board: Board;
    public structure?: Structure;
    private sprite: Sprite;
    private tileType: TileType;
    private texture: any;
    private entityList: Entity[];

    constructor({ type, textureURL, entities, structure, board }: { structure?: Structure, type: TileType, textureURL?: string, entities?: Entity[], board: Board }) {

        this.board = board;
        if (structure) {
            this.structure = structure;
        }

        this.tileType = type;

        if (entities) {
            this.entityList = [...entities];
        } else {
            this.entityList = [];
        }

        if (textureURL) {
            this.texture = textureURL;
            this.sprite = Sprite.from(this.texture);
            return this;
        }

        //still need to make links for sprite images. Potentially make them have references to a spritesheet instead of a url

        //should only run if no return earlier
        this.texture = "/"
        if (type === TileType.GROUND) {
            this.texture = "https://i.postimg.cc/GmXnNZB0/sandBase.png";
        }
        if (type === TileType.WALL) {
            this.texture = "/"
        }
        if (type === TileType.VOID) {
            this.texture = "/"
        }

        this.sprite = Sprite.from(this.texture);
        return this;
    }

    public getType() {
        return this.tileType;
    }
    public async reRender() {
        this.deRender();
        // this.board.app.stage.addChild(this.sprite);
        await this.render(this.sprite.x, this.sprite.y, this.board.app);
    }

    public deRender() {
        this.structure && this.structure.deRender();
        for (const entity of this.entityList) {
            entity.deRender();
        }
        this.board.app.stage.removeChild(this.sprite);
    }

    public async render(x: number, y: number, app: Application) {
        for (const entity of this.entityList) {
            await entity.render()
        }
        await Assets.load(this.texture);
        this.sprite = Sprite.from(this.texture);

        this.sprite.x = x;
        this.sprite.y = y;
        const timeout = () => {
            return new Promise(resolve => (
                setTimeout(resolve, 200)
            )
            );

        }

        // await timeout();
        app.stage.addChild(this.sprite)


        if (this.structure) {
            await this.structure.render({ app, x, y, width: this.sprite.width, height: this.sprite.height });
        }

    }

    public getTexture(): string {
        return this.texture;
    }
    public setStructure(structure: Structure) {
        this.structure = structure;
    }

    public removeMe() {
        // console.log(this);
        // console.log(this.entityList);
        // console.log(this.entityList.length);
        for (let i = 0; this.entityList.length; i++) {
            console.log(this.entityList[i]);
            console.log(this.entityList[i].isMe());
            if (this.entityList[i].isMe()) {
                this.entityList.splice(i, 1);
            }
        }
    }
    public boonkEntity(boonkedEntity: Entity) {

        const newEntityList = this.entityList.filter(e => {

            return (e !== boonkedEntity);
        });

        this.entityList = newEntityList;
    }
    public addEntity(addedEntity: Entity) {
        this.entityList.push(addedEntity);
    }
    public getMainCharacter() {
        for (const entity of this.entityList) {
            if (entity.isMe()) {
                return entity;
            }
        }
    }
    public getEntities() {
        return ([...this.entityList]);
    }
    // public getEntity() {
    //     const entity = this.entityList[0];
    //     return (entity);
    // }
    public toJSON(index: [number, number]): TileJSON {
        return ({
            entities: (
                this.getEntities().map(entity => (entity.toJSON()))
            ),
            index,
            texture: this.texture,
            structure: this.structure?.toJSON(),
            type: TileType[this.tileType]
        })
    }
    public clone(newBoard: Board) {
        const clonedEntities = this.entityList.map(entity => entity.clone(newBoard));
        // const clonedEntities: Entity[] = [];
        return new Tile({ type: this.tileType, textureURL: this.texture, entities: clonedEntities, structure: this.structure && this.structure.clone(), board: newBoard });
    }

}