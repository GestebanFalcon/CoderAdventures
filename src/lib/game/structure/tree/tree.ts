import { Application } from "pixi.js";
import Tile from "../../tile";
import Structure from "../structure";
import Fruit from "./fruit";

export enum TreeType {
    STRAWBERRY = "Strawberry",
    OAK = "Acorn",
    APPLE = "Apple",
    PEAR = "Pear"

}

export default class Tree extends Structure {

    private fruitCount: number;
    private type: string;

    constructor({ texture, type, app }: { texture: string, type: string, app: Application }) {

        super({ texture, app })
        this.fruitCount = Math.round(Math.random() * 5) + 5;
        this.type = type;
        this.isTree = true;

    }

    public interact(): void {
        console.log("its a tree");
    }

    shake(): undefined | Fruit {
        if (this.fruitCount === 0) {
            return;
        }
        // if (Math.random() < 0.5) {
        //     return;
        // }
        this.fruitCount--;
        return (new Fruit({ type: this.type }));
    }

    public clone() {
        return new Tree({ texture: this.texture, type: this.type, app: this.app });
    }

    public toJSON() {
        const json = {
            isTree: true,
            treeType: this.type,
            texture: this.texture
        }
        return json;
    }

    public static fromJSON({ treeType, texture, app }: { treeType?: string, texture: string, app: Application }): any {
        if (treeType) {
            return new Tree({ type: treeType, texture, app: app });
        }
    }

}