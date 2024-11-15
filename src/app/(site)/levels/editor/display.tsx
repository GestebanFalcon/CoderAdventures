"use client"
import { ReactNode, SetStateAction, useCallback, useEffect, useState, MouseEvent } from "react"
import { Application, Assets, Sprite } from "pixi.js";
import Level from "@/lib/game/level";
import { useSearchParams } from "next/navigation";
import Structure from "@/lib/game/structure/structure";
import Entity from "@/lib/game/entity";
import Tile, { TileType } from "@/lib/game/tile";
import { Dispatch } from "react";
import Tree from "@/lib/game/structure/tree/tree";
import defaultGrassLarge from "@/public/defaultGrassLarge.png"

export default function Display() {

    const [winCoords, setWinCoords] = useState([0, 2]);


    const [coords, setCoords] = useState([0, 0]);
    const [winCon, setWinCon] = useState("eatmango")

    const [mode, setMode] = useState<"tile" | "structure" | "entity" | "mainCharacter">("tile");

    const [textures, setTextures] = useState({
        tile: 0,
        structure: 0,
        entity: 0

    })


    const tiles: [string, TileType][] = [["https://i.postimg.cc/hjLY9wMh/default-Grass-Large.png", TileType.GROUND], ["https://i.postimg.cc/WbPVJmRy/water-Base.png", TileType.VOID], ["https://i.postimg.cc/GmXnNZB0/sandBase.png", TileType.GROUND], ["https://i.postimg.cc/3RvMkNt7/sand-Coast-Full-Right.png", TileType.GROUND], ["https://i.postimg.cc/nVYNsyny/sand-Coast-Full-Bottom.png", TileType.GROUND], ["https://i.postimg.cc/W4tcPXrd/sand-Coast-Out-Top-Left.png", TileType.GROUND], ["https://i.postimg.cc/tgfQRWt2/sand-Coast-Bottom-Right.png", TileType.GROUND], ["https://i.postimg.cc/8cxXb3w3/sand-Coast-Full-Middle.png", TileType.GROUND], ["https://i.postimg.cc/RVQB134Z/sand-Coast-Full-Top.png", TileType.GROUND], ["https://i.postimg.cc/hjDGSZLH/grass-Base.png", TileType.GROUND], ["https://i.postimg.cc/1zct11qG/grass-On-Sand-Full-Right.png", TileType.GROUND]];
    const structures: [string, string[]?][] = [["https://i.postimg.cc/rmXbRc1v/johnathmald.png"], ["https://static.vecteezy.com/system/resources/thumbnails/026/795/005/small/mango-fruit-tropical-transparent-png.png"], ["https://i.postimg.cc/zvvGXfMY/palmTree.png"], ["https://i.postimg.cc/zvvGXfMY/palmTree.png", ["pear", "mango", "coconut"]]]
    const entities = ["https://i.postimg.cc/rmXbRc1v/johnathmald.png"]

    const searchParams = useSearchParams();
    const paramLevelNumber = searchParams.get('levelNumber');
    const paramAdventureName = searchParams.get('adventureName');


    const [levelNumber, setLevelNumber] = useState(paramLevelNumber ? parseInt(paramLevelNumber) : 1);
    const [adventureName, setAdventureName] = useState(paramAdventureName ? paramAdventureName : "beta");

    let newNumber;

    if (!levelNumber) {
        newNumber = 999;
    } else {

        try {
            newNumber = +levelNumber
        } catch (err) {
            newNumber = 999
        }

    }

    const [isComplete, setIsComplete] = useState(false);
    const app = new Application();
    const [level, setLevel] = useState(new Level(newNumber, app, setIsComplete, [6, 6], "move02"));

    const handleClick = async (e: MouseEvent) => {
        console.log(mode);
        const stage = document.getElementById("stageDiv");
        if (!stage) {
            return;
        }
        const stageX = stage.getBoundingClientRect().x;
        const stageY = stage.getBoundingClientRect().y;

        const tileX = e.clientX - stageX;
        const tileY = e.clientY - stageY;
        if (!(0 <= tileX && tileX <= level.getDimensions()[1] * 32 * 2 && 0 <= tileY && tileY <= level.getDimensions()[0] * 32 * 2)) {
            return;
        }

        const coords: [number, number] = [Math.floor(tileY / 32 / 2), Math.floor(tileX / 32 / 2)];
        const currentTile = level.board.board[coords[0]][coords[1]];
        console.log(currentTile);
        if (mode === "tile") {
            console.log(tiles[textures.tile]);
            const newTile = new Tile({ textureURL: tiles[textures.tile][0], structure: currentTile.structure, entities: currentTile.getEntities(), board: level.board, type: tiles[textures.tile][1] });
            level.board.insertTile(coords[0], coords[1], newTile);
            console.log(coords);
            console.log(`x: ${tileX}, y: ${tileY}`);

            // console.log(newTile)
            // await Assets.load(tiles[textures.tile]);
            // const sprite = Sprite.from(tiles[textures.tile]);
            // sprite.x = tileX;
            // sprite.y = tileY;
            // app.stage.addChild(sprite);
            // await currentTile.reRender(coords[0] * 60, coords[1] * 60, app)
        }
        if (mode === "structure") {
            currentTile.structure?.deRender();
            currentTile.structure = new Tree({ texture: structures[textures.structure][0], type: "mango", app: level.app, fruitOrder: structures[textures.structure][1] && structures[textures.structure][1] });
            console.log(currentTile);
            await currentTile.reRender();

        }
        if (mode === "entity") {
            currentTile.addEntity(new Entity({ board: level.board, app: level.app, texture: entities[textures.entity], startingCoords: coords, maxHealth: 30, me: false }));
            await currentTile.reRender();
        }
        if (mode === "mainCharacter") {
            level.mainCharacter.teleport(coords);
            // const oldCoords = level.mainCharacter.getTileCoords();
            // level.board.board[oldCoords[0]][oldCoords[1]].removeMe();
            // currentTile.addEntity(level.mainCharacter);
            // level.board.board[oldCoords[0]][oldCoords[1]].reRender();
            currentTile.reRender();
            console.log(level.board.board);
        }

    } //, [mode, textures, level]);
    useEffect(() => {
        level.setWinCon(`move${winCoords[0]}${winCoords[1]}`);
    }, [winCoords]);
    useEffect(() => {
        level.setWinCon(winCon);
    }, [winCon])
    useEffect(() => {

        const pixiInit = async () => {

            // await app.init({ width: 390, height: 390 })
            // document.getElementById("stageDiv")?.appendChild(app.canvas);


            await level.init();
            console.log(level.board.board);


        }

        pixiInit();


    }, [])


    const saveLevel = async () => {
        console.log(levelNumber);
        const levelJSON = level.toJSON(adventureName ? adventureName : "beta");
        console.log(levelJSON);
        await fetch("/api/createLevel", { method: "POST", body: JSON.stringify({ levelJSON: { ...levelJSON, adventureName, index: levelNumber } }) });
    }

    return (
        <div className="w-full h-full px-10">
            <div className="w-full h-full flex items-center justify-center bg-slate-600" onClick={(e) => handleClick(e)}>
                <div className="bg-gray-800 mx-10 my-20 flex-grow flex p-4">
                    <div className=" bg-gray-400 p-8 mr-auto">
                        <div id="stageDiv" className=""></div>
                    </div>


                    <div className="flex flex-col gap-5 items-center justify-center bg-gray-400 min-w-1 px-24">
                        <div className="flex flex-col gap-3 items-center justify-center">
                            <ModeButton tmode="tile" setMode={setMode}>Tile</ModeButton>
                            <ModeButton tmode="structure" setMode={setMode}>Structure</ModeButton>
                            <ModeButton tmode="entity" setMode={setMode}>Entity</ModeButton>
                            <ModeButton tmode="mainCharacter" setMode={setMode}>Coderbot</ModeButton>
                        </div>
                        <button onClick={saveLevel} className="mt-12 text-lg rounded-lg bg-yellow-300 font-bold text-slate-900 p-4">
                            Save
                        </button>
                        <input type="number" value={levelNumber} onChange={(e) => { setLevelNumber(parseInt(e.target.value)) }}></input>
                        <input value={adventureName} onChange={e => { setAdventureName(e.target.value) }}></input>

                        <button onClick={async () => {
                            console.log(level.board.board[coords[0]][coords[1]]);
                            level.board.board[coords[0]][coords[1]].deRender();
                            await level.board.board[coords[0]][coords[1]].render(coords[1] * 32, coords[0] * 32, level.app);
                        }}>
                            Render
                        </button>
                        <input type="number" value={coords[0]} onChange={(e) => { setCoords([parseInt(e.target.value), coords[1]]) }}></input>
                        <input type="number" value={coords[1]} onChange={(e) => { setCoords([coords[0], parseInt(e.target.value)]) }}></input>
                        <input className="mt-8" type="number" value={winCoords[0]} onChange={(e) => { setWinCoords([parseInt(e.target.value), winCoords[1]]) }}></input>
                        <input type="number" value={winCoords[1]} onChange={(e) => { setWinCoords([winCoords[0], parseInt(e.target.value)]) }}></input>
                        <input type="text" value={winCon} onChange={(e) => { setWinCon(e.target.value) }}></input>
                    </div>


                    <div className="flex items-center justify-center ml-auto px-16 bg-gray-400">
                        <div className="flex flex-col gap-4 justify-center items-center">
                            {mode === "tile" && tiles.map((textureURL, index) => (
                                <Option key={index} onClick={() => setTextures({ ...textures, tile: index })} textureURL={textureURL[0]}></Option>
                            ))}
                            {mode === "structure" && structures.map((textureURL, index) => (
                                <Option key={index} onClick={() => setTextures({ ...textures, structure: index })} textureURL={textureURL[0]}></Option>
                            ))}
                            {mode === "entity" && entities.map((textureURL, index) => (
                                <Option key={index} onClick={() => setTextures({ ...textures, entity: index })} textureURL={textureURL}></Option>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ModeButton({ tmode, children, setMode }: { tmode: "tile" | "structure" | "entity" | "mainCharacter", children: ReactNode, setMode: Dispatch<SetStateAction<"tile" | "structure" | "entity" | "mainCharacter">> }) {
    return (
        <button
            className=" rounded-sm bg-yellow-200 font-semibold p-2 text-gray-900 hover:bg-yellow-100"
            onClick={() => {
                console.log(tmode);
                setMode(tmode);
            }}>
            {children}
        </button>
    )
}

function Option({ textureURL, onClick }: { textureURL: string, onClick: Function }) {



    return (
        <button onClick={() => { onClick() }} className=" p-2 ">
            <img src={textureURL} />
        </button>
    )
}

